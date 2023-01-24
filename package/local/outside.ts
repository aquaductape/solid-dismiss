import { globalState } from "../global/globalEvents";
import { TLocalState } from "./localState";

export const onFocusFromOutsideAppOrTab = (
  state: TLocalState,
  e: FocusEvent
) => {
  const { containerEl, setOpen } = state;

  if (containerEl!.contains(e.target as HTMLElement)) return;

  globalState.closedByEvents = true;
  setOpen(false);
  state.prevFocusedEl = null;
  state.addedFocusOutAppEvents = false;
};

export const removeOutsideFocusEvents = (state: TLocalState) => {
  const { onFocusFromOutsideAppOrTabRef } = state;
  if (!state.prevFocusedEl) return;

  state.prevFocusedEl.removeEventListener(
    "focus",
    onFocusFromOutsideAppOrTabRef
  );
  state.prevFocusedEl = null;
  state.addedFocusOutAppEvents = false;
};
