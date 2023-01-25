import { dismissStack, TDismissStack } from "./dismissStack";
import { getMenuButton } from "../local/menuButton";
import { getNextTabbableElement } from "../utils/tabbing";
import { checkThenClose } from "../utils/checkThenClose";
import { queryElement } from "../utils/queryElement";
import {
  getFirstVisibleMountedPopupFromSafeList,
  removeEventsOnActiveMountedPopup,
} from "../local/thirdPartyPopup";
import isHiddenOrInvisbleShallow from "../utils/isHiddenOrInvisibleShallow";

let scrollEventAddedViaTouch = false;
let scrollEventAdded = false;
let pollTimeoutId: number | null = null;
let timestampOfTabkey: number = 0;
let cachedScrollTarget: Element | null = null;
let cachedPolledElement: Element | null = null;

export const globalState: {
  closeByFocusSentinel: boolean;
  closedBySetOpen: boolean;
  documentClickTimeout: number | null;
  menuBtnEl?: HTMLElement | null;
  focusedMenuBtns: Set<{ el: HTMLElement | null }>;
  closedByEvents: boolean;
  cursorKeysPrevEl: HTMLElement | null;
  clickTarget: HTMLElement | null;
  overlayMouseDown: boolean;
  thirdPartyPopupEl: HTMLElement | null;
  thirdPartyPopupElPressedEscape: boolean;
} = {
  closeByFocusSentinel: false,
  closedBySetOpen: false,
  documentClickTimeout: null,
  closedByEvents: false,
  focusedMenuBtns: new Set(),
  cursorKeysPrevEl: null,
  clickTarget: null,
  overlayMouseDown: false,
  thirdPartyPopupEl: null,
  thirdPartyPopupElPressedEscape: false,
};

export const onDocumentPointerUp = () => {
  globalState.clickTarget = null;
  document.removeEventListener("pointerup", onDocumentPointerUp);
};

export const onDocumentPointerDown = (e: Event) => {
  const target = e.target as HTMLElement;

  globalState.clickTarget = target;
  document.addEventListener("pointerup", onDocumentPointerUp);
};

export const onWindowBlur = (e: Event) => {
  const item = dismissStack[dismissStack.length - 1];

  // menuPopup item was the last tabbable item in the document and current focused item is outside of document, such as browser URL bar, then menuPopup/stacks will close
  setTimeout(() => {
    const difference = e.timeStamp - timestampOfTabkey;
    if (!document.hasFocus()) {
      if (difference < 50) {
        checkThenClose(
          dismissStack,
          (item) => ({ item, continue: true }),
          (item) => {
            const { setOpen } = item;
            globalState.closedByEvents = true;
            setOpen(false);
          }
        );
        return;
      }
    }
  });

  const onBlurWindow = (item: TDismissStack) => {
    if (item.overlay || item.overlayEl) return;
    if (!item.closeWhenDocumentBlurs) return;
    const menuBtnEl = getMenuButton(item.menuBtnEls);
    menuBtnEl.focus();
    globalState.closedByEvents = true;
    item.setOpen(false);
  };

  if (item.overlay) return;

  setTimeout(() => {
    const activeElement = document.activeElement;

    if (!activeElement || activeElement.tagName !== "IFRAME") {
      checkThenClose(
        dismissStack,
        (item) => ({ item, continue: true }),
        (item) => onBlurWindow(item)
      );
      return;
    }

    checkThenClose(
      dismissStack,
      (item) => {
        const { containerEl } = item;

        if (containerEl.contains(activeElement)) {
          cachedPolledElement = activeElement;

          pollingIframe();

          document.addEventListener("visibilitychange", onVisibilityChange);
          return { continue: false };
        }

        return { item, continue: true };
      },
      (item) => {
        const { setOpen } = item;
        globalState.closedByEvents = true;
        setOpen(false);
      }
    );
  });
};

