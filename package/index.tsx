import "./browserInfo";
import { isServer } from "solid-js/web";
import {
  untrack,
  Accessor,
  createEffect,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
  createMemo,
  createComputed,
  ParentComponent,
} from "solid-js";
import { hasDisplayNone, queryElement } from "./utils";
import {
  dismissStack,
  addDismissStack,
  removeDismissStack,
  TDismissStack,
} from "./global/dismissStack";
import {
  addGlobalEvents,
  globalState,
  onDocumentClick,
  removeGlobalEvents,
} from "./global/globalEvents";
import { TLocalState } from "./local/localState";
import {
  onClickDocument,
  onFocusFromOutsideAppOrTab,
  removeOutsideFocusEvents,
} from "./local/outside";
import { addMenuPopupEl, removeMenuPopupEl } from "./local/menuPopup";
import {
  getMenuButton,
  markFocusedMenuButton,
  onBlurMenuButton,
  onClickMenuButton,
  onClickOutsideMenuButton,
  onFocusMenuButton,
  onKeydownMenuButton,
  onMouseDownMenuButton,
  removeMenuButtonEvents,
} from "./local/menuButton";
import CreatePortal from "./components/CreatePortal";
import { DismissAnimation, Transition } from "./components/Transition";
import { removeLocalEvents } from "./local/manageLocalEvents";
import {
  onFocusInContainer,
  onFocusOutContainer,
  runFocusOnActive,
} from "./local/container";
import { onClickOverlay } from "./local/overlay";
import {
  activateLastFocusSentinel,
  onFocusSentinel,
} from "./local/focusSentinel";

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
   * CSS selector, queried from document, to get menu button element. Or pass JSX element
   *
   * @remark There are situations where there are multiple JSX menu buttons that open the same menu popup, but only one of them is rendered based on device width. Use signal if JSX menu buttons are conditionally rendered. Use array if all menu buttons are rendered, when all but one, are hidden via CSS `display: none;` declaration.
   */
  menuButton:
    | string
    | JSX.Element
    | Accessor<JSX.Element>
    | (string | JSX.Element)[];
  /**
   *
   * CSS selector, queried from document, to get menu popup element. Or pass JSX element
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
   * *CSS string queried from root component, or if string value is `"menuPopup"` uses menuPopup element, or if string value is `"firstChild"` uses first tabbable element inside menuPopup.
   *
   * @defaultValue focus remains on `"menuButton"`
   */
  focusElementOnOpen?:
    | "menuPopup"
    | "firstChild"
    | JSX.Element
    | (() => JSX.Element);
  /**
   *
   * Which element, via selector*, to recieve focus after popup closes.
   *
   * *CSS string queried from document, or if string value is `"menuButton"` uses menuButton element
   *
   * @remarks
   *
   * If menuPopup is mounted elsewhere in the DOM or doesn't share the same parent as menuButton, when tabbing outside menuPopup, this library programmatically grabs the correct next tabbable element after menuButton. However if that next tabbable element is inside an iframe that has different origin, then this library won't be able to grab tabbable elements inside it, instead the iframe will be focused.
   *
   *
   * @defaultValue
   *
   * When Tabbing forwards, focuses on tabbable element after menuButton. When Tabbing backwards, focuses on menuButton. When pressing Escape key, menuButton will be focused. When programmatically closed, such as clicking close button, then menuButton will be focused. When "click" outside, user-agent determines which element recieves focus, however if `Dismiss.overlay` or `Dismiss.overlayElement` are set, then menuButton will be focused instead.
   */
  focusElementOnClose?: "menuButton" | JSX.Element | FocusElementOnCloseOptions;

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
   * @defaultValue `true`
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
   * If `true`, closes menuPopup when the document "blurs". This would happen when interacting outside of the page such as Devtools, changing browser tabs, or switch different applications. Also if the page with the menuPopup, is inside an iframe, interacting outside the iframe, will close it.
   *
   * @remarks This doesn't effect overlays, if `Dimsiss.overlay` or `Dismiss.overlayElement` are set.
   *
   * @defaultValue `false`
   *
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
   *
   * Customize the removal of the scrollbar to prevent visual page "jank".
   *
   * @defaultValue `false`
   */
  onToggleScrollbar?: {
    onRemove: () => void;
    onRestore: () => void;
  };
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
   * Shorthand for `Dismiss.overlay` to `true`, `Dismiss.overlayElement` to `true`, `Dismiss.trapFocus` to `true`, `Dismiss.removeScrollbar` to `true`, and `Dismiss.mount` to `"body"`. Does not override the values of already setted properties.
   *
   * Also adds `pointer-events: none;` css declaration to menuPopup element and then `pointer-events: all;` to either element that has role="dialog" attribute or first child of menuPopup element.
   *
   * @defaultValue `false`
   */
  modal?: boolean;
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
};
// stopComponentEventPropagation?: boolean;

