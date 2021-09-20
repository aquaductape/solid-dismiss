import { dismissStack } from "./dismissStack";
import { TLocalState } from "./localState";
import { queryElement } from "./utils";

export const onClickOverlay = (state: TLocalState) => {
  const {
    uniqueId,
    closeWhenOverlayClicked,
    menuPopupEl,
    focusElementOnClose,
    menuBtnEl,
    setOpen,
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
  dismissStack.find((item) => item.uniqueId === uniqueId)!.queueRemoval = true;

  setOpen(false);
};