export const onKeyDown = (e: KeyboardEvent) => {
  const {
    setOpen,
    menuBtnEls,
    cursorKeys,
    closeWhenEscapeKeyIsPressed,
    focusElementOnClose,
    ignoreMenuPopupWhenTabbing,
    focusSentinelAfterEl,
    focusSentinelBeforeEl,
    mountedPopupsSafeList,
  } = dismissStack[dismissStack.length - 1];

  if (e.key === "Tab") {
    if (ignoreMenuPopupWhenTabbing) {
      e.preventDefault();
      const shiftKey = e.shiftKey;
      // TODO: work with stacks?
      const menuBtnEl = getMenuButton(menuBtnEls);

      const el = getNextTabbableElement({
        from: shiftKey ? focusSentinelBeforeEl! : focusSentinelAfterEl!,
        direction: shiftKey ? "backwards" : "forwards",
        ignoreElement: menuBtnEl ? [menuBtnEl] : [],
      });

      if (el) {
        el.focus();
      }
      return;
    }
    timestampOfTabkey = e.timeStamp;
  }

  if (cursorKeys) {
    onCursorKeys(e);
  }

  if (e.key !== "Escape" || !closeWhenEscapeKeyIsPressed) return;

  if (globalState.thirdPartyPopupElPressedEscape) {
    globalState.thirdPartyPopupElPressedEscape = false;
    removeEventsOnActiveMountedPopup();
    return;
  }

  if (mountedPopupsSafeList && mountedPopupsSafeList.length) {
    const el = getFirstVisibleMountedPopupFromSafeList(mountedPopupsSafeList);
    if (el) {
      window.setTimeout(() => {
        if (!el.isConnected || isHiddenOrInvisbleShallow(el)) return;
        close();
      }, 100);
      return;
    }
  }

  function close() {
    const menuBtnEl = getMenuButton(menuBtnEls);

    const el =
      queryElement(
        {},
        {
          inputElement: focusElementOnClose,
          type: "focusElementOnClose",
          subType: "escapeKey",
        }
      ) || menuBtnEl;

    if (el) {
      el.focus();
      if (el === menuBtnEl) {
        // TODO:?
        // markFocusedMenuButton({ focusedMenuBtn, timeouts, el });
      }
    }
    globalState.closedByEvents = true;
    setOpen(false);
  }

  close();
};

export const onScrollClose = (e: Event) => {
  const target = e.target as HTMLElement;

  if (cachedScrollTarget === target) return;

  checkThenClose(
    dismissStack,
    (item) => {
      const { menuPopupEl } = item;

      if (menuPopupEl!.contains(target)) {
        cachedScrollTarget = target;
        return { continue: false };
      }

      return { item, continue: true };
    },
    (item) => {
      const { setOpen, focusElementOnClose, menuBtnEls } = item;
      const menuBtnEl = getMenuButton(menuBtnEls);

      globalState.closedByEvents = true;
      setOpen(false);

      const el =
        queryElement(
          {},
          {
            inputElement: focusElementOnClose,
            type: "focusElementOnClose",
            subType: "scrolling",
          }
        ) || menuBtnEl;

      if (el) {
        el.focus();
      }
    }
  );
};

export const addGlobalEvents = (closeWhenScrolling: boolean) => {
  cachedScrollTarget = null;

  if (!scrollEventAdded && closeWhenScrolling) {
    scrollEventAdded = false;

    window.addEventListener("wheel", onScrollClose, {
      capture: true,
      passive: true,
    });
    document.body.addEventListener("touchmove", onTouchMove);
  }

  if (dismissStack.length) return;

  document.addEventListener("pointerdown", onDocumentPointerDown);
  document.addEventListener("pointerup", onDocumentPointerUp);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("blur", onWindowBlur);
};

export const removeGlobalEvents = () => {
  if (dismissStack.length) return;

  scrollEventAdded = false;
  globalState.cursorKeysPrevEl = null;
  globalState.clickTarget = null;
  // globalState.menuBtnEl = null;
  window.clearTimeout(globalState.documentClickTimeout!);
  globalState.documentClickTimeout = null;
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  window.removeEventListener("blur", onWindowBlur);
  window.removeEventListener("wheel", onScrollClose, {
    capture: true,
  });
  document.body.removeEventListener("touchmove", onTouchMove);
};

