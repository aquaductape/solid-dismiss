import "./browserInfo";
import {
  untrack,
  batch,
  Accessor,
  onMount,
  createEffect,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
  createMemo,
  Show,
  createComputed,
  createSignal,
  children,
  mergeProps,
} from "solid-js";
import { queryElement } from "./utils";
import {
  dismissStack,
  addDismissStack,
  removeDismissStack,
  TDismissStack,
} from "./dismissStack";
import { addGlobalEvents, removeGlobalEvents } from "./globalEvents";
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
  addCloseButtons,
  onClickCloseButtons,
  removeCloseButtons,
} from "./closeButtons";
import {
  onBlurMenuButton,
  onClickMenuButton,
  onFocusMenuButton,
  onKeydownMenuButton,
  runAriaExpanded,
} from "./menuButton";
import { activateLastFocusSentinel, onFocusSentinel } from "./focusSentinel";
import { onClickOverlay } from "./overlay";
import CreatePortal from "./CreatePortal";

// Safari iOS notes
// buttons can't receive focus on tap, only through invoking `focus()` method
// blur (tested so far on only buttons) will fire even on tapping same focused button (which would be invoked `focus()` )
// For Nested Dropdowns. Since button has to be refocused, when nested button(1) is tapped, it also triggers focusout container(1) for some reason

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
  onOpen?: (open: boolean, dismissStack: DismissStack[]) => void;
  /**
   * pass set signal to keep track if whether menuButton or container are focused
   */
  setFocus?: (v: boolean) => void;
  /**
   * css selector, queried from document, to get menu button element. Or pass JSX element
   */
  menuButton: string | JSX.Element | (() => JSX.Element);
  /**
   * Default: root component element queries first child element
   * css selector, queried from document, to get menu popup element. Or pass JSX element
   */
  menuPopup?: string | JSX.Element | (() => JSX.Element);
  /**
   * Default: `undefined`
   *
   * css selector, queried from container element, to get close button element(s). Or pass JSX element(s)
   */
  closeButtons?:
    | string
    | JSX.Element
    | (string | JSX.Element)[]
    | (() => JSX.Element)
    | (() => (string | JSX.Element)[]);
  /**
   * Default: `false`
   *
   * Have the behavior to move through a list of "dropdown items" using cursor keys.
   *
   */
  cursorKeys?: boolean;
  /**
   * Default: `false`
   *
   * Focus will remain inside menuPopup when pressing Tab key
   */
  trapFocus?: boolean;
  /**
   * Default: focus remains on `"menuButton"`
   *
   * which element, via selector*, to recieve focus after popup opens.
   *
   * *css string queried from document, or if string value is `"menuPopup"` uses menuPopup element.
   */
  focusElementOnOpen?: "menuPopup" | string | JSX.Element | (() => JSX.Element);
  /**
   * Default: When Tabbing forwards, focuses on tabbable element*¹ after menuButton. When Tabbing backwards, focuses on menuButton. When pressing Escape key, menuButton will be focused. When "click", user-agent determines which element recieves focus, however if overlay is `true`, then menuButton will be focused instead.
   *
   * Which element, via selector*², to recieve focus after popup closes.
   *
   * An example would be to emulate native <select> element behavior, set which sets focus to menuButton after dismiss.
   *
   * *¹ If menuPopup is mounted elsewhere in the DOM or doesn't share the same parent as menuButton, when tabbing outside menuPopup, this library programmatically grabs the correct next tabbable element after menuButton. However if that next tabbable element is inside an iframe that has different origin, then this library won't be able to grab tabbable elements inside it, instead the iframe will be focused.
   *
   * *² selector: css string queried from document, or if string value is `"menuButton"` uses menuButton element
   *
   *
   */
  focusElementOnClose?: TFocusElementOnClose;
  /**
   * Default: `false`
   *
   * When `true`, after focusing within menuPopup, if focused back to menu button via keyboard (Tab key), the menuPopup will close.
   *
   */
  closeWhenMenuButtonIsTabbed?: boolean;
  /**
   * Default: `true`
   *
   * If `overlay` is `true`, menuPopup will always close when menu button is clicked
   */
  closeWhenMenuButtonIsClicked?: boolean;
  /**
   * Default: `false`
   *
   * Closes menuPopup when any scrollable container (except inside menuPopup) is scrolled
   *
   * Note: Even when `true`, scrolling in "outside" scrollable iframe won't be able to close menuPopup.
   */
  closeWhenScrolling?: boolean;
  /**
   * Default: `true`
   *
   * If `false`, menuPopup won't close when overlay backdrop is clicked, should use `overlay` prop to work. When backdrop clicked, menuPopup will recieve focus.
   */
  closeWhenClickedOutside?: boolean;
  /**
   * Default: `true`
   *
   * Closes menuPopup when escape key is pressed
   */
  closeWhenEscapeKeyIsPressed?: boolean;
  /**
   * Default: `false`
   *
   * Closes when the document "blurs". This would happen when interacting outside of the page such as Devtools, changing browser tabs, or switch different applications.
   */
  closeWhenDocumentBlurs?: boolean;
  /**
   * Default: `false`
   *
   * If `true`, sets "overflow: hidden" declaration to Document.scrollingElement.
   *
   * Use callback function if author wants customize how the scrollbar is removed.
   */
  removeScrollbar?: boolean;
  /**
   * Default `false`
   *
   * Adds root level div that acts as a layer. This removes interaction of the page elements that's underneath the overlay element, that way menuPopup is the only element that can be interacted with. Author must ensure that menuPopup is placed above overlay element, one of the ways, is to nest this Component inside Solid's {@link https://www.solidjs.com/docs/latest/api#%3Cportal%3E Portal}.
   *
   */
  overlay?:
    | boolean
    | {
        ref?: (el: HTMLElement) => void;
        className?: string;
        classList?: { [key: string]: boolean };
      };
  /**
   * Default: `false`
   *
   * If `true` add aria attributes for generic expand/collapse dropdown.
   */
  useAriaExpanded?: boolean;
  /**
   * Default: `false`
   *
   * If `true` activates sentinel element as last tabbable item in menuPopup, that way when Tabbing "forwards" out of menuPopup, the next logical tabblable element after menuButton will be focused.
   *
   * Automatically set to `true` for the following:  `overlay` prop is `true`,  this component's root container is not an adjacent sibling of menuButton, or `focusElWhenClosed` prop has a value.
   */
  mountedElseWhere?: boolean;
  mount?: string | Node;
  /**
   * Default: `false`
   */
  stopComponentEventPropagation?: boolean;
  animation?: {
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
    appear?: boolean;
  };
};

