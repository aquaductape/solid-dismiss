import { TLocalState } from "./localState";
import { queryElement } from "./utils";

export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const {
    overlay,
    open,
    onClickDocumentRef,
    onFocusFromOutsideAppOrTabRef,
    setOpen,
    setFocus,
  } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;
  if (overlay) return;

  if (!open()) return;

  if (!relatedTarget) {
    if (state.addedFocusOutAppEvents) return;
    state.addedFocusOutAppEvents = true;
    state.prevFocusedEl = e.target as HTMLElement;

    document.addEventListener("click", onClickDocumentRef);
    state.prevFocusedEl!.addEventListener(
      "focus",
      onFocusFromOutsideAppOrTabRef,
      {
        once: true,
      }
    );
    return;
  }

  state.containerFocusTimeoutId = window.setTimeout(() => {
    console.log("focusout");

    setOpen(false);

    if (setFocus) {
      setFocus(false);
    }
  });
};

export const onFocusInContainer = (state: TLocalState) => {
  clearTimeout(state.containerFocusTimeoutId!);
  clearTimeout(state.menuButtonBlurTimeoutId!);

  state.containerFocusTimeoutId = null;

  if (state.setFocus) {
    state.setFocus(true);
  }
};

export const runFocusOnActive = (state: TLocalState) => {
  const { focusElementOnOpen } = state;
  if (focusElementOnOpen == null) return;

  const el = queryElement(state, { inputElement: focusElementOnOpen });
  if (el) {
    el.focus();
  }
};
