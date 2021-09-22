import { dismissStack } from "./dismissStack";
import { globalState } from "./globalEvents";
import { TLocalState } from "./localState";
import {
  checkThenClose,
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
    uniqueId,
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

  // clearTimeout(containerFocusTimeoutId!);
  // if (mount) {
  dismissStack.forEach((item) =>
    window.clearTimeout(item.timeouts.containerFocusTimeoutId!)
  );
  // }

  const runIfMounted = (el: HTMLElement, isFirst?: boolean) => {
    // globalState.closeByFocusSentinel = true;
    checkThenClose(
      dismissStack,
      (item) => {
        if (isFirst) {
          if (item.menuBtnEl === el && !item.closeWhenMenuButtonIsTabbed) {
            menuBtnEl!.addEventListener("focus", state.onFocusMenuButtonRef, {
              once: true,
            });
            menuBtnEl!.addEventListener(
              "keydown",
              state.onKeydownMenuButtonRef
            );
            menuBtnEl!.addEventListener("blur", state.onBlurMenuButtonRef, {
              once: true,
            });
            return;
          }
        }
        if (item.uniqueId === uniqueId || !item.containerEl.contains(el)) {
          return item;
        }

        return;
      },
      (item) => {
        item.setOpen(false);
      }
    );

    if (el) {
      el.focus();
    }
  };

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

    // if (mount) {
    runIfMounted(el, true);
    return;
    // }

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
    runIfMounted(el);
    return;
  }

  if (el) {
    el.focus();
  }

  console.log(dismissStack);
  setOpen(false);
};