export type TFocusElementOnClose =
  | "menuButton"
  | string
  | JSX.Element
  | {
      /**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via tabbing backwards ie "Shift + Tab".
       *
       */
      tabBackwards?: "menuButton" | string | JSX.Element;
      /**
       * Default: next tabbable element after menuButton;
       *
       * focus on element when exiting menuPopup via tabbing forwards ie "Tab".
       *
       * Note: If popup is mounted elsewhere in the DOM, when tabbing outside, this library is able to grab the correct next tabbable element after menuButton, except for tabbable elements inside iframe with cross domain.
       */
      tabForwards?: "menuButton" | string | JSX.Element;
      /**
       * focus on element when exiting menuPopup via click outside popup.
       *
       * If overlay present, and popup closes via click, then menuButton will be focused.
       *
       * Note: When clicking, user-agent determines which element recieves focus, to prevent this, use `overlay` prop.
       */
      click?: "menuButton" | string | JSX.Element;
      /**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via "Escape" key
       */
      escapeKey?: "menuButton" | string | JSX.Element;
      /**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via scrolling, from scrollable container that contains menuButton
       */
      scrolling?: "menuButton" | string | JSX.Element;
    };

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
    closeButtons,
    cursorKeys = false,
    closeWhenMenuButtonIsTabbed = false,
    closeWhenMenuButtonIsClicked = true,
    closeWhenScrolling = false,
    closeWhenDocumentBlurs = false,
    closeWhenClickedOutside = true,
    closeWhenEscapeKeyIsPressed = true,
    overlay = false,
    trapFocus = false,
    removeScrollbar = false,
    useAriaExpanded = false,
    mountedElseWhere = false,
    stopComponentEventPropagation = false,
    mount,
    onOpen,
  } = props;

  const state: TLocalState = {
    mount: !!mount,
    addedFocusOutAppEvents: false,
    closeBtns: [],
    closeBtnsAdded: false,
    closeButtons,
    closeWhenClickedOutside,
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
    containerFocusTimeoutId: null,
    menuButtonBlurTimeoutId: null,
    upperStackRemovedByFocusOut: false,
    menuPopup,
    menuPopupAdded: false,
    mountedElseWhere,
    overlay,
    removeScrollbar,
    trapFocus,
    useAriaExpanded,
    hasFocusSentinels:
      !!focusElementOnClose || !!overlay || trapFocus || mountedElseWhere,
    open: props.open,
    setOpen: props.setOpen,
    onClickDocumentRef: (e) => onClickDocument(state, e),
    onClickOverlayRef: () => onClickOverlay(state),
    onFocusInContainerRef: (e) => onFocusInContainer(state, e),
    onFocusOutContainerRef: (e) => onFocusOutContainer(state, e),
    onBlurMenuButtonRef: (e) => onBlurMenuButton(state, e),
    onClickMenuButtonRef: () => onClickMenuButton(state),
    onFocusFromOutsideAppOrTabRef: (e) => onFocusFromOutsideAppOrTab(state, e),
    onFocusMenuButtonRef: () => onFocusMenuButton(state),
    onKeydownMenuButtonRef: (e) => onKeydownMenuButton(state, e),
    onClickCloseButtonsRef: () => onClickCloseButtons(state),
    refContainerCb: (el: HTMLElement) => {
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
      el.style.zIndex = `${999 + dismissStack.length}`;

      if (typeof overlay === "object" && overlay.ref) {
        overlay.ref(el);
      }

      state.overlayEl = el as any;
    },
  };

  let marker: Text | null = stopComponentEventPropagation
    ? null
    : document.createTextNode("");
  const initDefer = !props.open();

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

  onMount(() => {
    state.menuBtnEl = queryElement(state, {
      inputElement: menuButton,
      type: "menuButton",
    });
    // console.log("onMount!!!", state.menuBtnEl, state.menuBtnEl.isConnected);
    state.menuBtnEl.setAttribute("type", "button");
    state.menuBtnEl.addEventListener("click", state.onClickMenuButtonRef);
    state.menuBtnEl.addEventListener("focus", state.onFocusMenuButtonRef);
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
    state.menuBtnId = state.menuBtnEl.id;

    runAriaExpanded(state, props.open());

    if (!state.menuBtnId) {
      state.menuBtnId = id || state.uniqueId;
      state.menuBtnEl.id = state.menuBtnId;
    }
  });

  let containerEl: HTMLElement | null;
  let mountEl: Element | Node | null;
  let endExitTransitionRef: () => void;
  let endEnterTransitionRef: () => void;

  function enterTransition(el: Element) {
    if (!props.animation) return;
    if (!props.animation.appear && !initDefer) return;

    const name = props.animation.name;
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
    } = props.animation;
    console.log("enterTransition");

    const enterClasses = enterClass!.split(" ");
    const enterActiveClasses = enterActiveClass!.split(" ");
    const enterToClasses = enterToClass!.split(" ");
    const exitClasses = exitClass!.split(" ");
    const exitActiveClasses = exitActiveClass!.split(" ");
    const exitToClasses = exitToClass!.split(" ");
    el.removeEventListener("transitionend", endExitTransitionRef);
    el.removeEventListener("animationend", endExitTransitionRef);

    onBeforeEnter && onBeforeEnter(el);
    el.classList.remove(...exitClasses, ...exitActiveClasses, ...exitToClasses);
    el.classList.add(...enterClasses);
    el.classList.add(...enterActiveClasses);

    requestAnimationFrame(() => {
      el.classList.remove(...enterClasses);
      el.classList.add(...enterToClasses);
      onEnter && onEnter(el, endTransition);
      if (!onEnter || onEnter!.length < 2) {
        endEnterTransitionRef = endTransition;
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

  function exitTransition(el: Element) {
    if (!props.animation) return;

    const name = props.animation.name;
    let {
      onBeforeExit,
      onExit,
      onAfterExit,
      exitActiveClass = name + "-exit-active",
      exitClass = name + "-exit",
      exitToClass = name + "-exit-to",
    } = props.animation;

    const exitClasses = exitClass!.split(" ");
    const exitActiveClasses = exitActiveClass!.split(" ");
    const exitToClasses = exitToClass!.split(" ");
    el.removeEventListener("transitionend", endEnterTransitionRef);
    el.removeEventListener("animationend", endEnterTransitionRef);
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
      endExitTransitionRef = endTransition;
      el.addEventListener("transitionend", endTransition, { once: true });
      el.addEventListener("animationend", endTransition, { once: true });
    }

    function endTransition() {
      mountEl?.removeChild(containerEl!);
      onAfterExit && onAfterExit(containerEl?.firstElementChild!);
      containerEl = null;
      mountEl = null;
    }
  }

  if (mount) {
    createComputed(
      on(
        () => !!props.open(),
        (open, prevOpen) => {
          console.log("lib computed");
          if (open === prevOpen) return;

          if (open) {
            if (!mountEl) {
              CreatePortal({
                mount:
                  typeof mount === "string"
                    ? document.querySelector(mount)!
                    : mount!,
                children: render(),
                marker,
                useCleanup: false,
                onCreate: (mount, container) => {
                  mountEl = mount;
                  containerEl = container;
                },
              });
            }

            const foundItem = dismissStack.find(
              (item) => item.uniqueId === state.uniqueId
            );
            if (foundItem) foundItem.queueRemoval = false;
            enterTransition(containerEl?.firstElementChild!);
          } else {
            const foundItem = dismissStack.find(
              (item) => item.uniqueId === state.uniqueId
            );
            if (foundItem) foundItem.queueRemoval = true;
            console.log("exit", state.uniqueId);
            exitTransition(containerEl?.firstElementChild!);
          }
        },
        { defer: initDefer }
      )
    );
  }

  createEffect(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;
        // console.log("init cE");

        runAriaExpanded(state, open);

        if (open) {
          // console.log("createEffect");
          addCloseButtons(state);
          addMenuPopupEl(state);
          runFocusOnActive(state);

          addGlobalEvents(closeWhenScrolling);

          addDismissStack({
            id,
            uniqueId: state.uniqueId,
            open: props.open,
            setOpen: props.setOpen,
            setFocus: props.setFocus,
            containerEl: state.containerEl!,
            menuBtnEl: state.menuBtnEl!,
            overlayEl: state.overlayEl!,
            menuPopupEl: state.menuPopupEl!,
            overlay: !!overlay,
            closeWhenDocumentBlurs,
            closeWhenEscapeKeyIsPressed,
            cursorKeys,
            focusElementOnClose,
            upperStackRemovedByFocusOut: false,
            detectIfMenuButtonObscured: false,
            queueRemoval: false,
          });

          runRemoveScrollbar(open);
          onOpen && onOpen(open, dismissStack);
          activateLastFocusSentinel(state);
        } else {
          document.removeEventListener("click", state.onClickDocumentRef);

          removeOutsideFocusEvents(state);
          removeMenuPopupEl(state);
          removeCloseButtons(state);
          removeDismissStack(state.uniqueId);
          removeGlobalEvents();
          runRemoveScrollbar(open);
          onOpen && onOpen(open, dismissStack);
        }
      },
      { defer: initDefer }
    )
  );

  onCleanup(() => {
    state.menuBtnEl!.removeEventListener("click", state.onClickMenuButtonRef);
    document.removeEventListener("click", state.onClickDocumentRef);

    removeCloseButtons(state);
    removeMenuPopupEl(state);
    removeOutsideFocusEvents(state);
    removeDismissStack(state.uniqueId);
    removeGlobalEvents();

    // if (mount && mountEl) {
    //   mountEl?.removeChild(containerEl!);
    //   containerEl = null;
    //   mountEl = null;
    // }
    console.log("onCleanup", props.open());
  });

  function render(children?: JSX.Element) {
    return (
      <div
        id={state.id}
        class={props.class}
        classList={props.classList || {}}
        onFocusIn={state.onFocusInContainerRef}
        onFocusOut={state.onFocusOutContainerRef}
        style={state.overlay ? `z-index: ${1000 + dismissStack.length}` : ""}
        ref={state.refContainerCb}
      >
        {/* {state.overlay && (
          <Portal>
            <div
              class={
                typeof state.overlay === "object"
                  ? state.overlay.className
                  : undefined
              }
              classList={
                typeof state.overlay === "object"
                  ? state.overlay.classList || {}
                  : {}
              }
              role="presentation"
              data-solid-dismiss-overlay-backdrop-level={dismissStack.length}
              onClick={state.onClickOverlayRef}
              ref={state.refOverlayCb}
            ></div>
          </Portal>
        )} */}
        <div
          tabindex="0"
          onFocus={(e) => {
            onFocusSentinel(state, "first", e.relatedTarget as HTMLElement);
          }}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelFirstEl}
        ></div>
        {props.children}
        <div
          tabindex={state.hasFocusSentinels ? "0" : "-1"}
          onFocus={() => onFocusSentinel(state, "last")}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelLastEl}
        ></div>
      </div>
    );
  }

  if (props.mount) return marker;

  let strictEqual = false;
  const condition = createMemo<boolean>(() => props.open(), undefined, {
    equals: (a, b) => (strictEqual ? a === b : !a === !b),
  });

  const finalRender = createMemo(() => {
    const c = condition();
    if (c) {
      console.log("inner createMemo c", c);
      const child = props.children;
      return (strictEqual = typeof child === "function" && child.length > 0)
        ? untrack(() => (child as any)(c))
        : render(child);
    }
    console.log("inner createMemo c", c);
  });

  if (props.animation) {
    return <Transition {...props.animation}>{finalRender()}</Transition>;
  }

  return finalRender;
};

