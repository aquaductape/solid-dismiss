import { dismissStack } from "./dismissStack";
import { globalState } from "./globalEvents";
import { TLocalState } from "./localState";
import {
  getNextTabbableElement,
  matchByFirstChild,
  queryElement,
} from "./utils";

export const activateLastFocusSentinel = (state: TLocalState) => {
  const { mountedElseWhere, menuBtnEl, containerEl, focusSentinelLastEl } =
    state;

  if (mountedElseWhere) return;

  const menuBtnSibling = menuBtnEl!.nextElementSibling!;

  if (
    matchByFirstChild({
      parent: menuBtnSibling,
      matchEl: containerEl!,
    })
  )
    return;

  focusSentinelLastEl!.setAttribute("tabindex", "0");
};

export const onFocusSentinel = (
  state: TLocalState,
  type: "first" | "last",
  relatedTarget?: HTMLElement
) => {
  const {
    containerFocusTimeoutId,
    containerEl,
    menuBtnEl,
    focusSentinelFirstEl,
    trapFocus,
    focusSentinelLastEl,
    closeWhenMenuButtonIsTabbed,
    focusElementOnClose,
    mount,
    setOpen,
  } = state;

  clearTimeout(containerFocusTimeoutId!);

  if (relatedTarget === containerEl || relatedTarget === menuBtnEl) {
    const el = getNextTabbableElement({
      from: focusSentinelFirstEl!,
    })!;

    el.focus();
    return;
  }

  if (type === "first") {
    if (trapFocus) {
      const el = getNextTabbableElement({
        from: focusSentinelLastEl!,
        direction: "backwards",
      })!;

      el.focus();
      return;
    }

    if (closeWhenMenuButtonIsTabbed) {
      setOpen(false);
      menuBtnEl!.focus();
      return;
    }

    const el =
      queryElement(state, {
        inputElement: focusElementOnClose,
        type: "focusElementOnClose",
        subType: "tabBackwards",
      }) || menuBtnEl;

    if (el) {
      el.focus();
    }

    if (el !== menuBtnEl) {
      setOpen(false);
    }

    return;
  }

  if (trapFocus) {
    const el = getNextTabbableElement({
      from: focusSentinelFirstEl!,
    })!;

    el.focus();
    return;
  }

  const el =
    queryElement(state, {
      inputElement: focusElementOnClose,
      type: "focusElementOnClose",
      subType: "tabForwards",
    }) ||
    getNextTabbableElement({
      from: menuBtnEl!,
      ignoreElement: [containerEl!],
    });

  if (mount) {
    globalState.closeByFocusSentinel = true;
  }

  console.log("sentinel", { el });
  if (el) {
    el.focus();
  }

  console.log(dismissStack);
  setOpen(false);
};
