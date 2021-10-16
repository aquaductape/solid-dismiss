import { dismissStack } from "./dismissStack";
import { globalState } from "./globalEvents";
import { TLocalState } from "./localState";
import { getMenuButton } from "./menuButton";
import { checkThenClose, queryElement } from "./utils";

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
