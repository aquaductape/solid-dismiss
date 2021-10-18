import { dismissStack } from "../global/dismissStack";
import { globalState } from "../global/globalEvents";
import { checkThenClose, matchByFirstChild, queryElement } from "../utils";
import { getNextTabbableElement } from "../utils/tabbing";
import { TLocalState } from "./localState";
import { getMenuButton } from "./menuButton";

export const activateLastFocusSentinel = (state: TLocalState) => {
  const {
    enableLastFocusSentinel,
    menuBtnEls,
    containerEl,
    focusSentinelAfterEl,
  } = state;

  if (enableLastFocusSentinel) return;

  const menuBtnEl = getMenuButton(menuBtnEls!);

  const menuBtnSibling = menuBtnEl!.nextElementSibling!;

  if (
    matchByFirstChild({
      parent: menuBtnSibling,
      matchEl: containerEl!,
    })
  )
    return;

  focusSentinelAfterEl!.setAttribute("tabindex", "0");
};

export const onFocusSentinel = (
  state: TLocalState,
  type: "before" | "after" | "last",
  relatedTarget?: HTMLElement
) => {
  const {
    uniqueId,
    containerEl,
    menuBtnEls,
    focusSentinelBeforeEl,
    trapFocus,
    focusSentinelAfterEl,
    closeWhenMenuButtonIsTabbed,
    focusElementOnClose,
    mount,
    open,
    setOpen,
  } = state;
  const menuBtnEl = getMenuButton(menuBtnEls!);

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
          if (
            getMenuButton(item.menuBtnEls) === el &&
            !item.closeWhenMenuButtonIsTabbed
          ) {
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
        globalState.closedByEvents = true;
        item.setOpen(false);
      }
    );

    if (el) {
      el.focus();
    }
  };

  if (!open()) return;

  if (relatedTarget === containerEl || relatedTarget === menuBtnEl) {
    const el = getNextTabbableElement({
      from: focusSentinelBeforeEl!,
      stopAtElement: containerEl,
    })!;

    el.focus();
    return;
  }

  if (type === "before") {
    if (trapFocus) {
      const el = getNextTabbableElement({
        from: focusSentinelAfterEl!,
        direction: "backwards",
        stopAtElement: containerEl,
      })!;

      el.focus();
      return;
    }

    if (closeWhenMenuButtonIsTabbed) {
      globalState.closedByEvents = true;
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

    runIfMounted(el, true);
    return;
  }

  if (trapFocus) {
    const el = getNextTabbableElement({
      from: focusSentinelBeforeEl!,
      stopAtElement: containerEl,
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

  globalState.closedByEvents = true;
  setOpen(false);
};
