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
import { getNextFocusableElement, parseValToNum } from "./utils";

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
  menuButton: string | JSX.Element;
  /**
   * Default: root component element queries the second child element
   * css selector, queried from document, to get menu dropdown element. Or pass JSX element
   */
  menuDropdown?: string | JSX.Element | { [key: string]: JSX.Element };
  /**
   * Default: `undefined`
   *
   * `string` is css selector
   * css selector, queried from container element, to get close button element(s). Or pass JSX element(s)
   */
  closeButton?:
    | string
    | JSX.Element
    | { [key: string]: string | JSX.Element }
    | (string | JSX.Element)[];
  focusTrap?: boolean;
  /**
   * Default: focus remains on `menuButton`
   *
   * which element, via selector*, to recieve focus after dropdown opens.
   *
   * *selector: css string queried from document, or if string value is `"menuDropdown"` uses menuDropdown element (which is the second child of root component element ). If object, will only grab first value
   */
  focusOnActive?:
    | "menuDropdown"
    | string
    | JSX.Element
    | { [key: string]: JSX.Element };
  /**
   * Default: uses browser default behavior when focusing to next element.
   *
   * which element, via selector*, to recieve focus after dropdown closes.
   *
   * *selector: css string queried from document, or if string value is `"menuButton"` uses menuButton element
   *
   * An example would be to emulate native <select> element behavior, set which sets focus to menu button after dismiss.
   *
   *
   * Note: This won't prevent clicks on other elements that could potentially steal focus. To prevent this, use `overlay` prop.
   */
  focusOnLeave?: "menuButton" | string | JSX.Element; // ???
  /**
   * Default: `false`
   *
   * When `true`, after focusing within menu dropdown, if focused back to menu button via keyboard (Tab key), the menu dropdown will close.
   *
   * If `overlay` is `"block"`, dropdown will always close when menu button is Tabbed
   */
  closeWhenMenuButtonIsTabbed?: boolean;
  /**
   * Default: `true`
   *
   * If `overlay` is `true`, dropdown will always close when menu button is clicked
   */
  closeWhenMenuButtonIsClicked?: boolean;
  /**
   * Default `"none"`
   *
   * When prop is `true`, adds root level div that acts as overlay. This removes interaction of the page elements that's underneath the overlay element. Make sure that dropdown lives in the root level and has z-index value in order to be interacted.
   *
   * When prop is `"shallow"`, adds css declaration "pointer-events: none" to the `<html>` element. This removes interaction of the page elements, similar to that of an overlay element. The difference is that the dropdown doesn't need to be mounted to different level of the DOM in order to be interacted. NOT RECOMMENDED: any element, that's not part of the dropdown markup, if it has css property "pointer-events" with the value of "all", it can be interacted.
   *
   * Main difference of `true` vs `shallow`, is that the menu button can still be interacted with the cursor, which means that css hover events will fire ect.
   *
   * When prop is `"clipped"`, it's similar to `"block"` where it places an element at root document, but creates a "mask" that clips around the menuButton and menuDropdown. This allows menuDropdown to live at menuButton markup context, rather than mounting it at top level of root document in order to be interacted with.
   */
  overlay?:
    | "block"
    | "shallow"
    | "clipped"
    | {
        clipped: {
          menuButton?: TOverlayClipped;
          menuDropdown?: TOverlayClipped;
          /**
           * Use this to manually redraw the "mask" that clips around menuButton and menuDropdown, in case mask is not aligned correctly.
           * Clip automatically redraws when scrolled, or viewport is resized, or animationend end fires on [data-solid-dismiss-dropdown-container] and menuDropdown
           */
          redrawClippedPath?: number;
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
    closeWhenMenuButtonIsTabbed = false,
    closeWhenMenuButtonIsClicked = true,
    overlay = false,
  } = props;
  let closeBtn: HTMLElement[] = [];
  let menuDropdownEl: HTMLElement | null = null;
  let menuBtnEl!: HTMLElement;
  let focusTrapEl1!: HTMLDivElement;
  let focusTrapEl2!: HTMLDivElement;
  let containerEl!: HTMLDivElement;
  let overlayEl!: HTMLDivElement;
  let closeBtnsAdded = false;
  let menuDropdownAdded = false;
  let menuBtnId = "";
  let addedFocusOutAppEvents = false;
  let menuBtnKeyupTabFired = false;
  let prevFocusedEl: HTMLElement | null = null;
  let nextFocusTargetAfterMenuButton: HTMLElement | null = null;
  let clippedOverlayId = "";
  let resizeObserver: ResizeObserver | null = null;
  const viewport = { height: 0, width: 0 };
  const refCb = (el: HTMLElement) => {
    if (props.ref) {
      // @ts-ignore
      props.ref(el);
    }
    containerEl = el as any;
  };

  let containerFocusTimeoutId: number | null = null;
  let menuButtonBlurTimeoutId: number | null = null;
  let updateOverlayTimeoutId: number | null = null;
  const initDefer = !props.toggle();
  let init = false;

  const runFocusOnLeave = () => {
    if (focusOnLeave == null) return;

    const el = queryElement(focusOnLeave);
    if (el) {
      el.focus();
    }
  };

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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    // menuBtnEl.focus();
    // props.setToggle(false);
    const item = dismissStack.pop();
    if (item) {
      item.menuBtnEl.focus();
      item.setToggle(false);
    }

    if (dismissStack.length < 1) {
      addedKeydownListener = false;
      document.removeEventListener("keydown", onKeyDown);
    }
  };

  const onClickOverlay = () => {
    // runDelegateFocus();
    props.setToggle(false);
  };

  const onClickCloseButton = () => {
    // runDelegateFocus();
    props.setToggle(false);
  };

  const onClickMenuButton = () => {
    clearTimeout(containerFocusTimeoutId!);
    clearTimeout(menuButtonBlurTimeoutId!);
    menuBtnEl.focus();
    containerFocusTimeoutId = null;

    const toggleVal = props.toggle();
    // updateStore(
    //   `onClickBtn ${menuBtnId}`,
    //   `toggle ${!toggleVal}, ${Date.now()}`
    // );
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
      // if (addedFocusOutAppEvents) return;
      // addedFocusOutAppEvents = true;
      // prevFocusedEl = e.target as HTMLElement;
      // console.log("adddocuclick");
      if (overlay !== "clipped") {
        document.addEventListener("click", onClickDocument, { once: true });
      }
      return;
    }

    removeOutsideFocusEvents();
    if (containerEl.contains(e.relatedTarget as HTMLElement)) return;
    // updateStore(
    //   `setToggle from onBlurMenuButton  ${menuBtnId}`,
    //   `toggle ${props.toggle()}, ${Date.now()}`
    // );
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
    const el = getNextFocusableElement({ activeElement: focusTrapEl1 });
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
    // updateStore(
    //   `setToggle from onClickDocument ${menuBtnId}`,
    //   `toggle ${props.toggle()}, ${Date.now()}`
    // );
    props.setToggle(false);
    addedFocusOutAppEvents = false;
  };

  const onFocusFromOutsideAppOrTab = (e: FocusEvent) => {
    if (containerEl.contains(e.target as HTMLElement)) return;

    // updateStore(
    //   `setToggle from onFocusFromOutsideAppOrTab  ${menuBtnId}`,
    //   `toggle ${props.toggle()}, ${Date.now()}`
    // );
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
    // updateStore(
    //   `setToggle from onFocusOutContainer ${menuBtnId}`,
    //   `toggle ${props.toggle()}, ${Date.now()}, addedFocusOutAppEvents ${addedFocusOutAppEvents}`
    // );

    if (!props.toggle()) return;

    if (!e.relatedTarget) {
      if (addedFocusOutAppEvents) return;
      addedFocusOutAppEvents = true;
      prevFocusedEl = e.target as HTMLElement;
      if (overlay !== "clipped") {
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

    // updateStore(
    //   `setToggle from onFocusInContainer ${menuBtnId}`,
    //   `toggle ${props.toggle()}, ${Date.now()}`
    // );

    if (props.setFocus) {
      props.setFocus(true);
    }
  };

  const setTabIndexOfFocusTraps = (tabindex: "0" | "-1") => {
    if (!focusOnLeave) return;
    if (typeof menuButton === "string" || menuButton == null) {
      menuBtnEl = containerEl.querySelector(
        menuButton ? menuButton : "button"
      )!;
    } else {
      menuBtnEl = menuButton as HTMLElement;
    }
    if (focusTrapEl1) {
      focusTrapEl1.setAttribute("tabindex", tabindex);
    }
    if (focusTrapEl2) {
      focusTrapEl2.setAttribute("tabindex", tabindex);
    }
  };

  const onFocusTraps = (type: "first" | "last") => {
    clearTimeout(containerFocusTimeoutId!);
    if (type === "first") {
      if (closeWhenMenuButtonIsTabbed) {
        props.setToggle(false);
      }
      if (!focusOnLeave) {
        menuBtnEl.focus();
      } else {
        const el = queryElement(focusOnLeave);
        if (el) {
          el.focus();
        }
        props.setToggle(false);
      }
      return;
    }
    const el = getNextFocusableElement({
      activeElement: menuBtnEl,
      stopAtElement: containerEl,
    });
    if (el) {
      el.focus();
    }
    props.setToggle(false);
    // runDelegateFocus();
    // setTabIndexOfFocusTraps("-1");
  };

  const queryElement = (
    inputElement: any,
    type?: "menuButton" | "menuDropdown" | "closeButton"
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

    for (const key in inputElement as { [key: string]: HTMLElement }) {
      const item = (inputElement as { [key: string]: HTMLElement })[key];
      return item;
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

    if (!(typeof closeButton === "object")) {
      getCloseButton(closeButton as any);
    }

    for (const key in closeButton as { [key: string]: HTMLElement }) {
      const item = (closeButton as { [key: string]: HTMLElement })[key];
      getCloseButton(item);
    }
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

  /** Overlay Clipped **/

  const createClippedPoints = () => {
    const createPath = (el: HTMLElement) => {
      const parseRadius = (radiusInput: string) => {
        const maxXRadius = bcr.width;
        const maxYRadius = bcr.height;
        let splitRadiusStr = radiusInput.split(" ");
        if (splitRadiusStr.length === 1) {
          splitRadiusStr.push(splitRadiusStr[0]);
        }

        const radii = splitRadiusStr.map((radius, idx) => {
          const isPercent = (radius as string).match("%");
          const isX = idx === 0;
          let value = parseValToNum(radius);

          if (isPercent) {
            if (isX) {
              value = (value / 100) * bcr.width;
            } else {
              value = (value / 100) * bcr.height;
            }
          }

          if (isX && value > maxXRadius) {
            value = maxXRadius;
          }

          if (!isX && value > maxYRadius) {
            value = maxYRadius;
          }

          return value;
        });

        return { x: radii[0], y: radii[1] };
      };

      const bcr = el.getBoundingClientRect();
      bcr.x = Math.floor(bcr.x);
      bcr.y = Math.floor(bcr.y);
      bcr.width = Math.floor(bcr.width);
      bcr.height = Math.floor(bcr.height);
      const style = window.getComputedStyle(el);
      const bTopLeftRadius = parseRadius(style.borderTopLeftRadius);
      const bTopRightRadius = parseRadius(style.borderTopRightRadius);
      const bBottomRightRadius = parseRadius(style.borderBottomRightRadius);
      const bBottomLeftRadius = parseRadius(style.borderBottomLeftRadius);
      const topRightArc = bTopRightRadius
        ? `a ${bTopRightRadius.x} ${bTopRightRadius.y} 0 0 1 ${bTopRightRadius.x} ${bTopRightRadius.y}`
        : "";
      const bottomRightArc = bBottomRightRadius
        ? `a ${bBottomRightRadius.x} ${
            bBottomRightRadius.y
          } 0 0 1 ${-bBottomRightRadius.x} ${bBottomRightRadius.y}`
        : "";
      const bottomLeftArc = bBottomLeftRadius
        ? `a ${bBottomLeftRadius.x} ${
            bBottomLeftRadius.y
          } 0 0 1 ${-bBottomLeftRadius.x} ${-bBottomLeftRadius.y}`
        : "";
      const topLeftArc = bTopLeftRadius
        ? `a ${bTopLeftRadius.x} ${bTopLeftRadius.y} 0 0 1 ${
            bTopLeftRadius.x
          } ${-bTopLeftRadius.y}`
        : "";

      return `M ${bcr.x + bTopLeftRadius.x}, ${bcr.y} h ${
        bcr.width - bTopRightRadius.x - bTopLeftRadius.x
      } ${topRightArc} v ${
        bcr.height - bBottomRightRadius.y - bTopRightRadius.y
      } ${bottomRightArc} h ${
        -bcr.width + bBottomLeftRadius.x + bBottomRightRadius.x
      } ${bottomLeftArc} v ${
        -bcr.height + bTopLeftRadius.y + bBottomLeftRadius.y
      } ${topLeftArc} z `;
    };

    return `M 0,0 H ${viewport.width} V ${viewport.height} H 0 Z ${createPath(
      menuBtnEl
    )} ${createPath(menuDropdownEl!)}`;
  };

  const createClippedPath = () => {
    if (!clippedOverlayId) {
      clippedOverlayId = createUniqueId();
    }
    return (
      <path
        fill-rule="evenodd"
        d={createClippedPoints()}
        style="pointer-events: all;"
      />
    ) as SVGPathElement;
  };

  const updateSVG = () => {
    if (!overlayEl || !menuDropdownEl || !containerEl) return;
    const svgEl = overlayEl.firstElementChild!;
    const pathEl = svgEl.querySelector("path")!;
    viewport.height = document.documentElement.clientHeight;
    viewport.width = document.documentElement.clientWidth;

    svgEl.setAttribute("viewBox", `0 0 ${viewport.width} ${viewport.height}`);
    pathEl.setAttribute("d", createClippedPoints());
  };

  const updateOverlay = (e?: Event) => {
    window.clearTimeout(updateOverlayTimeoutId!);

    updateOverlayTimeoutId = window.setTimeout(() => {
      if (!props.toggle) return;
      if (e?.type === "scroll") {
        const target = e.target as HTMLElement;
        if (!target.contains(menuBtnEl)) return;
      }

      if (e?.type === "transitionend" || e?.type === "animationend") {
        const target = e.target as HTMLElement;
        if (containerEl !== target || menuDropdownEl !== target) return;
      }

      updateSVG();
    }, 50);
  };

  const addOverlayEvents = () => {
    window.addEventListener("scroll", updateOverlay, {
      capture: true,
      passive: true,
    });
    addResizeEvent();
    containerEl.addEventListener("transitionend", updateOverlay);
    containerEl.addEventListener("animationend", updateOverlay);
  };

  const removeOverlayEvents = () => {
    window.removeEventListener("scroll", updateOverlay, { capture: true });

    removeResizeEvent();
  };

  const addResizeEvent = () => {
    if ("ResizeObserver" in window) {
      let init = true;
      resizeObserver = new ResizeObserver(() => {
        if (init) {
          init = false;
          return;
        }
        updateOverlay();
      });
      resizeObserver.observe(document.body);
    } else {
      window.addEventListener("resize", updateOverlay, { passive: true });
    }
  };

  const removeResizeEvent = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    } else {
      window.removeEventListener("resize", updateOverlay);
    }
  };

  const mountOverlay = () => {
    const style =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; pointer-events:none;";

    viewport.height = document.documentElement.clientHeight;
    viewport.width = document.documentElement.clientWidth;
    menuDropdownEl = queryElement(menuDropdown, "menuDropdown");

    addOverlayEvents();

    const child = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMaxYMax slice"
        version="1.1"
      >
        {createClippedPath()}
      </svg>
    );
    overlayEl.style.cssText = style;
    overlayEl.appendChild(child as HTMLElement);
  };

  const manageDismissStack = (type: "add" | "remove") => {
    if (type === "add") {
      const prevStack = dismissStack[dismissStack.length - 1];

      if (prevStack && prevStack.overlayEl) {
        const path = prevStack.overlayEl!.querySelector(
          "path"
        ) as SVGPathElement;
        path.style.pointerEvents = "none";
        path.style.fill = "transparent";
      }

      dismissStack.push({
        setToggle: props.setToggle,
        menuBtnEl,
        overlayEl,
        containerEl,
      });
    }

    if (type === "remove") {
      const prevStack = dismissStack[dismissStack.length - 2];

      if (prevStack && prevStack.overlayEl) {
        const path = prevStack.overlayEl!.querySelector(
          "path"
        ) as SVGPathElement;
        path.style.pointerEvents = "all";
        path.style.fill = "";
      }
      dismissStack.pop();
    }
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

    // addCloseButtons();
    // addMenuDropdownEl();
  });

  createEffect(
    on(
      props.toggle,
      (toggle) => {
        if (overlay === "shallow") {
          if (toggle) {
            menuBtnEl.style.pointerEvents = "all";
            document.documentElement.style.pointerEvents = "none";
            containerEl.style.pointerEvents = "all";
          } else {
            menuBtnEl.style.pointerEvents = "";
            if (dismissStack.length <= 1) {
              document.documentElement.style.pointerEvents = "";
            }
            containerEl.style.pointerEvents = "";
          }
        }
        runFocusOnLeave();

        expandToggle(toggle);

        if (toggle) {
          addCloseButtons();
          addMenuDropdownEl();
          runFocusOnActive();
          if (!addedKeydownListener) {
            addedKeydownListener = true;
            document.addEventListener("keydown", onKeyDown);
          }

          if (overlay === "clipped" || typeof overlay === "object") {
            mountOverlay();
          }
          manageDismissStack("add");
          // setTabIndexOfFocusTraps("0");
        } else {
          removeOutsideFocusEvents();
          removeMenuDropdownEl();
          removeCloseButtons();
          // setTabIndexOfFocusTraps("-1");
          removeOverlayEvents();
          document.removeEventListener("click", onClickDocument);
          manageDismissStack("remove");
          if (dismissStack.length < 1) {
            addedKeydownListener = false;
            document.removeEventListener("keydown", onKeyDown);
          }
        }
      },
      { defer: initDefer }
    )
  );

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
    menuBtnEl.removeEventListener("click", onClickMenuButton);
    removeCloseButtons();
    removeMenuDropdownEl();

    removeOutsideFocusEvents();
    removeOverlayEvents();
    // removeKeyFromStore(`onClickBtn ${menuBtnId}`);
    // removeKeyFromStore(`setToggle from onClickDocument ${menuBtnId}`);
    // removeKeyFromStore(`setToggle from onFocusInContainer ${menuBtnId}`);
  });

  //   if(props.mount) {
  //     return <Portal >
  //
  //     </Portal>
  //   }

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
        style={overlay === "block" ? "z-index: 1000" : ""}
        ref={refCb}
      >
        {(overlay === "clipped" || typeof overlay === "object") && (
          <Portal>
            <div
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
              onClick={onClickOverlay}
              ref={overlayEl}
            ></div>
          </Portal>
        )}
        {overlay === "shallow" && (
          <div
            style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: none; z-index: -1;"
            onClick={onClickOverlay}
            ref={overlayEl}
          ></div>
        )}
        <div
          tabindex="0"
          onFocus={(e) => {
            // if (
            //   e.relatedTarget === menuBtnEl &&
            //   e.relatedTarget === containerEl
            // )
            //   return;
            onFocusTraps("first");
          }}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={focusTrapEl1}
        ></div>
        {children}
        {(focusOnLeave || overlay === "block") && (
          <div
            tabindex="0"
            onFocus={() => onFocusTraps("last")}
            style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
            aria-hidden="true"
            ref={focusTrapEl2}
          ></div>
        )}
      </div>
    </Show>
  );
};

type TOverlayClipped = {
  /**
   * pass element that overlay needs to be clipped with.
   *
   */
  el?: JSX.Element;
  /**
   * Default: will grap element radius from computing its style
   *
   */
  radius?: number;
  /**
   * Use custom clipPath instead of using generated one.
   */
  clipPath?: string;
};

let addedKeydownListener = false;
const dismissStack: {
  setToggle: (v: boolean) => void;
  menuBtnEl: HTMLElement;
  containerEl: HTMLElement;
  overlayEl?: HTMLDivElement;
}[] = [];

export default Dismiss;
