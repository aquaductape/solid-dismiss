import { TLocalState } from "./localState";
import { JSX } from "solid-js";
import { queryElement } from "./utils";

export const onClickCloseButtons = (state: TLocalState) => {
  state.setOpen(false);
};

export const addCloseButtons = (state: TLocalState) => {
  const { closeButtons, closeBtnsAdded, closeBtns, onClickCloseButtonsRef } =
    state;

  if (!closeButtons) return;
  if (closeBtnsAdded) return;

  const getCloseButton = (closeButton: string | JSX.Element) => {
    if (closeButton == null) return;

    const el = queryElement(state, {
      inputElement: closeButton,
      type: "closeButton",
    });
    console.log({ el });

    if (!el) return;
    state.closeBtnsAdded = true;

    el.addEventListener("click", onClickCloseButtonsRef);
    closeBtns?.push(el);
  };

  if (Array.isArray(closeButtons)) {
    closeButtons.forEach((item) => {
      getCloseButton(item);
    });
    return;
  }

  if (typeof closeButtons === "function") {
    const result = closeButtons();

    if (Array.isArray(result)) {
      result.forEach((item) => {
        getCloseButton(item);
      });
      return;
    }

    getCloseButton(result);
    return;
  }

  getCloseButton(closeButtons);
};

export const removeCloseButtons = (state: TLocalState) => {
  const { closeBtnsAdded, closeButtons, onClickCloseButtonsRef } = state;

  if (!closeButtons) return;
  if (!closeBtnsAdded) return;

  state.closeBtnsAdded = false;
  state.closeBtns.forEach((el) => {
    el.removeEventListener("click", onClickCloseButtonsRef);
  });
  state.closeBtns = [];
};
