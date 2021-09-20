import { TLocalState } from "./localState";
import { removeOutsideFocusEvents } from "./outside";
import { getNextTabbableElement } from "./utils";

export const onClickMenuButton = (state: TLocalState, e: Event) => {
  const {
    menuButtonBlurTimeoutId,
    menuBtnEl,
    closeWhenMenuButtonIsClicked,
    setOpen,
    open,
  } = state;

  console.log("onclick btn");
  clearTimeout(state.containerFocusTimeoutId!);
  clearTimeout(menuButtonBlurTimeoutId!);
  menuBtnEl!.focus();
  state.containerFocusTimeoutId = null;

  // iOS triggers refocus i think...
  if (!open()) {
    state.menuBtnEl!.addEventListener("focus", state.onFocusMenuButtonRef, {
      once: true,
    });
    menuBtnEl!.addEventListener("keydown", state.onKeydownMenuButtonRef);
    menuBtnEl!.addEventListener("blur", state.onBlurMenuButtonRef, {
      once: true,
    });
  } else {
    if (closeWhenMenuButtonIsClicked) {
      state.menuBtnEl!.removeEventListener("focus", state.onFocusMenuButtonRef);
      state.menuBtnEl!.removeEventListener(
        "keydown",
        state.onKeydownMenuButtonRef
      );
      state.menuBtnEl!.removeEventListener("blur", state.onBlurMenuButtonRef);
    }
  }

  if (!closeWhenMenuButtonIsClicked) {
    setOpen(true);
    return;
  }

  setOpen(!open());
};

export const onBlurMenuButton = (state: TLocalState, e: FocusEvent) => {
  const { onClickDocumentRef, containerEl, overlay, setOpen, open } = state;

  if (state.menuBtnKeyupTabFired) {
    state.menuBtnKeyupTabFired = false;
    return;
  }

  if (!e.relatedTarget) {
    if (!overlay) {
      document.addEventListener("click", onClickDocumentRef, { once: true });
    }
    return;
  }

  removeOutsideFocusEvents(state);

  if (!containerEl) return;
  if (containerEl.contains(e.relatedTarget as HTMLElement)) return;

  const run = () => {
    // Solves Safari issue
    if ((e.relatedTarget as HTMLElement).contains(state.menuBtnEl!)) {
      return;
    }
    console.log("blurr", state.containerEl, state.menuBtnEl, e.relatedTarget);
    console.log(
      "containerEl, menuBtnEl",
      state.containerEl?.isConnected,
      state.menuBtnEl?.isConnected
    );
    setOpen(false);
  };

  state.menuButtonBlurTimeoutId = window.setTimeout(run);
};

export const onKeydownMenuButton = (state: TLocalState, e: KeyboardEvent) => {
  const {
    focusSentinelFirstEl,
    containerEl,
    menuBtnEl,
    setOpen,
    open,
    onKeydownMenuButtonRef,
    onBlurMenuButtonRef,
  } = state;

  if (!open()) return;
  if (e.key === "Tab" && e.shiftKey) {
    setOpen(false);
    state.menuBtnKeyupTabFired = true;
    menuBtnEl!.removeEventListener("keydown", onKeydownMenuButtonRef);
    menuBtnEl!.removeEventListener("blur", onBlurMenuButtonRef);
    return;
  }
  if (e.key !== "Tab") return;
  state.menuBtnKeyupTabFired = true;
  e.preventDefault();
  const el = getNextTabbableElement({ from: focusSentinelFirstEl! });
  if (el) {
    el.focus();
  } else {
    containerEl!.focus();
  }
  menuBtnEl!.removeEventListener("keydown", onKeydownMenuButtonRef);
  menuBtnEl!.removeEventListener("blur", onBlurMenuButtonRef);
};

export const onFocusMenuButton = (state: TLocalState) => {
  const { closeWhenMenuButtonIsTabbed, containerFocusTimeoutId } = state;

  if (!closeWhenMenuButtonIsTabbed) {
    console.log("clear!!");
    clearTimeout(containerFocusTimeoutId!);
  }
};

export const runAriaExpanded = (state: TLocalState, open: boolean) => {
  const { useAriaExpanded, menuBtnEl } = state;

  if (!useAriaExpanded) return;
  menuBtnEl!.setAttribute("aria-expanded", `${open}`);
};
