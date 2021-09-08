import "./browserInfo";
import {
  Show,
  Accessor,
  onMount,
  createEffect,
  createSignal,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
} from "solid-js";
import { Portal } from "solid-js/web";
import {
  focusableSelectors,
  getNextFocusableElement,
  inverseQuerySelector,
  parseValToNum,
} from "./utils";
import {
  dismissStack,
  addDismissStack,
  removeDismissStack,
} from "./dismissStack";
import {
  mountOverlayClipped,
  removeOverlayEvents,
  updateSVG,
} from "./clippedOverlay";

// Safari iOS notes
// buttons can't receive focus on tap, only through invoking `focus()` method
// blur (tested so far on only buttons) will fire even on tapping same focused button (which would be invoked `focus()` )
// For Nested Dropdowns. Since button has to be refocused, when nested button(1) is tapped, it also triggers focusout container(1) for some reason

/**
 *
 * Handles "click outside" behavior for button dropdown pairings. Closing is triggered by click/focus outside of dropdown element or pressing "Escape" key.
 */
const Dismiss: Component<{
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
   * Default: root component element queries the second child element
   * css selector, queried from document, to get menu dropdown element. Or pass JSX element
   */
  menuDropdown?: string | JSX.Element | (() => JSX.Element);
  /**
   * Default: `undefined`
   *
   * `string` is css selector
   * css selector, queried from container element, to get close button element(s). Or pass JSX element(s)
   */
  closeButton?:
    | string
    | JSX.Element
    | (string | JSX.Element)[]
    | (() => JSX.Element)
    | (() => (string | JSX.Element)[]);
  /**
   * Default: `false`
   *
   * Have the behavior to move through a list of "dropdown items" using cursor keys.
   */
  cursorKeys?: boolean;
  /**
   * Default: `false`
   *
   * Focus will remain inside menuDropdown when pressing Tab key
   */
  trapFocus?: boolean;
  /**
   * Default: focus remains on `"menuButton"`
   *
   * which element, via selector*, to recieve focus after dropdown opens.
   *
   * *selector: css string queried from document, or if string value is `"menuDropdown"` uses menuDropdown element.
   */
  focusOnActive?: "menuDropdown" | string | JSX.Element | (() => JSX.Element);
  /**
   * Default: When Tabbing forwards, focuses on focusable element after menuButton. When Tabbing backwards, focuses on menuButton. When pressing Escape key, menuButton will be focused. When "click", if overlay present, then menuButton will be focused, otherwise user-agent determines which element recieves focus.
   *
   * Which element, via selector*, to recieve focus after dropdown closes.
   *
   * *selector: css string queried from document, or if string value is `"menuButton"` uses menuButton element
   *
   * An example would be to emulate native <select> element behavior, set which sets focus to menuButton after dismiss.
   *
   * Note: When clicking, user-agent determines which element recieves focus, to prevent this, use `overlay` prop.
   *
   */
  focusOnLeave?:
    | "menuButton"
    | string
    | JSX.Element
    | {
        /**
         * focus on element when exiting menuDropdown via tabbing backwards ie "Shift + Tab".
         */
        tabBackwards?: "menuButton" | string | JSX.Element;
        /**
         * focus on element when exiting menuDropdown via tabbing forwards ie "Tab".
         */
        tabForwards?: "menuButton" | string | JSX.Element;
        /**
         * focus on element when exiting menuDropdown via click outside dropdown.
         *
         * If overlay present, and dropdown closes via click, then menuButton will be focused.
         *
         * Note: When clicking, user-agent determines which element recieves focus, to prevent this, use `overlay` prop.
         */
        click?: "menuButton" | string | JSX.Element;
        /**
         * focus on element when exiting menuDropdown via "Escape" key
         */
        escapeKey?: "menuButton" | string | JSX.Element;
        /**
         * focus on element when exiting menuDropdown via scrolling, from scrollable container that contains menuButton
         */
        scrolling?: "menuButton" | string | JSX.Element;
      };
  /**
   * Default: `false`
   *
   * When `true`, after focusing within menu dropdown, if focused back to menu button via keyboard (Tab key), the menu dropdown will close.
   *
   */
  closeWhenMenuButtonIsTabbed?: boolean;
  /**
   * Default: `true`
   *
   * If `overlay` is `"block"`, dropdown will always close when menu button is clicked
   */
  closeWhenMenuButtonIsClicked?: boolean;
  /**
   * Default: `false`
   *
   * Closes menuDropdown when a scrollable container that contains menuButton is scrolled
   */
  closeWhenScrolling?: boolean;
  /**
   * Default `"none"`
   *
   * When prop is `"block"`, adds root level div that acts as overlay. This removes interaction of the page elements that's underneath the overlay element. Make sure that dropdown lives in the root level, one way is to nest this Component inside Solid's {@link https://www.solidjs.com/docs/latest/api#%3Cportal%3E Portal}.
   *
   * When prop is `"clipped"`, it's similar to `"block"` where it places an element at root document, but creates a "mask"* that clips around the menuButton and menuDropdown. This allows menuDropdown to live anywhere in the document, rather than forced to mounting it at top level of root document in order to be interacted with.
   *
   * Note the "mask" is accurate if the menuButton and menuDropdown are rectangular shaped, border radius is also accounted for.
   */
  overlay?:
    | "block"
    | "clipped"
    | {
        clipped: {
          menuButton?: () => JSX.Element;
          menuDropdown?: () => JSX.Element;
          /**
           * Use this to trigger redraw of "mask" that clips around menuButton and menuDropdown, in case mask is not aligned correctly.
           *
           * Clip automatically redraws when cases run:
           * 1. parent scrollable container of menuButton/menuDropdown is scrolled.
           * 2. viewport is resized.
           * 3. animationend/transitionend fires on [data-solid-dismiss-dropdown-container] and menuDropdown.
           * 4. menuButton/menuDropdown resizes or attributes change.
           *
           * All of the above is debounced with duration of 75ms
           */
          redrawClippedPath?: Accessor<number>;
          /**
           * Default: creates clipped path calculated on elements' rectangular shape and its border radius
           *
           * Use custom clipPath instead of using.
           *
           */
          /**
           * Default: `true`
           *
           * If menuButton is partially obscured by other elements (not including menuDropdown) such as Header bar, the clipPath needs to acknowlege it otherwise that element could be interacted with. If the element is not a `<header>` or `<nav>`, the clipped path will not be precise on how much the menuButton is obscured.
           */
          detectIfMenuButtonObscured?: boolean;
        };
      };
  toggle: Accessor<boolean>;
  setToggle: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
}> = (props) => {
  const {
    id,
    menuButton,
    menuDropdown,
    focusOnLeave,
    focusOnActive,
    closeButton,
    children,
    cursorKeys = false,
    closeWhenMenuButtonIsTabbed = false,
    closeWhenMenuButtonIsClicked = true,
    closeWhenScrolling = false,
    overlay = false,
    trapFocus = false,
  } = props;
  const uniqueId = createUniqueId();
  const hasFocusSentinels = focusOnLeave || overlay === "block" || trapFocus;
  let closeBtn: HTMLElement[] = [];
  let menuDropdownEl: HTMLElement | null = null;
  let menuBtnEl!: HTMLElement;
  let focusSentinelFirstEl!: HTMLDivElement;
  let focusSentinelLastEl!: HTMLDivElement;
  let containerEl!: HTMLDivElement;
  let overlayEl!: HTMLDivElement;
  let isOverlayClipped = overlay === "clipped" || typeof overlay === "object";
  let closeBtnsAdded = false;
  let menuDropdownAdded = false;
  let menuBtnId = "";
  let addedFocusOutAppEvents = false;
  let menuBtnKeyupTabFired = false;
  let prevFocusedEl: HTMLElement | null = null;
  let nextFocusTargetAfterMenuButton: HTMLElement | null = null;
  const refCb = (el: HTMLElement) => {
    if (props.ref) {
      // @ts-ignore
      props.ref(el);
    }
    containerEl = el as any;
  };

  let containerFocusTimeoutId: number | null = null;
  let menuButtonBlurTimeoutId: number | null = null;
  const initDefer = !props.toggle();
  let init = false;

  const runFocusOnActive = () => {
    if (focusOnActive == null) return;

    const el = queryElement(focusOnActive);
    if (el) {
      el.focus();
    }
  };

  const expandToggle = (toggle: boolean) => {
    menuBtnEl.setAttribute("aria-expanded", `${toggle}`);
  };

  const onCursorKeys = (e: KeyboardEvent) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
    const horizontalKeys = ["ArrowLeft", "ArrowRight"];

    if (!keys.includes(e.key)) return;

    e.preventDefault();

    if (horizontalKeys.includes(e.key)) return;

    const activeElement = document.activeElement!;

    if (activeElement === menuBtnEl || activeElement === menuDropdownEl) {
      const el =
        e.key === "ArrowDown"
          ? (menuDropdownEl?.querySelector(focusableSelectors) as HTMLElement)
          : inverseQuerySelector(menuDropdownEl!, focusableSelectors);

      if (el) {
        el.focus();
      }
      return;
    }

    const direction: "forwards" | "backwards" =
      e.key === "ArrowDown" ? "forwards" : "backwards";

    const el = getNextFocusableElement({
      from: activeElement,
      direction,
      stopAtElement: menuDropdownEl!,
    });

    if (el) {
      el.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (cursorKeys) {
      onCursorKeys(e);
    }

    if (e.key !== "Escape") return;
    const item = dismissStack[dismissStack.length - 1];

    if (!item) return;

    const el =
      queryElement(focusOnLeave, "focusOnLeave", "escapeKey") || item.menuBtnEl;

    if (el) {
      el.focus();
    }

    item.setToggle(false);
  };

  const onScrollClose = (e: Event) => {
    const target = e.target as HTMLElement;

    if (target.contains(menuBtnEl)) {
      props.setToggle(false);
    }

    const el =
      queryElement(focusOnLeave, "focusOnLeave", "scrolling") || menuBtnEl;

    if (el) {
      el.focus();
    }
  };

  const onClickOverlay = () => {
    const el = queryElement(focusOnLeave, "focusOnLeave", "click") || menuBtnEl;

    if (el) {
      el.focus();
    }

    props.setToggle(false);
  };

  const onClickCloseButton = () => {
    props.setToggle(false);
  };

  const onClickMenuButton = () => {
    clearTimeout(containerFocusTimeoutId!);
    clearTimeout(menuButtonBlurTimeoutId!);
    menuBtnEl.focus();
    containerFocusTimeoutId = null;

    const toggleVal = props.toggle();
    if (!closeWhenMenuButtonIsClicked) {
      props.setToggle(true);
      return;
    }

    props.setToggle(!toggleVal);
  };

  const onBlurMenuButton = (e: FocusEvent) => {
    if (!props.toggle()) return;

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
      props.setToggle(false);
    };

    menuButtonBlurTimeoutId = window.setTimeout(run);
  };

  const onKeydownMenuButton = (e: KeyboardEvent) => {
    if (!props.toggle()) return;
    if (e.key === "Tab" && e.shiftKey) {
      props.setToggle(false);
      menuBtnKeyupTabFired = true;
      menuBtnEl.removeEventListener("keydown", onKeydownMenuButton);
      menuBtnEl.removeEventListener("blur", onBlurMenuButton);
      return;
    }
    if (e.key !== "Tab") return;
    menuBtnKeyupTabFired = true;
    e.preventDefault();
    const el = getNextFocusableElement({ from: focusSentinelFirstEl });
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
    props.setToggle(false);
    addedFocusOutAppEvents = false;
  };

  const onFocusFromOutsideAppOrTab = (e: FocusEvent) => {
    if (containerEl.contains(e.target as HTMLElement)) return;

    props.setToggle(false);
    prevFocusedEl = null;
    addedFocusOutAppEvents = false;
    document.removeEventListener("click", onClickDocument);
  };

  const removeOutsideFocusEvents = () => {
    if (!prevFocusedEl) return;
    prevFocusedEl.removeEventListener("focus", onFocusFromOutsideAppOrTab);
    document.removeEventListener("click", onClickDocument);
    prevFocusedEl = null;
  };

  const onFocusOutContainer = (e: FocusEvent) => {
    console.log("runfocusout!!!");
    if (focusOnLeave || overlay === "block") {
      e.stopImmediatePropagation();
    }

    if (!props.toggle()) return;

    if (!e.relatedTarget) {
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

    const newTimeout = window.setTimeout(() => {
      console.log("focusout");
      props.setToggle(false);

      if (props.setFocus) {
        props.setFocus(false);
      }
    });
    containerFocusTimeoutId = newTimeout;
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
      const el = getNextFocusableElement({
        from: focusSentinelFirstEl,
      })!;

      el.focus();
      return;
    }

    if (type === "first") {
      if (trapFocus) {
        const el = getNextFocusableElement({
          from: focusSentinelLastEl,
          direction: "backwards",
        })!;

        el.focus();
        return;
      }

      if (closeWhenMenuButtonIsTabbed) {
        props.setToggle(false);
        menuBtnEl.focus();
        return;
      }

      const el =
        queryElement(focusOnLeave, "focusOnLeave", "tabBackwards") || menuBtnEl;

      if (el) {
        el.focus();
      }

      if (el !== menuBtnEl) {
        props.setToggle(false);
      }

      return;
    }

    if (trapFocus) {
      const el = getNextFocusableElement({
        from: focusSentinelFirstEl,
      })!;

      el.focus();
      return;
    }

    const el =
      queryElement(focusOnLeave, "focusOnLeave", "tabForwards") ||
      getNextFocusableElement({
        from: menuBtnEl,
        ignoreElement: [containerEl],
      });

    if (el) {
      el.focus();
    }

    props.setToggle(false);
  };

  const queryElement = (
    inputElement: any,
    type?: "menuButton" | "menuDropdown" | "closeButton" | "focusOnLeave",
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
    if (inputElement === "menuDropdown") {
      return menuDropdownEl!;
    }
    if (inputElement == null && type === "menuDropdown") {
      if (!containerEl) return null as any;
      return menuDropdownEl || containerEl;
    }
    if (typeof inputElement === "string" && type === "menuButton") {
      if (!containerEl) return null as any;
      return containerEl.querySelector(inputElement) as HTMLElement;
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

    if (type === "focusOnLeave") {
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
    if (!closeButton) return;
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

    if (Array.isArray(closeButton)) {
      closeButton.forEach((item) => {
        getCloseButton(item);
      });
      return;
    }

    if (typeof closeButton === "function") {
      const result = closeButton();

      if (Array.isArray(result)) {
        result.forEach((item) => {
          getCloseButton(item);
        });
        return;
      }

      getCloseButton(result);
      return;
    }

    getCloseButton(closeButton);
  };

  const removeCloseButtons = () => {
    if (!closeButton) return;
    if (!closeBtnsAdded) return;

    closeBtnsAdded = false;
    closeBtn.forEach((el) => {
      el.removeEventListener("click", onClickCloseButton);
    });
    closeBtn = [];
  };

  const addMenuDropdownEl = () => {
    if (menuDropdownAdded) return;

    menuDropdownEl = queryElement(menuDropdown, "menuDropdown");
    if (menuDropdownEl) {
      menuDropdownAdded = true;
      if (!menuDropdownEl.getAttribute("aria-labelledby")) {
        menuDropdownEl.setAttribute("aria-labelledby", menuBtnId);
      }
    }
  };

  const removeMenuDropdownEl = () => {
    if (!menuDropdownEl) return;
    if (!menuDropdownAdded) return;
    menuDropdownEl = null;
    menuDropdownAdded = false;
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
    menuBtnEl.addEventListener("click", onClickMenuButton);
    menuBtnEl.addEventListener("focus", onFocusMenuButton);
    menuBtnId = menuBtnEl.id;
    expandToggle(props.toggle());
    if (!menuBtnId) {
      menuBtnId = createUniqueId();
      menuBtnEl.id = menuBtnId;
    }
  });

  createEffect(
    on(
      () => !!props.toggle(),
      (toggle, prevToggle) => {
        if (toggle === prevToggle) return;

        if (closeWhenScrolling) {
          window.addEventListener("scroll", onScrollClose, {
            once: true,
            capture: true,
          });
        }

        expandToggle(toggle);

        if (toggle) {
          addCloseButtons();
          addMenuDropdownEl();
          runFocusOnActive();
          if (!addedKeydownListener) {
            addedKeydownListener = true;
            document.addEventListener("keydown", onKeyDown);
          }

          addDismissStack({
            id: uniqueId,
            toggle: props.toggle,
            setToggle: props.setToggle,
            containerEl,
            menuBtnEl,
            overlayEl,
            menuDropdownEl: menuDropdownEl!,
            isOverlayClipped,
            overlay: typeof overlay === "object" ? "clipped" : overlay,
            detectIfMenuButtonObscured:
              typeof overlay === "object"
                ? overlay.clipped.detectIfMenuButtonObscured == null
                  ? true
                  : overlay.clipped.detectIfMenuButtonObscured
                : true,
          });

          if (isOverlayClipped) {
            mountOverlayClipped();
          }
        } else {
          removeOutsideFocusEvents();
          removeMenuDropdownEl();
          removeCloseButtons();
          document.removeEventListener("click", onClickDocument);
          const stack = removeDismissStack(uniqueId);
          console.log("on false");
          if (isOverlayClipped) {
            removeOverlayEvents(stack);
          }
          if (dismissStack.length < 1) {
            addedKeydownListener = false;
            document.removeEventListener("keydown", onKeyDown);
          }
        }
      },
      { defer: initDefer }
    )
  );

  if (typeof overlay === "object" && overlay.clipped.redrawClippedPath) {
    createEffect(
      on(
        // @ts-ignore
        () => props.overlay.clipped.redrawClippedPath(),
        (result) => {
          if (result === null || !props.toggle()) return;
          console.log("run redraw");
          updateSVG(null, true);
        },
        { defer: true }
      )
    );
  }

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
    menuBtnEl.removeEventListener("click", onClickMenuButton);
    removeCloseButtons();
    removeMenuDropdownEl();

    removeOutsideFocusEvents();
    const stack = removeDismissStack(uniqueId);
    if (isOverlayClipped) {
      removeOverlayEvents(stack);
    }
    console.log("onCleanup");
  });

  return (
    <Show when={props.toggle()}>
      <div
        id={id}
        class={props.class}
        data-solid-dismiss-dropdown-container={props.id || ""}
        classList={props.classList || {}}
        onFocusIn={onFocusInContainer}
        onFocusOut={onFocusOutContainer}
        tabindex="-1"
        style={
          overlay === "block" ? `z-index: ${1000 + dismissStack.length}` : ""
        }
        ref={refCb}
      >
        {isOverlayClipped && (
          <Portal>
            <div
              style={`position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: ${
                999 + dismissStack.length
              };`}
              solid-dismiss-overlay-clipped={props.id || ""}
              solid-dismiss-overlay-clipped-level={dismissStack.length}
              onClick={onClickOverlay}
              ref={overlayEl}
            ></div>
          </Portal>
        )}
        {overlay === "block" && (
          <Portal>
            <div
              solid-dismiss-overlay={props.id || ""}
              solid-dismiss-overlay-level={dismissStack.length}
              onClick={onClickOverlay}
              style={`position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
                999 + dismissStack.length
              };`}
              ref={overlayEl}
            ></div>
          </Portal>
        )}
        {hasFocusSentinels && (
          <div
            tabindex="0"
            onFocus={(e) => {
              onFocusSentinel("first", e.relatedTarget as HTMLElement);
            }}
            style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
            aria-hidden="true"
            ref={focusSentinelFirstEl}
          ></div>
        )}
        {children}
        {hasFocusSentinels && (
          <div
            tabindex="0"
            onFocus={() => onFocusSentinel("last")}
            style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
            aria-hidden="true"
            ref={focusSentinelLastEl}
          ></div>
        )}
      </div>
    </Show>
  );
};

let addedKeydownListener = false;

export default Dismiss;
