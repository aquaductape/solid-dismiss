import "./browserInfo";
import {
  untrack,
  Accessor,
  onMount,
  createEffect,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
  createMemo,
  createComputed,
} from "solid-js";
import { queryElement } from "./utils";
import {
  dismissStack,
  addDismissStack,
  removeDismissStack,
  TDismissStack,
} from "./dismissStack";
import {
  addGlobalEvents,
  globalState,
  onDocumentClick,
  removeGlobalEvents,
} from "./globalEvents";
import { TLocalState } from "./localState";
import {
  onFocusInContainer,
  onFocusOutContainer,
  runFocusOnActive,
} from "./container";
import {
  onClickDocument,
  onFocusFromOutsideAppOrTab,
  removeOutsideFocusEvents,
} from "./outside";
import { addMenuPopupEl, removeMenuPopupEl } from "./menuPopup";
import {
  onBlurMenuButton,
  onClickMenuButton,
  onFocusMenuButton,
  onKeydownMenuButton,
  onMouseDownMenuButton,
} from "./menuButton";
import { activateLastFocusSentinel, onFocusSentinel } from "./focusSentinel";
import { onClickOverlay } from "./overlay";
import CreatePortal from "./CreatePortal";
import { Transition } from "./Transition";
import { removeLocalEvents } from "./manageLocalEvents";

// Safari iOS notes
// buttons can't receive focus on tap, only through invoking `focus()` method
// blur (tested so far on only buttons) will fire even on tapping same focused button (which would be invoked `focus()` )
// For Nested Dropdowns. Since button has to be refocused, when nested button(1) is tapped, it also triggers focusout container(1) for some reason

export type DismissAnimation = {
  /**
   * Used to automatically generate transition CSS class names. e.g. name: 'fade' will auto expand to .fade-enter, .fade-enter-active, etc.
   */
  name?: string;
  enterActiveClass?: string;
  enterClass?: string;
  enterToClass?: string;
  exitActiveClass?: string;
  exitClass?: string;
  exitToClass?: string;
  onBeforeEnter?: (el: Element) => void;
  onEnter?: (el: Element, done: () => void) => void;
  onAfterEnter?: (el: Element) => void;
  onBeforeExit?: (el: Element) => void;
  onExit?: (el: Element, done: () => void) => void;
  onAfterExit?: (el: Element) => void;
  /**
   * Change element where CSS classes are appended and passed to callbacks.
   *
   * css selector, queried from root component, to get menu popup element. Or pass JSX element
   *
   * Using `"container"` value will use root element of the component
   *
   * @defaultValue The element is the child of the component, where CSS classes are appended to, and element is passed to callbacks
   */
  appendToElement?: "container" | string | Node;
  /**
   * Whether to apply transition on initial render.
   *
   * @defaultValue `false`
   */
  appear?: boolean;
};

export type OnOpenHandler = (
  open: boolean,
  props: {
    uniqueId: string;
    dismissStack: DismissStack[];
  }
) => void;

