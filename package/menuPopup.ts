import { TLocalState } from "./localState";
import { queryElement } from "./utils";

export const addMenuPopupEl = (state: TLocalState) => {
  const { menuPopup, useAriaExpanded, menuBtnId } = state;
  if (state.menuPopupAdded) return;

  state.menuPopupEl = queryElement(state, {
    inputElement: menuPopup,
    type: "menuPopup",
  });

  if (state.menuPopupEl) {
    state.menuPopupAdded = true;

    state.menuPopupEl.setAttribute("tabindex", "-1");

    if (!useAriaExpanded) return;

    if (!state.menuPopupEl.getAttribute("aria-labelledby")) {
      state.menuPopupEl.setAttribute("aria-labelledby", menuBtnId);
    }
  }
};

export const removeMenuPopupEl = (state: TLocalState) => {
  if (!state.menuPopupEl) return;
  if (!state.menuPopupAdded) return;
  state.menuPopupEl = null;
  state.menuPopupAdded = false;
};
