import { dismissStack } from "../global/dismissStack";
import { globalState, onDocumentClick } from "../global/globalEvents";
import { TLocalState } from "./localState";
import { removeOutsideFocusEvents } from "./outside";
import { checkThenClose, hasDisplayNone } from "../utils";
import { getNextTabbableElement } from "../utils/tabbing";

let mousedownFired = false;

export const onClickMenuButton = (state: TLocalState, e: Event) => {
  const {
    timeouts,
    closeWhenMenuButtonIsClicked,
    focusedMenuBtn,
    setOpen,
    open,
  } = state;

  const menuBtnEl = e.currentTarget as HTMLElement;

  globalState.focusedMenuBtns.forEach((item) => (item.el = null));
  // globalState.menuBtnEls.clear();

  state.menuBtnKeyupTabFired = false;
  if (mousedownFired && !open()) {
    mousedownFired = false;
    return;
  }

  mousedownFired = false;
  globalState.addedDocumentClick = false;
  document.removeEventListener("click", onDocumentClick);

  menuBtnEl!.focus();
  focusedMenuBtn.el = menuBtnEl;
  globalState.focusedMenuBtns.add(focusedMenuBtn);
  clearTimeout(timeouts.containerFocusTimeoutId!);
  clearTimeout(timeouts.menuButtonBlurTimeoutId!);
  timeouts.containerFocusTimeoutId = null;

  // iOS triggers refocus i think...
  if (!open()) {
    menuBtnEl!.addEventListener("focus", state.onFocusMenuButtonRef, {
      once: true,
    });
    menuBtnEl!.addEventListener("keydown", state.onKeydownMenuButtonRef);
    menuBtnEl!.addEventListener("blur", state.onBlurMenuButtonRef);
  } else {
    // if (closeWhenMenuButtonIsClicked) {
    //   state.menuBtnEl!.removeEventListener("focus", state.onFocusMenuButtonRef);
    //   state.menuBtnEl!.removeEventListener(
    //     "keydown",
    //     state.onKeydownMenuButtonRef
    //   );
    //   state.menuBtnEl!.removeEventListener("blur", state.onBlurMenuButtonRef);
    // }
  }

  if (!closeWhenMenuButtonIsClicked) {
    setOpen(true);
    return;
  }

  if (open()) {
    // focusedMenuBtn.el = null;
    globalState.closedByEvents = true;
  }
  setOpen(!open());
};

export const onBlurMenuButton = (state: TLocalState, e: FocusEvent) => {
  const {
    containerEl,
    focusedMenuBtn,
    overlay,
    setOpen,
    timeouts,
    closeWhenMenuButtonIsClicked,
  } = state;

  if (state.menuBtnKeyupTabFired) {
    state.menuBtnKeyupTabFired = false;
    return;
  }

  if (mousedownFired && !closeWhenMenuButtonIsClicked) {
    return;
  }

  if (!e.relatedTarget) {
    if (!overlay) {
      if (!globalState.addedDocumentClick) {
        globalState.addedDocumentClick = true;
        document.addEventListener("click", onDocumentClick, { once: true });
      }
    }
    return;
  }

  removeOutsideFocusEvents(state);

  if (!containerEl) return;
  if (containerEl.contains(e.relatedTarget as HTMLElement)) return;

  const run = () => {
    globalState.closedByEvents = true;
    focusedMenuBtn.el = null;
    setOpen(false);
  };

  timeouts.menuButtonBlurTimeoutId = window.setTimeout(run);
};

// When reclicking menuButton for closing intention, Safari will trigger blur upon mousedown, which the click event fires after. This results menuPopup close then reopen. This mousedown event prevents that bug.
export const onMouseDownMenuButton = (state: TLocalState, e: MouseEvent) => {
  const menuBtnEl = e.currentTarget as HTMLElement;

  if (!state.open()) {
    checkThenClose(
      dismissStack,
      (item) => {
        if (item.containerEl!.contains(menuBtnEl)) return;
        return item;
      },
      (item) => {
        globalState.focusedMenuBtns.forEach((item) => (item.el = null));
        globalState.closedByEvents = true;
        item.setOpen(false);
      }
    );

    mousedownFired = false;
    return;
  }
  mousedownFired = true;
};