export type TDismiss = {
  /**
   * sets id attribute for root component
   */
  id?: string;
  ref?: JSX.Element;
  class?: string;
  classList?: { [key: string]: boolean };
  open: Accessor<boolean>;
  setOpen: (v: boolean) => void;
  /**
   * callback when setOpen signal changes
   */
  onOpen?: OnOpenHandler;
  /**
   * css selector, queried from document, to get menu button element. Or pass JSX element
   */
  menuButton: string | JSX.Element | (() => JSX.Element);
  /**
   *
   * css selector, queried from document, to get menu popup element. Or pass JSX element
   *
   * @defaultValue root component element queries first child element
   */
  menuPopup?: string | JSX.Element | (() => JSX.Element);
  /**
   *
   * Have the behavior to move through a list of "dropdown items" using cursor keys.
   *
   * @defaultValue `false`
   */
  cursorKeys?: boolean;
  /**
   *
   * Focus will remain inside menuPopup when pressing Tab key
   *
   * @defaultValue `false`
   */
  trapFocus?: boolean;
  /**
   *
   * which element, via selector*, to recieve focus after popup opens.
   *
   * *css string queried from root component, or if string value is `"menuPopup"` uses menuPopup element.
   *
   * @defaultValue focus remains on `"menuButton"`
   */
  focusElementOnOpen?: "menuPopup" | string | JSX.Element | (() => JSX.Element);
  /**
   *
   * Which element, via selector*, to recieve focus after popup closes.
   *
   * *selector: css string queried from document, or if string value is `"menuButton"` uses menuButton element
   *
   * @remarks
   *
   * If menuPopup is mounted elsewhere in the DOM or doesn't share the same parent as menuButton, when tabbing outside menuPopup, this library programmatically grabs the correct next tabbable element after menuButton. However if that next tabbable element is inside an iframe that has different origin, then this library won't be able to grab tabbable elements inside it, instead the iframe will be focused.
   *
   *
   * @defaultValue
   *
   * When Tabbing forwards, focuses on tabbable element after menuButton. When Tabbing backwards, focuses on menuButton. When pressing Escape key, menuButton will be focused. When "click", user-agent determines which element recieves focus, however if overlay is `true`, then menuButton will be focused instead.
   */
  focusElementOnClose?:
    | "menuButton"
    | string
    | JSX.Element
    | {
        /**
         *
         * focus on element when exiting menuPopup via tabbing backwards ie "Shift + Tab".
         *
         * @defaultValue `"menuButton"`
         *
         */
        tabBackwards?: "menuButton" | string | JSX.Element;
        /**
         *
         * focus on element when exiting menuPopup via tabbing forwards ie "Tab".
         *
         * @remarks
         *
         *  If popup is mounted elsewhere in the DOM, when tabbing outside, this library is able to grab the correct next tabbable element after menuButton, except for tabbable elements inside iframe with cross domain.
         *
         * @defaultValue next tabbable element after menuButton;
         */
        tabForwards?: "menuButton" | string | JSX.Element;
        /**
         * focus on element when exiting menuPopup via click outside popup.
         *
         * If mounted overlay present, and popup closes via click, then menuButton will be focused.
         *
         * @remarks
         *
         * When clicking, user-agent determines which element recieves focus.
         */
        click?: "menuButton" | string | JSX.Element;
        /**
         *
         * focus on element when exiting menuPopup via "Escape" key
         *
         * @defaultValue `"menuButton"`
         */
        escapeKey?: "menuButton" | string | JSX.Element;
        /**
         *
         * focus on element when exiting menuPopup via scrolling, from scrollable container that contains menuButton
         *
         * @dafaultValue `"menuButton"`
         */
        scrolling?: "menuButton" | string | JSX.Element;
      };

  /**
   *
   * When `true`, after focusing within menuPopup, if focused back to menu button via keyboard (Tab key), the menuPopup will close.
   *
   * @defaultValue `false`
   */
  closeWhenMenuButtonIsTabbed?: boolean;
  /**
   *
   * If `overlay` is `true`, menuPopup will always close when menu button is clicked
   *
   * @defaultValue `false`
   */
  closeWhenMenuButtonIsClicked?: boolean;
  /**
   *
   * Closes menuPopup when any scrollable container (except inside menuPopup) is scrolled
   *
   * @remark
   *
   * Even when `true`, scrolling in "outside" scrollable iframe won't be able to close menuPopup.
   *
   * @defaultValue `false`
   */
  closeWhenScrolling?: boolean;
  /**
   *
   * If `false`, menuPopup won't close when overlay backdrop is clicked. When overlay clicked, menuPopup will recieve focus.
   *
   * @defaultValue `true`
   */

  closeWhenOverlayClicked?: boolean;
  /**
   *
   * Closes menuPopup when escape key is pressed
   *
   * @defaultValue `true`
   */
  closeWhenEscapeKeyIsPressed?: boolean;
  /**
   *
   * Closes when the document "blurs". This would happen when interacting outside of the page such as Devtools, changing browser tabs, or switch different applications.
   */
  closeWhenDocumentBlurs?: boolean;
  /**
   *
   * If `true`, sets "overflow: hidden" declaration to Document.scrollingElement.
   *
   * @defaultValue `false`
   */
  removeScrollbar?: boolean;
  /**
   * Prevent page interaction when clicking outside to close menuPopup
   *
   * Author must create overlay element within menuPopup, this way page elements underneath the menuPopup can't be interacted with.
   *
   *
   * @defaultValue `false`
   */
  overlay?: boolean;
  /**
   * Prevent page interaction when clicking outside to close menuPopup
   *
   * Adds root level div that acts as a layer. This removes interaction of the page elements that's underneath the overlay element, that way menuPopup is the only element that can be interacted with.
   *
   * @defaultValue `false`
   */
  overlayElement?:
    | boolean
    | {
        ref?: (el: HTMLElement) => void;
        class?: string;
        classList?: { [key: string]: boolean };
        animation?: DismissAnimation;
      };
  /**
   *
   * activates sentinel element as last tabbable item in menuPopup, that way when Tabbing "forwards" out of menuPopup, the next logical tabblable element after menuButton will be focused.
   *
   *
   * @defaultValue `false` unless `Dismiss.mount` is set, `Dismiss.focusElementOnClosed` is set, `Dismiss.overlay` prop is `true`, or this component's root container is not an adjacent sibling of menuButton.
   */
  enableLastFocusSentinel?: boolean;
  /**
   *
   * Inserts menuPopup in the mount node. Useful for inserting menuPopup outside of page layout. Events still propagate through the Component Hierarchy.
   */
  mount?: string | Node;
  /**
   * Place CSS class names or JS Web Animation to fire animation as menuPopup enters/exits
   *
   * @defaultValue none
   */
  animation?: DismissAnimation;
  /**
   * Determine whether children are rendered always, or conditionally.
   *
   * If `true`, children are rendered.
   *
   * @defaultValue `false`, children are conditionally rendered based on `Dismiss.open` value.
   */
  show?: boolean;
  stopComponentEventPropagation?: boolean;
};
//

