import { TLocalState } from "./localState";
import { queryElement } from "../utils";

export const addMenuPopupEl = (state: TLocalState) => {
  const { menuPopup } = state;
  if (state.menuPopupAdded) return;

  state.menuPopupEl = queryElement(state, {
    inputElement: menuPopup,
    type: "menuPopup",
  });

  if (state.menuPopupEl) {
    state.menuPopupAdded = true;

    state.menuPopupEl.setAttribute("tabindex", "-1");
  }
};

export const removeMenuPopupEl = (state: TLocalState) => {
  if (!state.menuPopupEl) return;
  if (!state.menuPopupAdded) return;
  state.menuPopupEl = null;
  state.menuPopupAdded = false;
};
