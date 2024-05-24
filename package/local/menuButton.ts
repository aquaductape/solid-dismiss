import { dismissStack } from "../global/dismissStack";
import {
  globalState,
  onKeyDownFocusIn,
  runLastAfterEvents,
} from "../global/globalEvents";
import { TLocalState } from "./localState";
import { getNextTabbableElement } from "../utils/tabbing";
import { hasDisplayNone } from "../utils/hasDisplayNone";
import { queryElement } from "../utils/queryElement";
import { TDismiss } from "..";
import isHiddenOrInvisbleShallow from "../utils/isHiddenOrInvisibleShallow";
import { checkThenClose } from "../utils/checkThenClose";

export const onClickMenuButton = (state: TLocalState, e: Event) => {
  const {
    timeouts,
    closeWhenMenuButtonIsClicked,
    focusedMenuBtn,
    onClickOutsideMenuButtonRef: onClickOutsideRef,
    setOpen,
    open,
    deadMenuButton,
    closeWhenClickingOutside,
  } = state;

  state.menuBtnMouseDownFired = false;

  const menuBtnEl = e.currentTarget as HTMLElement;

  globalState.focusedMenuBtns.forEach((item) => (item.el = null));

  if (deadMenuButton) {
    // globalState.addedDocumentClick = true;
    // setTimeout(() => {
    //   document.addEventListener("pointerdown", onDocumentClick, { once: true });
    // });
    return;
  }

  state.menuBtnKeyupTabFired = false;

  focusedMenuBtn.el = menuBtnEl;
  globalState.focusedMenuBtns.add(focusedMenuBtn);
  // TODO:?
  // timeouts.containerFocusTimeoutId = null;

  if (!closeWhenClickingOutside) {
    const stackItem = dismissStack[dismissStack.length - 1];
    if (
      stackItem &&
      !stackItem.menuBtnEls.includes(menuBtnEl) &&
      !stackItem.containerEl.contains(menuBtnEl)
    ) {
      checkThenClose(
        dismissStack,
        (item) => {
          return { item, continue: true };
        },
        (item) => {
          const { setOpen } = item;
          setOpen(false);
        }
      );
    }
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
    menuBtnMouseDownFired,
    closeWhenDocumentBlurs,
    closeWhenClickingOutside,

    open,
  } = state;
  const currentMenuBtn = e.currentTarget as HTMLButtonElement;

  queueMicrotask(() => {
    runLastAfterEvents();
  });

  if (state.menuBtnKeyupTabFired) {
    state.menuBtnKeyupTabFired = false;
    return;
  }

  if (menuBtnMouseDownFired) return;
  if (containerEl && containerEl.contains(e.relatedTarget as HTMLElement))
    return;

  if (!closeWhenClickingOutside && open()) {
    document.addEventListener("keydown", onKeyDownFocusIn);
    return;
  }

  const clickedTarget = globalState.clickTarget;

  const run = () => {
    const activeElement = document.activeElement;

    if (
      (!e.relatedTarget && activeElement && activeElement.tagName === "IFRAME",
      containerEl && containerEl.contains(activeElement))
    )
      return;
    if (!closeWhenDocumentBlurs && !document.hasFocus()) return;
    if (globalState.closedBySetOpen) return;
    if (!currentMenuBtn.isConnected) return;
    if (isHiddenOrInvisbleShallow(currentMenuBtn)) {
      let clickIsOutside = false;
      state.menuBtnEls?.some((el) => {
        if (el === currentMenuBtn) return false;
        if (isHiddenOrInvisbleShallow(el)) return false;
        if (clickedTarget && !el.contains(clickedTarget)) {
          clickIsOutside = true;
          return false;
        }

        el.focus();
        return true;
      });
      if (!clickIsOutside) {
        return;
      }
    }

    if (!state.open()) return;

    globalState.closedByEvents = true;
    // TODO:?
    focusedMenuBtn.el = null;

    setOpen(false);
  };

  timeouts.menuButtonBlurTimeoutId = window.setTimeout(run);
};

