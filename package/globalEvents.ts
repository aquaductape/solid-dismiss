import { dismissStack, TDismissStack } from "./dismissStack";
import {
  getNextTabbableElement,
  inverseQuerySelector,
  queryElement,
  _tabbableSelectors as tabbableSelectors,
} from "./utils";

let scrollEventAddedViaTouch = false;
let scrollEventAdded = false;
let pollTimeoutId: number | null = null;
let timestampOfTabkey: number = 0;
let cachedScrollTarget: Element | null = null;
let cachedPolledElement: Element | null = null;

export const globalState: {
  closeByFocusSentinel: boolean;
  addedDocumentClick: boolean;
  documentClickTimeout: number | null;
} = {
  closeByFocusSentinel: false,
  addedDocumentClick: false,
  documentClickTimeout: null,
};

export const onDocumentClick = (e: Event) => {
  const target = e.target as HTMLElement;

  console.log("click doc");
  checkThenClose(
    dismissStack,
    (item) => {
      if (
        item.overlay ||
        item.menuBtnEl.contains(target) ||
        item.containerEl.contains(target)
      )
        return;

      return item;
    },
    (item) => {
      const { setOpen } = item;
      setOpen(false);
    }
  );

  globalState.addedDocumentClick = false;
};

export const onWindowBlur = (e: Event) => {
  const item = dismissStack[dismissStack.length - 1];

  // menuPopup item was the last tabbable item in the document and current focused item is outside of document, such as browser URL bar, then menuPopup/stacks will close
  if (!document.hasFocus()) {
    const difference = e.timeStamp - timestampOfTabkey;
    if (difference < 50) {
      checkThenClose(
        dismissStack,
        (item) => item,
        (item) => {
          const { setOpen } = item;
          setOpen(false);
        }
      );
      return;
    }
  }

  const onBlurWindow = (item: TDismissStack) => {
    if (!item.closeWhenDocumentBlurs) return;
    item.menuBtnEl.focus();

    item.setOpen(false);
  };

  if (item.overlay) return;

  setTimeout(() => {
    const activeElement = document.activeElement;

    if (!activeElement || activeElement.tagName !== "IFRAME") {
      checkThenClose(
        dismissStack,
        (item) => item,
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
          return;
        }

        return item;
      },
      (item) => {
        const { setOpen, menuBtnEl } = item;
        setOpen(false);
      }
    );
  });
};

export const onKeyDown = (e: KeyboardEvent) => {
  const {
    setOpen,
    menuBtnEl,
    cursorKeys,
    closeWhenEscapeKeyIsPressed,
    focusElementOnClose,
  } = dismissStack[dismissStack.length - 1];

  if (e.key === "Tab") {
    timestampOfTabkey = e.timeStamp;
  }

  if (cursorKeys) {
    onCursorKeys(e);
  }

  if (e.key !== "Escape" || !closeWhenEscapeKeyIsPressed) return;

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
  }

  setOpen(false);
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
        return null;
      }

      return item;
    },
    (item) => {
      const { setOpen, focusElementOnClose, menuBtnEl } = item;

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

  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("blur", onWindowBlur);
};

export const removeGlobalEvents = () => {
  if (dismissStack.length) return;

  scrollEventAdded = false;
  globalState.addedDocumentClick = false;
  window.clearTimeout(globalState.documentClickTimeout!);
  globalState.documentClickTimeout = null;
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("click", onDocumentClick);
  window.removeEventListener("blur", onWindowBlur);
  window.removeEventListener("wheel", onScrollClose, {
    capture: true,
  });
  document.body.removeEventListener("touchmove", onTouchMove);
};

const onTouchMove = () => {
  if (scrollEventAddedViaTouch) return;
  scrollEventAddedViaTouch = true;
  console.log("ontouch added!!");

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

/**
 *  Iterate stack backwards, checks item, pass it close callback. First falsy value breaks iteration.
 */
const checkThenClose = <T extends unknown>(
  arr: T[],
  checkCb: (item: T) => T | null | undefined,
  destroyCb: (item: T) => void
) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = checkCb(arr[i]);

    if (item) {
      destroyCb(item);
      continue;
    }

    return;
  }
};

const onCursorKeys = (e: KeyboardEvent) => {
  const keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
  const horizontalKeys = ["ArrowLeft", "ArrowRight"];

  if (!keys.includes(e.key)) return;

  e.preventDefault();

  if (horizontalKeys.includes(e.key)) return;

  const { menuBtnEl, menuPopupEl } = dismissStack[dismissStack.length - 1];

  const activeElement = document.activeElement!;

  if (activeElement === menuBtnEl || activeElement === menuPopupEl) {
    const el =
      e.key === "ArrowDown"
        ? (menuPopupEl?.querySelector(tabbableSelectors) as HTMLElement)
        : inverseQuerySelector(menuPopupEl!, tabbableSelectors);

    if (el) {
      el.focus();
    }
    return;
  }

  const direction: "forwards" | "backwards" =
    e.key === "ArrowDown" ? "forwards" : "backwards";

  const el = getNextTabbableElement({
    from: activeElement,
    direction,
    stopAtElement: menuPopupEl!,
  });

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
    console.log("polling");

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
            return item;
          }
          cachedPolledElement = activeElement;
          pollTimeoutId = window.setTimeout(poll, duration);
        }
        return;
      },
      (item) => {
        const { setOpen, menuBtnEl } = item;

        setOpen(false);

        cachedPolledElement = null;
        pollTimeoutId = null;
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    );
  };

  pollTimeoutId = window.setTimeout(poll, duration);
};