type FocusElementOnCloseOptions = {
  /**
   *
   * focus on element when exiting menuPopup via tabbing backwards ie "Shift + Tab".
   *
   * @defaultValue `"menuButton"`
   *
   */
  tabBackwards?: "menuButton" | JSX.Element;
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
  tabForwards?: "menuButton" | JSX.Element;
  /**
   * focus on element when exiting menuPopup via click outside popup.
   *
   * If mounted overlay present, and popup closes via click, then menuButton will be focused.
   *
   * @remarks
   *
   * When clicking, user-agent determines which element recieves focus.
   */
  click?: "menuButton" | JSX.Element;
  /**
   *
   * focus on element when exiting menuPopup via "Escape" key
   *
   * @defaultValue `"menuButton"`
   */
  escapeKey?: "menuButton" | JSX.Element;
  /**
   *
   * focus on element when exiting menuPopup via scrolling, from scrollable container that contains menuButton
   *
   * @dafaultValue `"menuButton"`
   */
  scrolling?: "menuButton" | JSX.Element;
};

export type OnOpenHandler = (
  open: boolean,
  props: {
    uniqueId: string;
    dismissStack: DismissStack[];
  }
) => void;

export type DismissStack = TDismissStack;

/**
 *
 * Handles "click outside" behavior for button popup pairings. Closing is triggered by click/focus outside of popup element or pressing "Escape" key.
 */