export const onMouseDownMenuButton = (state: TLocalState, e: MouseEvent) => {
  const { focusMenuButtonOnMouseDown } = state;
  const menuBtnEl = e.currentTarget as HTMLElement;

  state.menuBtnMouseDownFired = true;
  menuBtnEl.addEventListener("click", state.onClickMenuButtonRef);

  // if `false`, enables switching focus from menuButton to menuPopup input element while keeping virtual keyboard opened in iOS. However end-user must also provide additional logic to fire inside menuButton onclick for behavior to work.
  if (focusMenuButtonOnMouseDown) {
    menuBtnEl.addEventListener("blur", state.onBlurMenuButtonRef);
    requestAnimationFrame(() => {
      menuBtnEl.focus();
    });
  }
};

// TODO: ?
export const onClickOutsideMenuButton = (state: TLocalState) => {
  state.focusedMenuBtn.el = null;
};

export const onKeydownMenuButton = (state: TLocalState, e: KeyboardEvent) => {
  const {
    containerEl,
    setOpen,
    open,
    onKeydownMenuButtonRef,
    onBlurMenuButtonRef,
    mount,
    focusSentinelBeforeEl,
    focusSentinelAfterEl,
    ignoreMenuPopupWhenTabbing,
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
        ignoreElement: [
          containerEl!,
          focusSentinelBeforeEl!,
          focusSentinelAfterEl!,
        ],
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

  if (ignoreMenuPopupWhenTabbing) {
    const el = getNextTabbableElement({
      from: menuBtnEl!,
      direction: "forwards",
      ignoreElement: [
        containerEl!,
        focusSentinelBeforeEl!,
        focusSentinelAfterEl!,
      ],
    });
    if (el) {
      el.focus();
    }
    setOpen(false);
    menuBtnEl!.removeEventListener("keydown", onKeydownMenuButtonRef);
    menuBtnEl!.removeEventListener("blur", onBlurMenuButtonRef);
    return;
  }

  let el = getNextTabbableElement({
    from: focusSentinelBeforeEl!,
    stopAtRootElement: containerEl,
  });

  if (el) {
    el.focus();
  } else {
    // TODO: why is this needed when next conditional queries element and focuses it
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

export const onFocusMenuButton = (state: TLocalState, e: Event) => {
  const {
    closeWhenMenuButtonIsTabbed,
    timeouts,
    deadMenuButton,
    menuBtnEls,
    focusedMenuBtn,
  } = state;

  const menuBtn = getMenuButton(menuBtnEls!);
  menuBtn.addEventListener("click", state.onClickMenuButtonRef);
  menuBtn.addEventListener("blur", state.onBlurMenuButtonRef);
  menuBtn.addEventListener("keydown", state.onKeydownMenuButtonRef);
  focusedMenuBtn.el = e.currentTarget as HTMLButtonElement;

  // solution to Safari/Mac/iOS

  window.setTimeout(() => {
    // check if menuButton arg is an array of at least two items(buttons)
    // check if currentTarget focused
    // if yes, check if it's hidden
    // if yes, mark a variable
    // then on blur event, if that variable is true
    // if yes, check if currentTarget is hidden
    // then allow blur to continue and close stacks, rather than focus on other button bug
    // if()
  });

  // TODO:
  if (deadMenuButton) {
    menuBtn.addEventListener("blur", state.onBlurMenuButtonRef);
    menuBtn.addEventListener("keydown", state.onKeydownMenuButtonRef);

    // globalState.addedDocumentClick = true;
    // setTimeout(() => {
    //   document.addEventListener("pointerdown", onDocumentClick, { once: true });
    // });
    return;
  }

  if (!closeWhenMenuButtonIsTabbed) {
    clearTimeout(timeouts.containerFocusTimeoutId!);
  }
};

export const getMenuButton = (menuBtnEls: HTMLElement[]): HTMLElement => {
  if (!menuBtnEls) return undefined as any;

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

export const addMenuButtonEventsAndAttributes = ({
  state,
  menuButton,
  open,
}: {
  state: TLocalState;
  menuButton: TDismiss["menuButton"];
  open: () => boolean;
}) => {
  if (Array.isArray(menuButton) && !menuButton.length) return;

  const { focusedMenuBtn, containerEl } = state;
  const menuBtnEls = queryElement(state, {
    inputElement: menuButton,
    type: "menuButton",
  }) as unknown as HTMLElement[];

  if (!menuBtnEls) {
    return;
  }

  state.menuBtnEls = Array.isArray(menuBtnEls) ? menuBtnEls : [menuBtnEls];

  const item = dismissStack.find((item) => item.uniqueId === state.uniqueId);
  if (item) {
    item.menuBtnEls = state.menuBtnEls;
  }

  // if (state.deadMenuButton) {
  //   // deadMenuButton doesn't do anything, why is this here
  //   state.menuBtnEls.forEach((menuBtnEl) => {
  //     menuBtnEl.addEventListener("click", state.onClickMenuButtonRef);
  //     menuBtnEl.addEventListener("mousedown", state.onMouseDownMenuButtonRef);
  //     menuBtnEl.addEventListener("focus", state.onFocusMenuButtonRef);
  //     // menuBtnEl.addEventListener("blur", state.onBlurMenuButtonRef);
  //   });
  //   return;
  // }

  state.menuBtnEls.forEach((menuBtnEl, _, self) => {
    addAriaLabels(state, menuBtnEl);
    // menuBtnEl.removeAttribute("type");
    // menuBtnEl.setAttribute("role", 'div');
    // menuBtnEl.setAttribute("tabindex", 'div');
    menuBtnEl.addEventListener("mousedown", state.onMouseDownMenuButtonRef);
    menuBtnEl.addEventListener("focus", state.onFocusMenuButtonRef);
    if (
      focusedMenuBtn.el &&
      focusedMenuBtn.el !== menuBtnEl &&
      (self.length > 1 ? !hasDisplayNone(menuBtnEl) : true)
    ) {
      focusedMenuBtn.el = menuBtnEl;

      // TODO: will fail on other stacks
      if (containerEl && containerEl.contains(document.activeElement)) return;

      menuBtnEl.focus({ preventScroll: true });
      // TODO:?
      // menuBtnEl!.addEventListener("keydown", state.onKeydownMenuButtonRef);
    }
  });
};

const addAriaLabels = (state: TLocalState, targetEl: HTMLElement) => {
  const { modal, uniqueId, deadMenuButton } = state;
  // TODO: maybe just get rid of adding attributes at runtime and tell users to add it themselves
  if (!deadMenuButton) {
    if (targetEl.hasAttribute("type")) return;
    targetEl.setAttribute("type", "button");
    targetEl.setAttribute("aria-expanded", "false");
  }

  if (modal) {
    targetEl.setAttribute("aria-controls", uniqueId);
    targetEl.setAttribute("aria-haspopup", "dialog");
  }
};

export const setTargetAriaExpandTrue = (state: TLocalState) => {
  const { menuBtnEls, deadMenuButton } = state;
  if (!deadMenuButton) return;
  if (!menuBtnEls) return;
  menuBtnEls.forEach((el) => {
    el.setAttribute("aria-expanded", "true");
  });
};
export const setTargetAriaExpandFalse = (state: TLocalState) => {
  const { menuBtnEls, deadMenuButton } = state;
  if (!deadMenuButton) return;
  if (!menuBtnEls) return;
  menuBtnEls.forEach((el) => {
    el.setAttribute("aria-expanded", "false");
  });
};

export const removeMenuButtonEvents = (
  state: TLocalState,
  isCleanup?: boolean
) => {
  if (!state || !state.menuBtnEls) return;

  state.menuBtnMouseDownFired = false;

  state.menuBtnEls.forEach((menuBtnEl) => {
    if (isCleanup) {
      menuBtnEl.removeEventListener("blur", state.onBlurMenuButtonRef);
      menuBtnEl.removeEventListener("keydown", state.onKeydownMenuButtonRef);

      menuBtnEl.removeEventListener("click", state.onClickMenuButtonRef);
      menuBtnEl.removeEventListener("focus", state.onFocusMenuButtonRef);
      menuBtnEl.removeEventListener(
        "mousedown",
        state.onMouseDownMenuButtonRef
      );
    }
  });
};
