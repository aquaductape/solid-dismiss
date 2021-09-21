import { dismissStack } from "./dismissStack";
import { globalState, onDocumentClick } from "./globalEvents";
import { TLocalState } from "./localState";
import { findItemReverse, queryElement } from "./utils";

// I think... In Safari when a focusable element is mousedown, then focus events run
// while in other browsers, when a focusable element is clicked, then focus events run
export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const { uniqueId, overlay, open, mount, setOpen } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;
  const activeElement = document.activeElement as HTMLElement;

  if (overlay) return;

  if (mount && globalState.closeByFocusSentinel) {
    if (dismissStack.findIndex((item) => item.uniqueId === uniqueId) <= 0) {
      globalState.closeByFocusSentinel = false;
    }
    return;
  }

  if (!open()) return;

  console.log("focusout", { relatedTarget });
  if (!relatedTarget) {
    const [_, overlayIdx] = findItemReverse(
      dismissStack,
      (item) => item.overlay
    );
    const currentIdx = dismissStack.findIndex(
      (item) => item.uniqueId === uniqueId
    );
    if (overlayIdx > currentIdx) return;
    //     if (state.addedFocusOutAppEvents) return;
    //     state.addedFocusOutAppEvents = true;
    //     state.prevFocusedEl = e.target as HTMLElement;
    //

    if (!globalState.addedDocumentClick) {
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
    }

    //     state.prevFocusedEl!.addEventListener(
    //       "focus",
    //       onFocusFromOutsideAppOrTabRef,
    //       {
    //         once: true,
    //       }
    //     );
    return;
  }

  state.containerFocusTimeoutId = window.setTimeout(() => {
    console.log("remove", relatedTarget);
    setOpen(false);
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  // if (state.stopPropagateFocusInAndFocusOut) {
  //   e.stopPropagation();
  // }
  console.log("focusin");
  clearTimeout(state.containerFocusTimeoutId!);
  clearTimeout(state.menuButtonBlurTimeoutId!);

  state.containerFocusTimeoutId = null;
};

export const runFocusOnActive = (state: TLocalState) => {
  const { focusElementOnOpen } = state;
  if (focusElementOnOpen == null) return;

  const el = queryElement(state, { inputElement: focusElementOnOpen });
  if (el) {
    setTimeout(() => {
      el.focus();
    });
  }
};
