import { dismissStack } from "../global/dismissStack";
import { TLocalState } from "../local/localState";

export const runToggleScrollbar = (state: TLocalState, open: boolean) => {
  const { onToggleScrollbar, removeScrollbar } = state;
  if (onToggleScrollbar) {
    if (open) {
      if (dismissStack.length > 1) return;
      onToggleScrollbar.onRemove();
    } else {
      if (dismissStack.length) return;
      onToggleScrollbar.onRestore();
    }
    return;
  }

  if (!removeScrollbar) return;

  if (dismissStack.length > 1) return;

  const el = document.scrollingElement as HTMLElement;

  if (open) {
    el.style.overflow = "hidden";
  } else {
    el.style.overflow = "";
  }
};