type TransitionProps = {
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
  children?: JSX.Element;
  appear?: boolean;
  mode?: "inout" | "outin";
};

const Transition: Component<TransitionProps> = (props) => {
  let el: Element;
  let first = true;
  const [s1, set1] = createSignal<Element | undefined>();
  const [s2, set2] = createSignal<Element | undefined>();
  const resolved = children(() => props.children);
  const name = props.name || "s";
  props = mergeProps(
    {
      name,
      enterActiveClass: name + "-enter-active",
      enterClass: name + "-enter",
      enterToClass: name + "-enter-to",
      exitActiveClass: name + "-exit-active",
      exitClass: name + "-exit",
      exitToClass: name + "-exit-to",
    },
    props
  );
  const {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit,
  } = props;

  function enterTransition(el: Element, prev: Element | undefined) {
    if (!first || props.appear) {
      const enterClasses = props.enterClass!.split(" ");
      const enterActiveClasses = props.enterActiveClass!.split(" ");
      const enterToClasses = props.enterToClass!.split(" ");
      onBeforeEnter && onBeforeEnter(el);
      el.classList.add(...enterClasses);
      el.classList.add(...enterActiveClasses);
      requestAnimationFrame(() => {
        el.classList.remove(...enterClasses);
        el.classList.add(...enterToClasses);
        onEnter && onEnter(el, endTransition);
        if (!onEnter || onEnter.length < 2) {
          el.addEventListener("transitionend", endTransition, { once: true });
          el.addEventListener("animationend", endTransition, { once: true });
        }
      });

      function endTransition() {
        if (el) {
          el.classList.remove(...enterActiveClasses);
          el.classList.remove(...enterToClasses);
          batch(() => {
            s1() !== el && set1(el);
            s2() === el && set2(undefined);
          });
          onAfterEnter && onAfterEnter(el);
          if (props.mode === "inout") exitTransition(el, prev!);
        }
      }
    }
    prev && !props.mode ? set2(el) : set1(el);
  }

  function exitTransition(el: Element, prev: Element) {
    const exitClasses = props.exitClass!.split(" ");
    const exitActiveClasses = props.exitActiveClass!.split(" ");
    const exitToClasses = props.exitToClass!.split(" ");
    if (!prev.parentNode) return endTransition();
    onBeforeExit && onBeforeExit(prev);
    prev.classList.add(...exitClasses);
    prev.classList.add(...exitActiveClasses);
    requestAnimationFrame(() => {
      prev.classList.remove(...exitClasses);
      prev.classList.add(...exitToClasses);
    });
    onExit && onExit(prev, endTransition);
    if (!onExit || onExit.length < 2) {
      prev.addEventListener("transitionend", endTransition, { once: true });
      prev.addEventListener("animationend", endTransition, { once: true });
    }

    function endTransition() {
      prev.classList.remove(...exitActiveClasses);
      prev.classList.remove(...exitToClasses);
      s1() === prev && set1(undefined);
      onAfterExit && onAfterExit(prev);
      if (props.mode === "outin") enterTransition(el, prev);
    }
  }

  createComputed<Element>((prev) => {
    el = resolved() as Element;
    while (typeof el === "function") el = (el as Function)();
    return untrack(() => {
      if (el && el !== prev) {
        if (props.mode !== "outin") enterTransition(el, prev);
        else if (first) set1(el);
      }
      if (prev && prev !== el && props.mode !== "inout")
        exitTransition(el, prev);
      first = false;
      return el;
    });
  });
  return [s1, s2];
};

export default Dismiss;
