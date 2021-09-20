import { dismissStack } from "./dismissStack";
import { globalState } from "./globalEvents";
import { TLocalState } from "./localState";
import { findItemReverse, queryElement } from "./utils";

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
    const [_, overlayIdx] = findItemReverse(
      dismissStack,
      (item) => item.overlay
    );
    const currentIdx = dismissStack.findIndex(
      (item) => item.uniqueId === uniqueId
    );
    if (overlayIdx > currentIdx) return;
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
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  // if (state.stopPropagateFocusInAndFocusOut) {
  //   e.stopPropagation();
  // }
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