export type DismissStack = TDismissStack;

/**
 *
 * Handles "click outside" behavior for button popup pairings. Closing is triggered by click/focus outside of popup element or pressing "Escape" key.
 */
const Dismiss: Component<TDismiss> = (props) => {
  const {
    id = "",
    menuButton,
    menuPopup,
    focusElementOnClose,
    focusElementOnOpen,
    cursorKeys = false,
    closeWhenMenuButtonIsTabbed = false,
    closeWhenMenuButtonIsClicked = true,
    closeWhenScrolling = false,
    closeWhenDocumentBlurs = false,
    closeWhenOverlayClicked = true,
    closeWhenEscapeKeyIsPressed = true,
    overlay = false,
    overlayElement = false,
    trapFocus = false,
    removeScrollbar = false,
    enableLastFocusSentinel = false,
    mount,
    stopComponentEventPropagation = false,
    show = false,
    onOpen,
  } = props;

  const state: TLocalState = {
    mount,
    addedFocusOutAppEvents: false,
    closeWhenOverlayClicked,
    stopComponentEventPropagation,
    closeWhenDocumentBlurs,
    closeWhenEscapeKeyIsPressed,
    closeWhenMenuButtonIsClicked,
    closeWhenMenuButtonIsTabbed,
    closeWhenScrolling,
    cursorKeys,
    focusElementOnClose,
    focusElementOnOpen,
    id,
    uniqueId: createUniqueId(),
    menuBtnId: "",
    menuBtnKeyupTabFired: false,
    menuButton,
    timeouts: {
      containerFocusTimeoutId: null,
      menuButtonBlurTimeoutId: null,
    },
    upperStackRemovedByFocusOut: false,
    menuPopup,
    menuPopupAdded: false,
    enableLastFocusSentinel,
    overlay,
    overlayElement,
    removeScrollbar,
    trapFocus,
    hasFocusSentinels:
      !!focusElementOnClose ||
      overlay ||
      !!overlayElement ||
      trapFocus ||
      enableLastFocusSentinel,
    open: props.open,
    setOpen: props.setOpen,
    onClickDocumentRef: (e) => onClickDocument(state, e),
    onClickOverlayRef: () => onClickOverlay(state),
    onFocusInContainerRef: (e) => onFocusInContainer(state, e),
    onFocusOutContainerRef: (e) => onFocusOutContainer(state, e),
    onBlurMenuButtonRef: (e) => onBlurMenuButton(state, e),
    onClickMenuButtonRef: (e) => onClickMenuButton(state, e),
    onMouseDownMenuButtonRef: () => onMouseDownMenuButton(state),
    onFocusFromOutsideAppOrTabRef: (e) => onFocusFromOutsideAppOrTab(state, e),
    onFocusMenuButtonRef: () => onFocusMenuButton(state),
    onKeydownMenuButtonRef: (e) => onKeydownMenuButton(state, e),
    refContainerCb: (el: HTMLElement) => {
      if (overlayElement) {
        el.style.zIndex = "1000";
      }
      if (props.ref) {
        // @ts-ignore
        props.ref(el);
      }
      state.containerEl = el as any;
    },
    refOverlayCb: (el: HTMLElement) => {
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.zIndex = "1000";

      if (typeof overlayElement === "object" && overlayElement.ref) {
        overlayElement.ref(el);
      }

      state.overlayEl = el as any;
    },
  };

  // let marker: Text | null =
  //   props.overlay &&
  //   typeof props.overlay === "object" &&
  //   !props.overlay.stopComponentEventPropagation
  //     ? null
  //     : document.createTextNode("");
  let marker: Text | null = !stopComponentEventPropagation
    ? document.createTextNode("")
    : null;
  const initDefer = !props.open();

  let containerEl: HTMLElement | null;
  let mountEl: Element | Node | null;
  let endExitTransitionRef: () => void;
  let endEnterTransitionRef: () => void;
  let endExitTransitionOverlayRef: () => void;
  let endEnterTransitionOverlayRef: () => void;
  let exitRunning = false;

  function getElement(el: Element, appendToElement?: string | Node) {
    if (appendToElement) {
      if (appendToElement === "container") {
        return el;
      }

      return typeof appendToElement === "string"
        ? el.querySelector(appendToElement)!
        : (appendToElement as Element);
    }

    return el.children[1];
  }

  function enterTransition(type: "popup" | "overlay", el: Element) {
    // @ts-ignore
    if (type === "overlay" && (!props.overlay || !props.overlay.animation))
      return;
    const animation: DismissAnimation =
      type === "popup"
        ? props.animation // @ts-ignore
        : props.overlay.animation;

    if (!animation) return;
    if (!animation.appear && !initDefer) return;
    exitRunning = false;

    el = getElement(el, animation.appendToElement);

    const name = animation.name;
    let {
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      enterActiveClass = name + "-enter-active",
      enterClass = name + "-enter",
      enterToClass = name + "-enter-to",
      exitActiveClass = name + "-exit-active",
      exitClass = name + "-exit",
      exitToClass = name + "-exit-to",
    } = animation;

    const enterClasses = enterClass!.split(" ");
    const enterActiveClasses = enterActiveClass!.split(" ");
    const enterToClasses = enterToClass!.split(" ");
    const exitClasses = exitClass!.split(" ");
    const exitActiveClasses = exitActiveClass!.split(" ");
    const exitToClasses = exitToClass!.split(" ");

    if (type === "popup") {
      el.removeEventListener("transitionend", endExitTransitionRef);
      el.removeEventListener("animationend", endExitTransitionRef);
    } else {
      el.removeEventListener("transitionend", endExitTransitionOverlayRef);
      el.removeEventListener("animationend", endExitTransitionOverlayRef);
    }

    onBeforeEnter && onBeforeEnter(el);
    el.classList.remove(...exitClasses, ...exitActiveClasses, ...exitToClasses);
    el.classList.add(...enterClasses);
    el.classList.add(...enterActiveClasses);

    requestAnimationFrame(() => {
      el.classList.remove(...enterClasses);
      el.classList.add(...enterToClasses);
      onEnter && onEnter(el, endTransition);
      if (!onEnter || onEnter!.length < 2) {
        if (type === "popup") {
          endEnterTransitionRef = endTransition;
        } else {
          endEnterTransitionOverlayRef = endTransition;
        }
        el.addEventListener("transitionend", endTransition, {
          once: true,
        });
        el.addEventListener("animationend", endTransition, {
          once: true,
        });
      }
    });

    function endTransition() {
      if (el) {
        el.classList.remove(...enterActiveClasses);
        el.classList.remove(...enterToClasses);
        onAfterEnter && onAfterEnter(el);
      }
    }
  }

  function exitTransition(type: "overlay" | "popup", el: Element) {
    if (!props.animation) {
      mountEl?.removeChild(containerEl!);
      containerEl = null;
      mountEl = null;
      return;
    }
    // @ts-ignore
    if (type === "overlay" && (!props.overlay || !props.overlay.animation))
      return;
    // @ts-ignore
    const animation: TAnimation =
      type === "popup"
        ? props.animation
        : // @ts-ignore
          props.overlay.animation;
    exitRunning = true;

    el = getElement(el, animation.appendToElement);

    const name = animation.name;
    let {
      onBeforeExit,
      onExit,
      onAfterExit,
      exitActiveClass = name + "-exit-active",
      exitClass = name + "-exit",
      exitToClass = name + "-exit-to",
    } = animation;

    const exitClasses = exitClass!.split(" ");
    const exitActiveClasses = exitActiveClass!.split(" ");
    const exitToClasses = exitToClass!.split(" ");

    if (type === "popup") {
      el.removeEventListener("transitionend", endEnterTransitionRef);
      el.removeEventListener("animationend", endEnterTransitionRef);
    } else {
      el.removeEventListener("transitionend", endEnterTransitionOverlayRef);
      el.removeEventListener("animationend", endEnterTransitionOverlayRef);
    }

    if (!el.parentNode) return endTransition();
    onBeforeExit && onBeforeExit(el);
    el.classList.add(...exitClasses);
    el.classList.add(...exitActiveClasses);
    requestAnimationFrame(() => {
      el.classList.remove(...exitClasses);
      el.classList.add(...exitToClasses);
    });
    onExit && onExit(el, endTransition);
    if (!onExit || onExit.length < 2) {
      if (type === "popup") {
        endExitTransitionRef = endTransition;
      } else {
        endExitTransitionOverlayRef = endTransition;
      }
      el.addEventListener("transitionend", endTransition, { once: true });
      el.addEventListener("animationend", endTransition, { once: true });
    }

    function endTransition() {
      console.log("ended TRANSITION", state.uniqueId);
      exitRunning = false;
      mountEl?.removeChild(containerEl!);
      globalState.closedBySetOpen = false;

      resetFocusOnClose();

      onAfterExit && onAfterExit(containerEl?.firstElementChild!);
      containerEl = null;
      mountEl = null;
    }
  }

  const runRemoveScrollbar = (open: boolean) => {
    if (!removeScrollbar) return;

    if (dismissStack.length > 1) return;

    if (open) {
      const el = document.scrollingElement as HTMLElement;
      el.style.overflow = "hidden";
    } else {
      const el = document.scrollingElement as HTMLElement;
      el.style.overflow = "";
    }
  };

  const resetFocusOnClose = () => {
    const menuBtnExists = globalState.menuBtnEl;
    const activeElement = document.activeElement;

    if (!state.overlay && !state.overlayElement) {
      if (state.menuBtnEl && dismissStack.length) {
        state.menuBtnEl?.focus();
      }
      return;
    }
    if (!menuBtnExists) return;

    if (
      !state.containerEl?.contains(activeElement) &&
      activeElement !== document.body
    ) {
      return;
    }

    state.menuBtnEl?.focus();
  };

  onMount(() => {
    state.menuBtnEl = queryElement(state, {
      inputElement: menuButton,
      type: "menuButton",
    });
    state.menuBtnEl.setAttribute("type", "button");
    state.menuBtnEl.addEventListener("click", state.onClickMenuButtonRef);
    state.menuBtnEl.addEventListener(
      "mousedown",
      state.onMouseDownMenuButtonRef
    );
    if (
      props.open() &&
      (!state.focusElementOnOpen ||
        state.focusElementOnOpen === "menuButton" ||
        state.focusElementOnOpen === state.menuBtnEl)
    ) {
      state.menuBtnEl.addEventListener("blur", state.onBlurMenuButtonRef, {
        once: true,
      });
    }
  });

  createComputed(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;

        if (!open) {
          console.log("run computed!!");
          // used to detect programmatic removal
          if (!globalState.closedBySetOpen) {
            globalState.closedBySetOpen = true;
            globalState.menuBtnEl = state.menuBtnEl;

            setTimeout(() => {
              globalState.closedBySetOpen = false;
              resetFocusOnClose();
            });
          }
        } //

        if (!mount) return;

        if (open) {
          if (!mountEl) {
            CreatePortal({
              mount:
                typeof mount === "string"
                  ? document.querySelector(mount)!
                  : mount!,
              popupChildren: render(props.children),
              overlayChildren: overlayElement ? renderOverlay() : null,
              marker,
              onCreate: (mount, container) => {
                mountEl = mount;
                containerEl = container;
              },
            });
          }

          enterTransition("popup", containerEl?.firstElementChild!);
          enterTransition("overlay", state.overlayEl!);
        } else {
          exitTransition("popup", containerEl?.firstElementChild!);
          exitTransition("overlay", state.overlayEl!);
        }
      },
      { defer: initDefer }
    )
  );

  createEffect(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;

        if (open) {
          addMenuPopupEl(state);
          runFocusOnActive(state);

          addGlobalEvents(closeWhenScrolling);

          addDismissStack({
            id,
            uniqueId: state.uniqueId,
            open: props.open,
            setOpen: props.setOpen,
            containerEl: state.containerEl!,
            menuBtnEl: state.menuBtnEl!,
            overlayEl: state.overlayEl!,
            menuPopupEl: state.menuPopupEl!,
            overlay,
            closeWhenDocumentBlurs,
            closeWhenEscapeKeyIsPressed,
            closeWhenMenuButtonIsTabbed,
            overlayElement,
            cursorKeys,
            focusElementOnClose,
            upperStackRemovedByFocusOut: false,
            detectIfMenuButtonObscured: false,
            queueRemoval: false,
            timeouts: state.timeouts,
          });

          runRemoveScrollbar(open);
          onOpen && onOpen(open, { uniqueId: state.uniqueId, dismissStack });
          activateLastFocusSentinel(state);
        } else {
          removeLocalEvents(state);

          removeOutsideFocusEvents(state);
          removeMenuPopupEl(state);
          removeDismissStack(state.uniqueId);
          removeGlobalEvents();
          runRemoveScrollbar(open);
          onOpen && onOpen(open, { uniqueId: state.uniqueId, dismissStack });
        }
      },
      { defer: initDefer }
    )
  );

  onCleanup(() => {
    removeLocalEvents(state, { onCleanup: true });

    removeMenuPopupEl(state);
    removeOutsideFocusEvents(state);
    removeDismissStack(state.uniqueId);
    removeGlobalEvents();

    if (mount && mountEl && !exitRunning) {
      exitTransition("popup", containerEl?.firstElementChild!);
      exitTransition("overlay", state.overlayEl!);
    }
  });

  function renderOverlay() {
    return (
      <div
        class={
          typeof props.overlayElement === "object"
            ? props.overlayElement.class
            : undefined
        }
        classList={
          typeof props.overlayElement === "object"
            ? props.overlayElement.classList || {}
            : {}
        }
        role="presentation"
        onClick={state.onClickOverlayRef}
        ref={state.refOverlayCb}
      ></div>
    );
  }

  function render(children: JSX.Element) {
    return (
      <div
        id={state.id}
        class={props.class}
        classList={props.classList || {}}
        onFocusIn={state.onFocusInContainerRef}
        onFocusOut={state.onFocusOutContainerRef}
        ref={state.refContainerCb}
      >
        <div
          tabindex="0"
          onFocus={(e) => {
            onFocusSentinel(state, "first", e.relatedTarget as HTMLElement);
          }}
          style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelFirstEl}
        ></div>
        {children}
        <div
          tabindex={state.hasFocusSentinels ? "0" : "-1"}
          onFocus={() => {
            onFocusSentinel(state, "last");
          }}
          style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelLastEl}
        ></div>
      </div>
    );
  }

  if (props.mount) return marker;
  if (show) return render(props.children);

  let strictEqual = false;
  const condition = createMemo<boolean>(() => props.open(), undefined, {
    equals: (a, b) => (strictEqual ? a === b : !a === !b),
  });

  const finalRender = createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      return (strictEqual = typeof child === "function" && child.length > 0)
        ? untrack(() => (child as any)(c))
        : render(child);
    }
  });

  if (props.animation) {
    return (
      <Transition
        {...props.animation}
        name={props.animation.name}
        enterClass={props.animation.enterClass}
        enterActiveClass={props.animation.enterActiveClass}
        enterToClass={props.animation.enterToClass}
        exitClass={props.animation.exitClass}
        exitActiveClass={props.animation.exitActiveClass}
        exitToClass={props.animation.exitToClass}
        appear={props.animation.appear}
      >
        {finalRender()}
      </Transition>
    );
  }

  return finalRender;
};

export default Dismiss;
