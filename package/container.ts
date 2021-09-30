import { JSX } from "solid-js";
import { dismissStack } from "./dismissStack";
import { globalState, onDocumentClick } from "./globalEvents";
import { TLocalState } from "./localState";
import { queryElement } from "./utils";

// Safari, if relatedTarget is not contained within focusout, it will be null
export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const {
    uniqueId,
    overlay,
    overlayElement,
    open,
    mount,
    setOpen,
    timeouts,
    stopComponentEventPropagation,
  } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;
  const activeElement = document.activeElement as HTMLElement;

  // console.log("focusout", { relatedTarget, activeElement });
  if (overlay) return;
  if (overlayElement) return;

  if (!open()) return;

  if (globalState.closedBySetOpen) {
    console.log("BLOCKED");
    return;
  }

  if (mount && stopComponentEventPropagation) {
    if (!globalState.addedDocumentClick) {
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
    }
    return;
  }

  if (!relatedTarget) {
    if (dismissStack.find((item) => item.overlay)) return;

    if (!globalState.addedDocumentClick) {
      console.log("add doc click");
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
    }
    return;
  }

  timeouts.containerFocusTimeoutId = window.setTimeout(() => {
    // console.log("remove", relatedTarget);
    console.log(" removed by containerFocusTimeout");
    globalState.closedByEvents = true;
    setOpen(false);
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  const { timeouts } = state;
  // if (state.stopPropagateFocusInAndFocusOut) {
  //   e.stopPropagation();
  // }
  // console.log("focusin");
  clearTimeout(timeouts.containerFocusTimeoutId!);
  clearTimeout(timeouts.menuButtonBlurTimeoutId!);

  timeouts.containerFocusTimeoutId = null;
};

export const runFocusOnActive = (state: TLocalState) => {
  const { focusElementOnOpen } = state;
  if (focusElementOnOpen == null) return;

  const el = queryElement(state, {
    inputElement: focusElementOnOpen,
    type: "focusElementOnOpen",
  });
  if (el) {
    setTimeout(() => {
      el.focus();
    });
  }
};
