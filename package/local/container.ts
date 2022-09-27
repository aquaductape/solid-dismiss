import { dismissStack } from "../global/dismissStack";
import { globalState, onDocumentClick } from "../global/globalEvents";
import { queryElement } from "../utils/queryElement";
import { TLocalState } from "./localState";

// Safari, if relatedTarget is not contained within focusout, it will be null
export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const {
    overlay,
    overlayElement,
    open,
    mount,
    setOpen,
    timeouts,
    stopComponentEventPropagation,
    focusedMenuBtn,
  } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;

  if (overlay) return;
  if (overlayElement) return;

  if (!open()) return;

  if (globalState.closedBySetOpen) {
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
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
    }
    return;
  }

  timeouts.containerFocusTimeoutId = window.setTimeout(() => {
    globalState.closedByEvents = true;
    setOpen(false);
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  const { timeouts } = state;
  clearTimeout(timeouts.containerFocusTimeoutId!);
  clearTimeout(timeouts.menuButtonBlurTimeoutId!);

  timeouts.containerFocusTimeoutId = null;
};

export const runFocusOnActive = (state: TLocalState) => {
  const { focusElementOnOpen, focusedMenuBtn } = state;
  if (focusElementOnOpen == null) return;

  const el = queryElement(state, {
    inputElement: focusElementOnOpen,
    type: "focusElementOnOpen",
  });

  if (el) {
    setTimeout(() => {
      el.focus();
      focusedMenuBtn.el = null;
    });
  }
};
