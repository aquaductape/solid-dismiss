import { dismissStack } from "./dismissStack";
import { globalState } from "./globalEvents";
import { TLocalState } from "./localState";
import { queryElement } from "./utils";

export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const {
    id,
    uniqueId,
    overlay,
    open,
    containerEl,
    mount,
    onClickDocumentRef,
    onFocusFromOutsideAppOrTabRef,
    setOpen,
    setFocus,
  } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;

  if (overlay) return;

  if (mount && globalState.closeByFocusSentinel) {
    if (dismissStack.findIndex((item) => item.uniqueId === uniqueId) <= 0) {
      globalState.closeByFocusSentinel = false;
    }
    return;
  }

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
    setOpen(false);

    if (setFocus) {
      setFocus(false);
    }
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  console.log("FocusIN", state.uniqueId);
  // if (state.stopPropagateFocusInAndFocusOut) {
  //   e.stopPropagation();
  // }
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
