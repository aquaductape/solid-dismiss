import { dismissStack } from "./dismissStack";
import { TLocalState } from "./localState";
import { queryElement } from "./utils";

export const onClickOverlay = (state: TLocalState) => {
  const {
    uniqueId,
    closeWhenClickedOutside,
    menuPopupEl,
    focusElementOnClose,
    menuBtnEl,
    setOpen,
    setFocus,
  } = state;
  console.log({ closeWhenClickedOutside });

  if (!closeWhenClickedOutside) {
    menuPopupEl!.focus();
    return;
  }

  const el =
    queryElement(state, {
      inputElement: focusElementOnClose,
      type: "focusElementOnClose",
      subType: "click",
    }) || menuBtnEl;

  if (el !== menuBtnEl && setFocus) {
    setFocus(false);
  }

  if (el) {
    el.focus();
  }
  dismissStack.find((item) => item.uniqueId === uniqueId)!.queueRemoval = true;

  setOpen(false);
};
