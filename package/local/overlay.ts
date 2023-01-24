import { dismissStack } from "../global/dismissStack";
import { globalState } from "../global/globalEvents";
import { checkThenClose } from "../utils/checkThenClose";
import { queryElement } from "../utils/queryElement";
import { TLocalState } from "./localState";
import { getMenuButton } from "./menuButton";

export const onMouseDownOverlay = () => {
  globalState.overlayMouseDown = true;
};
export const onMouseUpOverlay = () => {
  globalState.overlayMouseDown = false;
};

export const onClickOverlay = (state: TLocalState) => {
  const {
    closeWhenOverlayClicked,
    menuPopupEl,
    focusElementOnClose,
    menuBtnEls,
  } = state;
  globalState.overlayMouseDown = false;

  if (!closeWhenOverlayClicked) {
    menuPopupEl!.focus({ preventScroll: true });

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
      if (item.overlayElement) return { continue: false };
      return { item, continue: true };
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
