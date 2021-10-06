import { dismissStack } from "./dismissStack";
import { globalState, onDocumentClick } from "./globalEvents";
import { TLocalState } from "./localState";
import { removeOutsideFocusEvents } from "./outside";
import { checkThenClose, getNextTabbableElement } from "./utils";

let mousedownFired = false;

export const onClickMenuButton = (state: TLocalState, e: Event) => {
  const { timeouts, menuBtnEl, closeWhenMenuButtonIsClicked, setOpen, open } =
    state;

  state.menuBtnKeyupTabFired = false;
  if (mousedownFired && !open()) {
    mousedownFired = false;
    return;
  }

  mousedownFired = false;
  globalState.addedDocumentClick = false;
  document.removeEventListener("click", onDocumentClick);

  menuBtnEl!.focus();
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
    globalState.closedByEvents = true;
  }
  setOpen(!open());
};

export const onBlurMenuButton = (state: TLocalState, e: FocusEvent) => {
  const {
    containerEl,
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
    setOpen(false);
  };

  timeouts.menuButtonBlurTimeoutId = window.setTimeout(run);
};

// When reclicking menuButton for closing intention, Safari will trigger blur upon mousedown, which the click event fires after. This results menuPopup close then reopen. This mousedown event prevents that bug.
export const onMouseDownMenuButton = (state: TLocalState) => {
  if (!state.open()) {
    checkThenClose(
      dismissStack,
      (item) => {
        if (item.containerEl!.contains(state.menuBtnEl!)) return;
        return item;
      },
      (item) => {
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
    menuBtnEl,
    setOpen,
    open,
    onKeydownMenuButtonRef,
    onBlurMenuButtonRef,
    mount,
    focusSentinelBeforeEl,
  } = state;

  if (!open()) return;
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
    state.menuBtnKeyupTabFired = true;
    menuBtnEl!.removeEventListener("keydown", onKeydownMenuButtonRef);
    menuBtnEl!.removeEventListener("blur", onBlurMenuButtonRef);
    return;
  }

  if (e.key !== "Tab") return;
  state.menuBtnKeyupTabFired = true;
  e.preventDefault();
  const el = getNextTabbableElement({ from: focusSentinelBeforeEl! });
  if (el) {
    el.focus();
  } else {
    containerEl!.focus();
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
