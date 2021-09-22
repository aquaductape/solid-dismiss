import { dismissStack } from "./dismissStack";
import { globalState, onDocumentClick } from "./globalEvents";
import { TLocalState } from "./localState";
import { queryElement } from "./utils";

// Safari, if relatedTarget is not contained within focusout, it will be null
export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const { uniqueId, overlay, open, mount, setOpen, timeouts } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;
  const activeElement = document.activeElement as HTMLElement;

  console.log("focusout", { relatedTarget, activeElement });
  if (overlay) return;

  // if (mount && globalState.closeByFocusSentinel) {
  //   console.log("closebysentinel");
  //   if (dismissStack.findIndex((item) => item.uniqueId === uniqueId) <= 0) {
  //     globalState.closeByFocusSentinel = false;
  //   }
  //   return;
  // }

  if (!open()) return;

  if (!relatedTarget) {
    if (dismissStack.find((item) => item.overlay)) return;
    //     const [_, overlayIdx] = findItemReverse(
    //       dismissStack,
    //       (item) => item.overlay
    //     );
    //     const currentIdx = dismissStack.findIndex(
    //       (item) => item.uniqueId === uniqueId
    //     );
    //
    //     if (overlayIdx > currentIdx) {
    //       if (!globalState.addedDocumentClick) {
    //         globalState.addedDocumentClick = true;
    //         // globalState.documentClickTimeout = window.setTimeout(() => {
    //         document.addEventListener(
    //           "click",
    //           () => {
    //             document.addEventListener("click", onDocumentClick, {
    //               once: true,
    //             });
    //           },
    //           { once: true }
    //         );
    //         // });
    //       }
    //       return;
    //     }
    //     if (state.addedFocusOutAppEvents) return;
    //     state.addedFocusOutAppEvents = true;
    //     state.prevFocusedEl = e.target as HTMLElement;
    //

    if (!globalState.addedDocumentClick) {
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
      // document.addEventListener(
      //   "click",
      //   () => {
      //   },
      //   { once: true }
      // );
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

  timeouts.containerFocusTimeoutId = window.setTimeout(() => {
    console.log("remove", relatedTarget);
    setOpen(false);
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  const { timeouts } = state;
  // if (state.stopPropagateFocusInAndFocusOut) {
  //   e.stopPropagation();
  // }
  console.log("focusin");
  clearTimeout(timeouts.containerFocusTimeoutId!);
  clearTimeout(timeouts.menuButtonBlurTimeoutId!);

  timeouts.containerFocusTimeoutId = null;
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
