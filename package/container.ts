import { JSX } from "solid-js";
import { dismissStack } from "./dismissStack";
import { globalState, onDocumentClick } from "./globalEvents";
import { TLocalState } from "./localState";
import { queryElement } from "./utils";

// Safari, if relatedTarget is not contained within focusout, it will be null
export const onFocusOutContainer = (state: TLocalState, e: FocusEvent) => {
  const {
    uniqueId,
    overlay,
    overlayElement,
    open,
    mount,
    setOpen,
    timeouts,
    stopComponentEventPropagation,
  } = state;
  const relatedTarget = e.relatedTarget as HTMLElement | null;
  const activeElement = document.activeElement as HTMLElement;

  // console.log("focusout", { relatedTarget, activeElement });
  if (overlay) return;
  if (overlayElement) return;

  if (!open()) return;

  if (globalState.closedBySetOpen) {
    console.log("BLOCKED");
    return;
  }

  if (mount && stopComponentEventPropagation) {
    if (!globalState.addedDocumentClick) {
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
    }
    return;
  }

  if (!relatedTarget) {
    if (dismissStack.find((item) => item.overlay)) return;

    if (!globalState.addedDocumentClick) {
      console.log("add doc click");
      globalState.addedDocumentClick = true;
      document.addEventListener("click", onDocumentClick, { once: true });
    }
    return;
  }

  timeouts.containerFocusTimeoutId = window.setTimeout(() => {
    // console.log("remove", relatedTarget);
    setOpen(false);
  });
};

export const onFocusInContainer = (state: TLocalState, e: FocusEvent) => {
  const { timeouts } = state;
  // if (state.stopPropagateFocusInAndFocusOut) {
  //   e.stopPropagation();
  // }
  // console.log("focusin");
  clearTimeout(timeouts.containerFocusTimeoutId!);
  clearTimeout(timeouts.menuButtonBlurTimeoutId!);

  timeouts.containerFocusTimeoutId = null;
};

export const runFocusOnActive = (state: TLocalState) => {
  const { focusElementOnOpen } = state;
  if (focusElementOnOpen == null) return;

  const el = queryElement(state, {
    inputElement: focusElementOnOpen,
    type: "focusElementOnOpen",
  });
  if (el) {
    setTimeout(() => {
      el.focus();
    });
  }
};

export const onClickContainer = (state: TLocalState, e: Event) => {
  // 1. Clicking close buttons
  // use bubbling instead setting event listeners for close buttons, this will also enable dynamic buttons to be clicked since on bubble closeButtons will be fetched
  // since close buttons triggers removal of container that contains focus item, relatedTarget will be null, since activeElement defaults to body.
  // since the the removal of the container, forces activeElement to move to body, all focuseout events below the stack(s) fire. For the container focuseout event, if relatedTarget is null, it will add document click event and since the click is still bubbling and once it reaches to document the clicked element doesn't exist therefore wrongfully removing next stack(s)
  // to prevent this bug, we set toggle global variable that container depeneds on to true, to exit focusout(s), then on next tick, set to false
  // let clickToClose = false;
  // clickToClose = true;
  // setTimeout(() => {
  //   clickToClose = false;
  // });
  // no need to add document click because the author must set set focus to outer context(such as menuButton)
  // 2. alternative to not propagate component events
  // clearTimeout(timeouts.containerFocusTimeoutId!);
  // clearTimeout(timeouts.menuButtonBlurTimeoutId!);
};
