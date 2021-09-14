import { dismissStack, TDismissStack } from "./dismissStack";
import {
  getNextTabbableElement,
  inverseQuerySelector,
  _tabbableSelectors as tabbableSelectors,
} from "./utils";

let scrollEventAddedViaTouch = false;
let scrollEventAdded = false;
let cachedScrollTarget: Element | null = null;
let cachedPolledElement: Element | null = null;
let pollTimeoutId: number | null = null;

export const onWindowBlur = () => {
  const item = dismissStack[dismissStack.length - 1];

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
        const { menuPopupEl } = item;

        if (menuPopupEl.contains(activeElement)) {
          cachedPolledElement = activeElement;

          pollingIframe();

          document.addEventListener("visibilitychange", onVisibilityChange);
          return;
        }

        return item;
      },
      (item) => item.setOpen(false)
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

  if (cursorKeys) {
    onCursorKeys(e);
  }

  if (e.key !== "Escape" || !closeWhenEscapeKeyIsPressed) return;

  const el =
    queryElement(focusElementOnClose, "focusElementOnClose", "escapeKey") ||
    menuBtnEl;

  if (el) {
    el.focus();
  }

  setOpen(false);
};

export const onScrollClose = (e: Event) => {
  const target = e.target as HTMLElement;

  if (cachedScrollTarget === target) return;

  console.log("run expensive");

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
      item.setOpen(false);

      const el =
        queryElement(
          item.focusElementOnClose,
          "focusElementOnClose",
          "scrolling"
        ) || item.menuBtnEl;

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

  console.log("addGlobalEvents");
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("blur", onWindowBlur);
};

export const removeGlobalEvents = () => {
  if (dismissStack.length) return;

  scrollEventAdded = false;
  console.log("removeGlobalEvents");
  document.removeEventListener("keydown", onKeyDown);
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

  clearInterval(pollTimeoutId!);
};

// polls iframe to deal with edge case if menuPopup item selected is an iframe and then select another iframe that is "outside" of menuPopup
const pollingIframe = () => {
  // worst case scenerio is user has to wait for up to 300ms for menuPop to close, while average case is 150ms
  const duration = 300;

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
        const { menuPopupEl } = item;

        if (menuPopupEl && menuPopupEl.contains(activeElement)) {
          cachedPolledElement = activeElement;
          pollTimeoutId = window.setTimeout(poll, duration);
          return;
        }

        return item;
      },
      (item) => {
        item.setOpen(false);
        cachedPolledElement = null;
        pollTimeoutId = null;
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    );
  };

  pollTimeoutId = window.setTimeout(poll, duration);
};

const queryElement = (
  inputElement: any,
  type?: "focusElementOnClose",
  subType?: "tabForwards" | "tabBackwards" | "click" | "escapeKey" | "scrolling"
): HTMLElement => {
  if (typeof inputElement === "string") {
    return document.querySelector(inputElement) as HTMLElement;
  }
  if (inputElement instanceof Element) {
    return inputElement as HTMLElement;
  }

  if (typeof inputElement === "function") {
    const result = inputElement();
    if (result instanceof Element) {
      return result as HTMLElement;
    }
  }

  if (type === "focusElementOnClose") {
    if (!inputElement) return null as any;

    switch (subType) {
      case "tabForwards":
        return queryElement(inputElement.tabForwards);
      case "tabBackwards":
        return queryElement(inputElement.tabBackwards);
      case "click":
        return queryElement(inputElement.click);
      case "escapeKey":
        return queryElement(inputElement.escapeKey);
      case "scrolling":
        return queryElement(inputElement.scrolling);
    }
  }

  if (inputElement == null) return null as any;

  for (const key in inputElement as { [key: string]: any }) {
    const item = (inputElement as { [key: string]: any })[key];
    return queryElement(item);
  }

  return null as any;
};