export const onKeydownMenuButton = (state: TLocalState, e: KeyboardEvent) => {
  const {
    containerEl,
    focusedMenuBtn,
    setOpen,
    open,
    onKeydownMenuButtonRef,
    onBlurMenuButtonRef,
    mount,
    focusSentinelBeforeEl,
  } = state;

  const menuBtnEl = e.currentTarget as HTMLElement;

  if (e.key !== "Tab") return;

  globalState.focusedMenuBtns.forEach((item) => (item.el = null));

  if (!open()) return;

  state.menuBtnKeyupTabFired = true;

  if (e.key === "Tab" && e.shiftKey) {
    globalState.closedByEvents = true;
    // menuPopup is previous general sibling of menuButton
    if (!mount || menuBtnEl!.nextElementSibling !== containerEl) {
      e.preventDefault();

      let el = getNextTabbableElement({
        from: menuBtnEl!,
        direction: "backwards",
        ignoreElement: [containerEl!],
      });

      if (el) {
        el.focus();
      }
    }

    setOpen(false);
    menuBtnEl!.removeEventListener("keydown", onKeydownMenuButtonRef);
    menuBtnEl!.removeEventListener("blur", onBlurMenuButtonRef);
    return;
  }

  e.preventDefault();

  let el = getNextTabbableElement({
    from: focusSentinelBeforeEl!,
    stopAtElement: containerEl,
  });

  if (el) {
    el.focus();
  } else {
    containerEl!.focus();
  }

  if (!el) {
    setOpen(false);

    el = getNextTabbableElement({
      from: focusSentinelBeforeEl!,
    });

    if (el) {
      el.focus();
    }
  }

  menuBtnEl!.removeEventListener("keydown", onKeydownMenuButtonRef);
  menuBtnEl!.removeEventListener("blur", onBlurMenuButtonRef);
};

export const onFocusMenuButton = (state: TLocalState) => {
  const { closeWhenMenuButtonIsTabbed, timeouts } = state;

  if (!closeWhenMenuButtonIsTabbed) {
    clearTimeout(timeouts.containerFocusTimeoutId!);
  }
};

export const getMenuButton = (menuBtnEls: HTMLElement[]): HTMLElement => {
  if (menuBtnEls.length <= 1) return menuBtnEls[0];

  return menuBtnEls.find((menuBtnEl) => {
    if (!menuBtnEl || hasDisplayNone(menuBtnEl)) return;

    return menuBtnEl;
  })!;
};

export const markFocusedMenuButton = ({
  focusedMenuBtn,
  timeouts,
  el,
}: {
  el: HTMLElement;
} & Pick<TLocalState, "focusedMenuBtn" | "timeouts">) => {
  focusedMenuBtn.el = el;

  el.addEventListener(
    "blur",
    (e) => {
      const el = e.currentTarget as HTMLElement;

      globalState.focusedMenuBtns.add(focusedMenuBtn);

      setTimeout(() => {
        if (!el.isConnected) return;

        focusedMenuBtn.el = null;
      });
    },
    {
      once: true,
    }
  );
};

export const removeMenuButtonEvents = (
  state: TLocalState,
  onCleanup?: boolean
) => {
  if (!state || !state.menuBtnEls) return;

  state.menuBtnEls.forEach((menuBtnEl) => {
    menuBtnEl.removeEventListener("focus", state.onFocusMenuButtonRef);
    // menuBtnEl.removeEventListener("keydown", state.onKeydownMenuButtonRef);
    menuBtnEl.removeEventListener("blur", state.onBlurMenuButtonRef);

    if (onCleanup) {
      menuBtnEl.removeEventListener("click", state.onClickMenuButtonRef);
      menuBtnEl.removeEventListener(
        "mousedown",
        state.onMouseDownMenuButtonRef
      );
    }
  });
};
