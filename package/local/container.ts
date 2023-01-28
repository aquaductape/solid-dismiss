import { dismissStack } from "../global/dismissStack";
import { globalState } from "../global/globalEvents";
import { checkThenClose } from "../utils/checkThenClose";
import { queryElement } from "../utils/queryElement";
import { TLocalState } from "./localState";
import {
  addEventsToActiveMountedPopup,
  getActiveMountedPopupFromSafeList,
  removeEventsOnActiveMountedPopup,
} from "./thirdPartyPopup";

export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const {
    overlayElement,
    trapFocus,
    timeouts,
    closeWhenDocumentBlurs,
    mountedPopupsSafeList,
  } = state;

  timeoutFocusOutFired = false;

  if (globalState.thirdPartyPopupEl) {
    removeEventsOnActiveMountedPopup();
  }
  if (globalState.closedBySetOpen) return;
  if (globalState.overlayMouseDown) return;
  if (overlayElement && trapFocus) return;
  if (!closeWhenDocumentBlurs && !document.hasFocus()) return;

  const dismissStackLength = dismissStack.length;

  setTimeoutFocusOut(timeouts, () => {
    if (mountedPopupsSafeList) {
      if (getActiveMountedPopupFromSafeList(mountedPopupsSafeList)) {
        addEventsToActiveMountedPopup();
        return;
      }
    }

    // fixes issue where race condition of new item mounts before timeout focusout fires
    // therefore focused item which is menuButton, the new container doesn't contain, so removes stack
    if (dismissStackLength < dismissStack.length) return;

    globalState.closedByEvents = true;

    checkThenClose(
      dismissStack,
      (item) => {
        const { containerEl } = item;

        const clickTarget = globalState.clickTarget;
        if (clickTarget && containerEl.contains(clickTarget)) {
          return { continue: false };
        }

        if (containerEl.contains(document.activeElement)) {
          return { continue: false };
        }

        return { item, continue: true };
      },
      (item) => {
        const { setOpen } = item;
        setOpen(false);
      }
    );
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  const { timeouts } = state;

  clearTimeout(timeouts.containerFocusTimeoutId!);
  clearTimeout(timeouts.menuButtonBlurTimeoutId!);
};

export const runFocusOnActive = (state: TLocalState) => {
  const { focusElementOnOpen, focusedMenuBtn } = state;
  if (focusElementOnOpen == null) {
    return;
  }

  const el = queryElement(state, {
    inputElement: focusElementOnOpen,
    type: "focusElementOnOpen",
  });

  if (el) {
    setTimeout(() => {
      el.focus({ preventScroll: el === state.menuPopupEl });
      focusedMenuBtn.el = null;
    });
  }
};

let timeoutFocusOutFired = false;
const setTimeoutFocusOut = (
  timeouts: TLocalState["timeouts"],
  cb: () => void
) => {
  timeouts.containerFocusTimeoutId = window.setTimeout(() => {
    if (timeoutFocusOutFired) return;
    timeoutFocusOutFired = true;
    cb();
  });
};
