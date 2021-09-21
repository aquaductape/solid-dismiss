import { dismissStack } from "./dismissStack";
import { TLocalState } from "./localState";
import { checkThenClose, queryElement } from "./utils";

export const onClickOverlay = (state: TLocalState) => {
  const {
    closeWhenOverlayClicked,
    menuPopupEl,
    focusElementOnClose,
    menuBtnEl,
  } = state;

  if (!closeWhenOverlayClicked) {
    menuPopupEl!.focus();
    return;
  }

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
      if (item.overlay) return;
      return item;
    },
    (item) => {
      const { setOpen } = item;
      setOpen(false);
    }
  );

  state.setOpen(false);
};
