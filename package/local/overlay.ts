import { dismissStack } from "../global/dismissStack";
import { globalState } from "../global/globalEvents";
import { TLocalState } from "./localState";
import { checkThenClose, queryElement } from "../utils";
import { getMenuButton } from "./menuButton";

export const onClickOverlay = (state: TLocalState) => {
  const {
    closeWhenOverlayClicked,
    menuPopupEl,
    focusElementOnClose,
    menuBtnEls,
  } = state;

  if (!closeWhenOverlayClicked) {
    menuPopupEl!.focus();
    return;
  }

  const menuBtnEl = getMenuButton(menuBtnEls!);

  const el =
    queryElement(state, {
      inputElement: focusElementOnClose,
      type: "focusElementOnClose",
      subType: "click",
    }) || menuBtnEl;

  if (el) {
    el.focus();
  }

  checkThenClose(
    dismissStack,
    (item) => {
      if (item.overlayElement) return;
      return item;
    },
    (item) => {
      const { setOpen } = item;
      globalState.closedByEvents = true;
      setOpen(false);
    }
  );

  globalState.closedByEvents = true;
  state.setOpen(false);
};
