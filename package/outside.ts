import { TLocalState } from "./localState";

export const onFocusFromOutsideAppOrTab = (
  state: TLocalState,
  e: FocusEvent
) => {
  const { containerEl, setOpen, onClickDocumentRef } = state;

  if (containerEl!.contains(e.target as HTMLElement)) return;

  debugger;
  setOpen(false);
  state.prevFocusedEl = null;
  state.addedFocusOutAppEvents = false;
  document.removeEventListener("click", onClickDocumentRef);
};

export const onClickDocument = (state: TLocalState, e: MouseEvent) => {
  const { containerEl, setOpen, onFocusFromOutsideAppOrTabRef } = state;

  if (!containerEl) return;
  if (containerEl!.contains(e.target as HTMLElement)) return;

  if (state.prevFocusedEl) {
    state.prevFocusedEl.removeEventListener(
      "focus",
      onFocusFromOutsideAppOrTabRef
    );
  }
  state.prevFocusedEl = null;

  debugger;
  setOpen(false);
  state.addedFocusOutAppEvents = false;
};

export const removeOutsideFocusEvents = (state: TLocalState) => {
  const { onFocusFromOutsideAppOrTabRef, onClickDocumentRef } = state;
  if (!state.prevFocusedEl) return;

  console.log("removeOutsideFocusEvents");
  state.prevFocusedEl.removeEventListener(
    "focus",
    onFocusFromOutsideAppOrTabRef
  );
  document.removeEventListener("click", onClickDocumentRef);
  state.prevFocusedEl = null;
};