const onTouchMove = () => {
  if (scrollEventAddedViaTouch) return;
  scrollEventAddedViaTouch = true;

  document.body.addEventListener(
    "touchend",
    () => {
      scrollEventAddedViaTouch = false;
    },
    { once: true }
  );

  window.addEventListener("scroll", onScrollClose, {
    capture: true,
    passive: true,
    once: true,
  });
};

const onCursorKeys = (e: KeyboardEvent) => {
  const keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
  const horizontalKeys = ["ArrowLeft", "ArrowRight"];

  if (!keys.includes(e.key)) return;

  e.preventDefault();

  if (horizontalKeys.includes(e.key)) return;

  const {
    menuBtnEls,
    menuPopupEl,
    containerEl,
    focusSentinelBeforeEl,
    focusSentinelAfterEl,
    cursorKeys,
  } = dismissStack[dismissStack.length - 1];
  const menuBtnEl = getMenuButton(menuBtnEls);

  let activeElement = globalState.cursorKeysPrevEl || document.activeElement!;

  let direction: "forwards" | "backwards";

  if (e.key === "ArrowDown") {
    direction = "forwards";
  } else {
    direction = "backwards";
  }

  if (
    activeElement === menuBtnEl ||
    activeElement === menuPopupEl ||
    activeElement === containerEl
  ) {
    if (e.key === "ArrowUp") {
      direction = "backwards";
      activeElement = focusSentinelAfterEl!;
    } else {
      direction = "forwards";
      activeElement = focusSentinelBeforeEl!;
    }
  }

  const isCursorKeysArgObj = typeof cursorKeys === "object";

  const willWrap = isCursorKeysArgObj && cursorKeys.wrap;
  let el = getNextTabbableElement({
    from: activeElement,
    direction,
    stopAtRootElement: menuPopupEl!,
  });

  if (!el && willWrap) {
    const from =
      e.key === "ArrowDown" ? focusSentinelBeforeEl! : focusSentinelAfterEl!;
    direction = e.key === "ArrowDown" ? "forwards" : "backwards";

    el = getNextTabbableElement({
      from,
      direction,
      stopAtRootElement: containerEl!,
    });
  }

  if (isCursorKeysArgObj && cursorKeys.onKeyDown) {
    cursorKeys.onKeyDown({
      currentEl: el,
      prevEl: globalState.cursorKeysPrevEl,
    });

    globalState.cursorKeysPrevEl = el;
    return;
  }

  if (el) {
    el.focus();
  }
};

const onVisibilityChange = () => {
  if (document.visibilityState === "visible" && pollTimeoutId != null) {
    pollingIframe();
    return;
  }

  clearTimeout(pollTimeoutId!);
};

// polls iframe to deal with edge case if menuPopup item selected is an iframe and then select another iframe that is "outside" of menuPopup
const pollingIframe = () => {
  // worst case scenerio is user has to wait for up to 250ms for menuPopup to close, while average case is 125ms
  const duration = 250;

  const poll = () => {
    const activeElement = document.activeElement as HTMLElement;

    if (!activeElement) {
      return;
    }

    if (cachedPolledElement === activeElement) {
      pollTimeoutId = window.setTimeout(poll, duration);
      return;
    }

    checkThenClose(
      dismissStack,
      (item) => {
        const { containerEl } = item;

        if (activeElement.tagName === "IFRAME") {
          if (containerEl && !containerEl.contains(activeElement)) {
            return { item, continue: true };
          }
          cachedPolledElement = activeElement;
          pollTimeoutId = window.setTimeout(poll, duration);
          return { continue: false };
        }

        if (containerEl && !containerEl.contains(activeElement)) {
          return { item, continue: true };
        }

        return { continue: false };
      },
      (item) => {
        const { setOpen } = item;
        globalState.closedByEvents = true;
        setOpen(false);

        cachedPolledElement = null;
        pollTimeoutId = null;
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    );
  };

  pollTimeoutId = window.setTimeout(poll, duration);
};
