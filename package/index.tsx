import "./browserInfo";
import {
  Show,
  Accessor,
  onMount,
  createEffect,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
} from "solid-js";
import { Portal } from "solid-js/web";
import { getNextTabbableElement, matchByFirstChild } from "./utils";
import {
  dismissStack,
  addDismissStack,
  removeDismissStack,
  TDismissStack,
} from "./dismissStack";
import { addGlobalEvents, removeGlobalEvents } from "./globalEvents";

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
  removeScrollbar?:
    | boolean
    | ((open: boolean, dismissStack: DismissStack[]) => void);
  /**
   * Default `false`
   *
   * When `true`, adds root level div that acts as a layer. This removes interaction of the page elements that's underneath the overlay element. Make sure that menuPopup lives in the root level, one of the ways, is to nest this Component inside Solid's {@link https://www.solidjs.com/docs/latest/api#%3Cportal%3E Portal}.
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
  open: Accessor<boolean>;
  setOpen: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
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
    children,
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
  } = props;
  const uniqueId = createUniqueId();
  const hasFocusSentinels =
    focusElementOnClose || overlay || trapFocus || mountedElseWhere;
  let closeBtn: HTMLElement[] = [];
  let menuPopupEl: HTMLElement | null = null;
  let menuBtnEl!: HTMLElement;
  let focusSentinelFirstEl!: HTMLDivElement;
  let focusSentinelLastEl!: HTMLDivElement;
  let containerEl!: HTMLDivElement;
  let overlayEl!: HTMLDivElement;
  let closeBtnsAdded = false;
  let menuPopupAdded = false;
  let menuBtnId = "";
  let addedFocusOutAppEvents = false;
  let menuBtnKeyupTabFired = false;
  let prevFocusedEl: HTMLElement | null = null;
  let containerFocusTimeoutId: number | null = null;
  let menuButtonBlurTimeoutId: number | null = null;
  const initDefer = !props.open();

  const refContainerCb = (el: HTMLElement) => {
    if (props.ref) {
      // @ts-ignore
      props.ref(el);
    }
    containerEl = el as any;
  };

  const refOverlayCb = (el: HTMLElement) => {
    if (typeof overlay === "object" && overlay.ref) {
      overlay.ref(el);
    }

    overlayEl = el as any;
  };

  const activateLastFocusSentinel = () => {
    if (mountedElseWhere) return;

    const menuBtnSibling = menuBtnEl.nextElementSibling!;

    if (
      matchByFirstChild({
        parent: menuBtnSibling,
        matchEl: containerEl,
      })
    )
      return;

    focusSentinelLastEl.setAttribute("tabindex", "0");
  };

  const runFocusOnActive = () => {
    if (focusElementOnOpen == null) return;

    const el = queryElement(focusElementOnOpen);
    if (el) {
      el.focus();
    }
  };

  const runAriaExpanded = (open: boolean) => {
    if (!useAriaExpanded) return;
    menuBtnEl.setAttribute("aria-expanded", `${open}`);
  };

  const onClickOverlay = () => {
    console.log({ closeWhenClickedOutside });
    if (!closeWhenClickedOutside) {
      menuPopupEl!.focus();
      return;
    }

    const el =
      queryElement(focusElementOnClose, "focusElementOnClose", "click") ||
      menuBtnEl;

    if (el) {
      el.focus();
    }

    props.setOpen(false);
  };

  const onClickCloseButton = () => {
    props.setOpen(false);
  };

  const onClickMenuButton = () => {
    clearTimeout(containerFocusTimeoutId!);
    clearTimeout(menuButtonBlurTimeoutId!);
    menuBtnEl.focus();
    containerFocusTimeoutId = null;

    if (!closeWhenMenuButtonIsClicked) {
      props.setOpen(true);
      return;
    }

    props.setOpen(!props.open());
  };

  const onBlurMenuButton = (e: FocusEvent) => {
    if (!props.open()) return;

    if (menuBtnKeyupTabFired) {
      menuBtnKeyupTabFired = false;
      return;
    }

    if (!e.relatedTarget) {
      if (!overlay) {
        document.addEventListener("click", onClickDocument, { once: true });
      }
      return;
    }

    removeOutsideFocusEvents();
    if (containerEl.contains(e.relatedTarget as HTMLElement)) return;
    const run = () => {
      props.setOpen(false);
    };

    menuButtonBlurTimeoutId = window.setTimeout(run);
  };

  const onKeydownMenuButton = (e: KeyboardEvent) => {
    if (!props.open()) return;
    if (e.key === "Tab" && e.shiftKey) {
      props.setOpen(false);
      menuBtnKeyupTabFired = true;
      menuBtnEl.removeEventListener("keydown", onKeydownMenuButton);
      menuBtnEl.removeEventListener("blur", onBlurMenuButton);
      return;
    }
    if (e.key !== "Tab") return;
    menuBtnKeyupTabFired = true;
    e.preventDefault();
    const el = getNextTabbableElement({ from: focusSentinelFirstEl });
    if (el) {
      el.focus();
    } else {
      containerEl.focus();
    }
    menuBtnEl.removeEventListener("keydown", onKeydownMenuButton);
    menuBtnEl.removeEventListener("blur", onBlurMenuButton);
  };

  const onClickDocument = (e: MouseEvent) => {
    if (containerEl.contains(e.target as HTMLElement)) return;

    if (prevFocusedEl) {
      prevFocusedEl.removeEventListener("focus", onFocusFromOutsideAppOrTab);
    }
    prevFocusedEl = null;
    props.setOpen(false);
    addedFocusOutAppEvents = false;
  };

  const onFocusFromOutsideAppOrTab = (e: FocusEvent) => {
    if (containerEl.contains(e.target as HTMLElement)) return;

    props.setOpen(false);
    prevFocusedEl = null;
    addedFocusOutAppEvents = false;
    document.removeEventListener("click", onClickDocument);
  };

  const removeOutsideFocusEvents = () => {
    if (!prevFocusedEl) return;
    console.log("removeOutsideFocusEvents");
    prevFocusedEl.removeEventListener("focus", onFocusFromOutsideAppOrTab);
    document.removeEventListener("click", onClickDocument);
    prevFocusedEl = null;
  };

  const onFocusOutContainer = (e: FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (overlay) return;

    if (!props.open()) return;

    if (!relatedTarget) {
      if (addedFocusOutAppEvents) return;
      addedFocusOutAppEvents = true;
      prevFocusedEl = e.target as HTMLElement;
      if (!overlay) {
        document.addEventListener("click", onClickDocument);
      }
      prevFocusedEl.addEventListener("focus", onFocusFromOutsideAppOrTab, {
        once: true,
      });
      return;
    }

    containerFocusTimeoutId = window.setTimeout(() => {
      console.log("focusout");
      props.setOpen(false);

      if (props.setFocus) {
        props.setFocus(false);
      }
    });
  };

  const onFocusInContainer = () => {
    console.log("focusin");
    clearTimeout(containerFocusTimeoutId!);
    containerFocusTimeoutId = null;

    if (props.setFocus) {
      props.setFocus(true);
    }
  };

  const onFocusSentinel = (
    type: "first" | "last",
    relatedTarget?: HTMLElement
  ) => {
    clearTimeout(containerFocusTimeoutId!);

    if (relatedTarget === containerEl || relatedTarget === menuBtnEl) {
      const el = getNextTabbableElement({
        from: focusSentinelFirstEl,
      })!;

      el.focus();
      return;
    }

    if (type === "first") {
      if (trapFocus) {
        const el = getNextTabbableElement({
          from: focusSentinelLastEl,
          direction: "backwards",
        })!;

        el.focus();
        return;
      }

      if (closeWhenMenuButtonIsTabbed) {
        props.setOpen(false);
        menuBtnEl.focus();
        return;
      }

      const el =
        queryElement(
          focusElementOnClose,
          "focusElementOnClose",
          "tabBackwards"
        ) || menuBtnEl;

      if (el) {
        el.focus();
      }

      if (el !== menuBtnEl) {
        props.setOpen(false);
      }

      return;
    }

    if (trapFocus) {
      const el = getNextTabbableElement({
        from: focusSentinelFirstEl,
      })!;

      el.focus();
      return;
    }

    const el =
      queryElement(focusElementOnClose, "focusElementOnClose", "tabForwards") ||
      getNextTabbableElement({
        from: menuBtnEl,
        ignoreElement: [containerEl],
      });

    if (el) {
      el.focus();
    }

    props.setOpen(false);
  };

  const queryElement = (
    inputElement: any,
    type?: "menuButton" | "menuPopup" | "closeButton" | "focusElementOnClose",
    subType?:
      | "tabForwards"
      | "tabBackwards"
      | "click"
      | "escapeKey"
      | "scrolling"
  ): HTMLElement => {
    if (inputElement === "menuButton") {
      return menuBtnEl;
    }
    if (inputElement === "menuPopup") {
      return menuPopupEl!;
    }
    if (inputElement == null && type === "menuPopup") {
      if (!containerEl) return null as any;
      if (menuPopupEl) return menuPopupEl;
      return containerEl.children[1] as HTMLElement;
    }
    if (typeof inputElement === "string" && type === "menuButton") {
      return document.querySelector(inputElement) as HTMLElement;
    }
    if (typeof inputElement === "string" && type === "closeButton") {
      if (!containerEl) return null as any;
      return containerEl.querySelector(inputElement) as HTMLElement;
    }
    if (typeof inputElement === "string") {
      return document.querySelector(inputElement) as HTMLElement;
    }
    if (inputElement instanceof Element) {
      return inputElement as HTMLElement;
    }

    if (typeof inputElement === "function") {
      const result = inputElement();
      if (result instanceof Element) {
        return result as HTMLElement;
      }
      if (type === "closeButton") {
        if (!containerEl) return null as any;
        return containerEl.querySelector(result) as HTMLElement;
      }
    }

    if (type === "focusElementOnClose") {
      if (!inputElement) return null as any;

      switch (subType) {
        case "tabForwards":
          return queryElement(inputElement.tabForwards);
        case "tabBackwards":
          return queryElement(inputElement.tabBackwards);
        case "click":
          return queryElement(inputElement.click);
        case "escapeKey":
          return queryElement(inputElement.escapeKey);
        case "scrolling":
          return queryElement(inputElement.scrolling);
      }
    }

    if (inputElement == null) return null as any;

    for (const key in inputElement as { [key: string]: any }) {
      const item = (inputElement as { [key: string]: any })[key];
      return queryElement(item);
    }

    return null as any;
  };

  const addCloseButtons = () => {
    if (!closeButtons) return;
    if (closeBtnsAdded) return;

    const getCloseButton = (closeButton: string | JSX.Element) => {
      if (closeButton == null) return;

      const el = queryElement(closeButton, "closeButton");
      console.log({ el });

      if (!el) return;
      closeBtnsAdded = true;

      el.addEventListener("click", onClickCloseButton);
      closeBtn?.push(el);
    };

    if (Array.isArray(closeButtons)) {
      closeButtons.forEach((item) => {
        getCloseButton(item);
      });
      return;
    }

    if (typeof closeButtons === "function") {
      const result = closeButtons();

      if (Array.isArray(result)) {
        result.forEach((item) => {
          getCloseButton(item);
        });
        return;
      }

      getCloseButton(result);
      return;
    }

    getCloseButton(closeButtons);
  };

  const removeCloseButtons = () => {
    if (!closeButtons) return;
    if (!closeBtnsAdded) return;

    closeBtnsAdded = false;
    closeBtn.forEach((el) => {
      el.removeEventListener("click", onClickCloseButton);
    });
    closeBtn = [];
  };

  const addMenuPopupEl = () => {
    if (menuPopupAdded) return;

    menuPopupEl = queryElement(menuPopup, "menuPopup");
    if (menuPopupEl) {
      menuPopupAdded = true;

      menuPopupEl.setAttribute("tabindex", "-1");

      if (!useAriaExpanded) return;

      if (!menuPopupEl.getAttribute("aria-labelledby")) {
        menuPopupEl.setAttribute("aria-labelledby", menuBtnId);
      }
    }
  };

  const removeMenuPopupEl = () => {
    if (!menuPopupEl) return;
    if (!menuPopupAdded) return;
    menuPopupEl = null;
    menuPopupAdded = false;
  };

  const runRemoveScrollbar = (open: boolean) => {
    if (!removeScrollbar) return;

    if (typeof removeScrollbar === "function") {
      removeScrollbar(open, dismissStack);
      return;
    }

    if (dismissStack.length > 1) return;

    if (open) {
      const el = document.scrollingElement as HTMLElement;
      el.style.overflow = "hidden";
    } else {
      const el = document.scrollingElement as HTMLElement;
      el.style.overflow = "";
    }
  };

  const onFocusMenuButton = () => {
    if (!closeWhenMenuButtonIsTabbed) {
      console.log("clear!!");
      clearTimeout(containerFocusTimeoutId!);
    }
    menuBtnEl.addEventListener("keydown", onKeydownMenuButton);
    menuBtnEl.addEventListener("blur", onBlurMenuButton);
  };

  onMount(() => {
    menuBtnEl = queryElement(menuButton, "menuButton");
    menuBtnEl.setAttribute("type", "button");
    menuBtnEl.addEventListener("click", onClickMenuButton);
    menuBtnEl.addEventListener("focus", onFocusMenuButton);
    menuBtnId = menuBtnEl.id;

    runAriaExpanded(props.open());

    if (!menuBtnId) {
      menuBtnId = id || uniqueId;
      menuBtnEl.id = menuBtnId;
    }
  });

  createEffect(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;

        runAriaExpanded(open);

        if (open) {
          addCloseButtons();
          addMenuPopupEl();
          runFocusOnActive();

          addGlobalEvents(closeWhenScrolling);

          addDismissStack({
            id,
            uniqueId,
            open: props.open,
            setOpen: props.setOpen,
            containerEl,
            menuBtnEl,
            overlayEl,
            menuPopupEl: menuPopupEl!,
            isOverlayClip: false,
            overlay: !!overlay,
            closeWhenDocumentBlurs,
            closeWhenEscapeKeyIsPressed,
            cursorKeys,
            focusElementOnClose,
            detectIfMenuButtonObscured: false,
          });

          runRemoveScrollbar(open);

          activateLastFocusSentinel();
        } else {
          document.removeEventListener("click", onClickDocument);

          removeOutsideFocusEvents();
          removeMenuPopupEl();
          removeCloseButtons();
          removeDismissStack(uniqueId);
          removeGlobalEvents();
          runRemoveScrollbar(open);
        }
      },
      { defer: initDefer }
    )
  );

  onCleanup(() => {
    menuBtnEl.removeEventListener("click", onClickMenuButton);
    document.removeEventListener("click", onClickDocument);

    removeCloseButtons();
    removeMenuPopupEl();
    removeOutsideFocusEvents();
    removeDismissStack(uniqueId);
    removeGlobalEvents();
    console.log("onCleanup");
  });

  return (
    <Show when={props.open()}>
      <div
        id={id}
        class={props.class}
        classList={props.classList || {}}
        onFocusIn={onFocusInContainer}
        onFocusOut={onFocusOutContainer}
        style={overlay ? `z-index: ${1000 + dismissStack.length}` : ""}
        ref={refContainerCb}
      >
        {overlay && (
          <Portal>
            <div
              class={
                typeof overlay === "object" ? overlay.className : undefined
              }
              classList={
                typeof overlay === "object" ? overlay.classList || {} : {}
              }
              role="presentation"
              data-solid-dismiss-overlay-backdrop-level={dismissStack.length}
              onClick={onClickOverlay}
              style={`position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
                999 + dismissStack.length
              };`}
              ref={refOverlayCb}
            ></div>
          </Portal>
        )}
        <div
          tabindex="0"
          onFocus={(e) => {
            onFocusSentinel("first", e.relatedTarget as HTMLElement);
          }}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={focusSentinelFirstEl}
        ></div>
        {children}
        <div
          tabindex={hasFocusSentinels ? "0" : "-1"}
          onFocus={() => onFocusSentinel("last")}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={focusSentinelLastEl}
        ></div>
      </div>
    </Show>
  );
};

export default Dismiss;