const Dismiss: ParentComponent<TDismiss> = (props) => {
  const modal = props.modal || false;
  // @ts-check

  const {
    id,
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
    overlay = modal,
    overlayElement = modal,
    trapFocus = modal,
    removeScrollbar = modal,
    enableLastFocusSentinel = false,
    mount = modal ? "body" : undefined,
    // stopComponentEventPropagation = false,
    show = false,
    onToggleScrollbar,
    onOpen,
  } = props;

  const state: TLocalState = {
    mount,
    addedFocusOutAppEvents: false,
    closeWhenOverlayClicked,
    closeWhenDocumentBlurs,
    closeWhenEscapeKeyIsPressed,
    closeWhenMenuButtonIsClicked,
    closeWhenMenuButtonIsTabbed,
    closeWhenScrolling,
    cursorKeys,
    focusElementOnClose,
    focusElementOnOpen,
    // @ts-ignore
    id,
    uniqueId: createUniqueId(),
    menuBtnId: "",
    focusedMenuBtn: { el: null },
    menuBtnKeyupTabFired: false,
    menuButton,
    timeouts: {
      containerFocusTimeoutId: null,
      menuButtonBlurTimeoutId: null,
    },
    upperStackRemovedByFocusOut: false,
    menuPopup,
    closeByDismissEvent: false,
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
    onClickOutsideMenuButtonRef: () => onClickOutsideMenuButton(state),
    onClickDocumentRef: (e) => onClickDocument(state, e),
    onClickOverlayRef: () => onClickOverlay(state),
    onFocusInContainerRef: (e) => onFocusInContainer(state, e),
    onFocusOutContainerRef: (e) => onFocusOutContainer(state, e),
    onBlurMenuButtonRef: (e) => onBlurMenuButton(state, e),
    onClickMenuButtonRef: (e) => onClickMenuButton(state, e),
    onMouseDownMenuButtonRef: (e) => onMouseDownMenuButton(state, e),
    onFocusFromOutsideAppOrTabRef: (e) => onFocusFromOutsideAppOrTab(state, e),
    onFocusMenuButtonRef: () => onFocusMenuButton(state),
    onKeydownMenuButtonRef: (e) => onKeydownMenuButton(state, e),
    refContainerCb: (el: HTMLElement) => {
      if (overlayElement) {
        el.style.zIndex = "1000";
        if (modal) {
          el.style.pointerEvents = "none";
          el.style.position = "relative";

          const setDialogElStyle = (el: HTMLElement) => {
            el.style.pointerEvents = "all";
          };
          requestAnimationFrame(() => {
            const dialog = el.querySelector('[role="dialog"]') as HTMLElement;
            if (!dialog) {
              const children = el.children;
              if (!children) return;
              const child = children[1];
              const dialog = child.firstElementChild as HTMLElement;
              setDialogElStyle(dialog);
              return;
            }
            setDialogElStyle(dialog);
          });
        }
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

  let marker: Text | null =
    mount && !isServer ? document.createTextNode("") : null;
  const initDefer = !props.open();

  let containerEl: HTMLElement | null;
  let mountEl: Element | Node | null;
  let endExitTransitionRef: () => void;
  let endEnterTransitionRef: () => void;
  let endExitTransitionOverlayRef: () => void;
  let endEnterTransitionOverlayRef: () => void;
  let exitRunning = false;

  function getElement(
    el: Element,
    appendToElement?: "menuPopup" | JSX.Element
  ) {
    if (overlayElement) {
      el = el.nextElementSibling!;
    }
    if (appendToElement) {
      if (appendToElement === "menuPopup") {
        return queryElement(
          { containerEl: el as HTMLDivElement },
          { inputElement: null, type: "menuPopup" }
        );
      }

      return typeof appendToElement === "string"
        ? el.querySelector(appendToElement)!
        : (appendToElement as Element);
    }

    return el;
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
      exitRunning = false;
      mountEl?.removeChild(containerEl!);
      runToggleScrollbar(false);
      globalState.closedBySetOpen = false;

      if (state.menuBtnEls && (overlay || overlayElement)) {
        if (document.activeElement === document.body) {
          const menuBtnEl = getMenuButton(state.menuBtnEls);

          menuBtnEl.focus();
        }
      }

      onAfterExit && onAfterExit(el);
      containerEl = null;
      mountEl = null;
    }
  }

  const runToggleScrollbar = (open: boolean) => {
    if (onToggleScrollbar) {
      if (open) {
        if (dismissStack.length > 1) return;
        onToggleScrollbar.onRemove();
      } else {
        if (dismissStack.length) return;
        onToggleScrollbar.onRestore();
      }
      return;
    }

    if (!removeScrollbar) return;

    if (dismissStack.length > 1) return;

    const el = document.scrollingElement as HTMLElement;

    if (open) {
      el.style.overflow = "hidden";
    } else {
      el.style.overflow = "";
    }
  };

  const resetFocusOnClose = () => {
    const activeElement = document.activeElement;

    if (activeElement !== document.body) {
      if (
        state.menuBtnEls!.every((menuBtnEl) => activeElement !== menuBtnEl) &&
        !state.containerEl?.contains(activeElement)
      ) {
        return;
      }
    }

    const { menuBtnEls, focusedMenuBtn, timeouts } = state;

    const menuBtnEl = getMenuButton(menuBtnEls!);

    const el =
      queryElement(state, {
        inputElement: focusElementOnClose,
        type: "focusElementOnClose",
        subType: "click",
      }) || menuBtnEl;

    if (el) {
      el.focus();
      if (el === menuBtnEl) {
        markFocusedMenuButton({ focusedMenuBtn, timeouts, el });
      }
    }
  };

  const programmaticRemoval = () => {
    if (globalState.closedByEvents) return;

    const activeElement = document.activeElement;

    if (
      // activeElement !== state.menuBtnEls
      state.menuBtnEls!.every((menuBtnEl) => activeElement !== menuBtnEl) &&
      !state.containerEl?.contains(activeElement)
    ) {
      setTimeout(() => {
        globalState.closedBySetOpen = false;
      });
      return;
    }

    if (!globalState.closedBySetOpen) {
      globalState.addedDocumentClick = false;
      document.removeEventListener("click", onDocumentClick);
      globalState.closedBySetOpen = true;

      setTimeout(() => {
        globalState.closedBySetOpen = false;
        resetFocusOnClose();
      });
    }
  };

  createEffect(
    on(
      () =>
        typeof props.menuButton === "function"
          ? props.menuButton()
          : props.menuButton,
      (menuButton) => {
        if (Array.isArray(menuButton) && !menuButton.length) return;

        const { focusedMenuBtn } = state;
        const menuBtnEls = queryElement(state, {
          inputElement: menuButton,
          type: "menuButton",
        }) as unknown as HTMLElement[];
        if (!menuBtnEls) return;

        state.menuBtnEls = Array.isArray(menuBtnEls)
          ? menuBtnEls
          : [menuBtnEls];

        state.menuBtnEls.forEach((menuBtnEl, _, self) => {
          if (
            focusedMenuBtn.el &&
            focusedMenuBtn.el !== menuBtnEl &&
            (self.length > 1 ? !hasDisplayNone(menuBtnEl) : true)
          ) {
            focusedMenuBtn.el = menuBtnEl;
            menuBtnEl.focus({ preventScroll: true });
            menuBtnEl!.addEventListener(
              "keydown",
              state.onKeydownMenuButtonRef
            );
          }
          menuBtnEl.setAttribute("type", "button");
          menuBtnEl.addEventListener("click", state.onClickMenuButtonRef);
          menuBtnEl.addEventListener(
            "mousedown",
            state.onMouseDownMenuButtonRef
          );

          if (
            props.open() &&
            (!state.focusElementOnOpen ||
              state.focusElementOnOpen === "menuButton" ||
              state.focusElementOnOpen === state.menuBtnEls) &&
            !hasDisplayNone(menuBtnEl)
          ) {
            menuBtnEl.addEventListener("blur", state.onBlurMenuButtonRef, {
              once: true,
            });
          }
        });

        const item = dismissStack.find(
          (item) => item.uniqueId === state.uniqueId
        );
        if (item) {
          item.menuBtnEls = state.menuBtnEls;
        }

        onCleanup(() => {
          if (!state) return;

          removeMenuButtonEvents(state, true);
        });
      }
    )
  );

  if (show && mount) {
    CreatePortal({
      mount:
        typeof mount === "string" ? document.querySelector(mount)! : mount!,
      popupChildren: render(props.children),
      overlayChildren: overlayElement ? renderOverlay() : null,
      marker,
      onCreate: (mount, container) => {
        mountEl = mount;
        containerEl = container;
      },
    });
  }

  createComputed(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;

        if (!open) {
          if (state.focusSentinelAfterEl) {
            state.focusSentinelAfterEl.tabIndex = -1;
          }
          programmaticRemoval();
        }

        if (!mount || show) return;

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
      { defer: initDefer as any }
    )
  );

  createEffect(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;

        if (open) {
          globalState.closedByEvents = false;
          addMenuPopupEl(state);
          runFocusOnActive(state);

          addGlobalEvents(closeWhenScrolling);

          addDismissStack({
            // @ts-ignore
            id,
            uniqueId: state.uniqueId,
            open: props.open,
            setOpen: props.setOpen,
            containerEl: state.containerEl!,
            menuBtnEls: state.menuBtnEls!,
            focusedMenuBtn: state.focusedMenuBtn,
            overlayEl: state.overlayEl!,
            menuPopupEl: state.menuPopupEl!,
            overlay,
            closeWhenDocumentBlurs,
            closeWhenEscapeKeyIsPressed,
            closeWhenMenuButtonIsTabbed,
            overlayElement,
            cursorKeys,
            focusElementOnClose,
            focusSentinelBeforeEl: state.focusSentinelBeforeEl,
            upperStackRemovedByFocusOut: false,
            detectIfMenuButtonObscured: false,
            queueRemoval: false,
            timeouts: state.timeouts,
          });

          onOpen && onOpen(open, { uniqueId: state.uniqueId, dismissStack });
          runToggleScrollbar(open);
          activateLastFocusSentinel(state);
        } else {
          globalState.closedByEvents = false;
          removeLocalEvents(state);

          removeOutsideFocusEvents(state);
          removeMenuPopupEl(state);
          removeDismissStack(state.uniqueId);
          removeGlobalEvents();
          onOpen && onOpen(open, { uniqueId: state.uniqueId, dismissStack });
          if (!props.animation) {
            runToggleScrollbar(open);
          }
        }
      },
      { defer: initDefer as any }
    )
  );

  onCleanup(() => {
    if (isServer) return;

    removeLocalEvents(state, { onCleanup: true });

    removeMenuPopupEl(state);
    removeOutsideFocusEvents(state);
    removeDismissStack(state.uniqueId);
    removeGlobalEvents();

    if (!show && mount && mountEl && !exitRunning) {
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
          tabindex={props.open() ? "0" : "-1"}
          onFocus={(e) => {
            onFocusSentinel(state, "before", e.relatedTarget as HTMLElement);
          }}
          style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelBeforeEl}
        ></div>
        {children}
        <div
          tabindex={props.open() && state.hasFocusSentinels ? "0" : "-1"}
          onFocus={() => {
            onFocusSentinel(state, "after");
          }}
          style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelAfterEl}
        ></div>
      </div>
    );
  }

  if (mount) return marker;
  if (show) return render(props.children);

  let strictEqual = false;
  const condition = createMemo<boolean>(() => props.open(), false, {
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
