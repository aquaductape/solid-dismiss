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
} from "./dismissStack";
import {
  mountOverlayClip,
  removeOverlayEvents,
  updateSVG,
} from "./clipOverlay";
import { addGlobalEvents, removeGlobalEvents } from "./globalEvents";
import { TDismiss } from ".";

/**
 *
 * Handles "click outside" behavior for button popup pairings. Closing is triggered by click/focus outside of popup element or pressing "Escape" key. Includes overlay clip experimental feature.
 */
type TOverlay =
  | "backdrop"
  | "clip"
  | {
      menuButton?: () => JSX.Element;
      menuPopup?: () => JSX.Element;
      /**
       * Use this to trigger redraw of "mask" that clips around menuButton and menuPopup, in case mask is not aligned correctly.
       *
       * Clip automatically redraws when cases run:
       * 1. parent scrollable container of menuButton/menuPopup is scrolled.
       * 2. viewport is resized.
       * 3. animationend/transitionend fires on menuPopup.
       * 4. menuButton/menuPopup resizes or attributes change.
       *
       * All of the above is debounced with duration of 75ms
       */
      redrawClipPath?: Accessor<number>;
      /**
       * Default: creates clipped path calculated on elements' rectangular shape and its border radius
       *
       * Use custom clipPath instead of using.
       *
       */
      /**
       * Default: `true`
       *
       * If menuButton is partially obscured by other elements (not including menuPopup) such as Header bar, the clipPath needs to acknowlege it otherwise that element could be interacted with. If the element is not a `<header>` or `<nav>`, the clipped path will not be precise on how much the menuButton is obscured.
       */
      detectIfMenuButtonObscured?: boolean;
    }
  | {};
const Dismiss: Component<Omit<TDismiss, "overlay"> & { overlay: TOverlay }> = (
  props
) => {
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
  const uniqueId = createUniqueId().replace(/\:/g, "-");
  const hasFocusSentinels =
    focusElementOnClose ||
    overlay === "backdrop" ||
    trapFocus ||
    mountedElseWhere;
  let closeBtn: HTMLElement[] = [];
  let menuPopupEl: HTMLElement | null = null;
  let menuBtnEl!: HTMLElement;
  let focusSentinelFirstEl!: HTMLDivElement;
  let focusSentinelLastEl!: HTMLDivElement;
  let containerEl!: HTMLDivElement;
  let overlayEl!: HTMLDivElement;
  let isOverlayClipped = overlay === "clipped" || typeof overlay === "object";
  let closeBtnsAdded = false;
  let menuPopupAdded = false;
  let menuBtnId = "";
  let addedFocusOutAppEvents = false;
  let menuBtnKeyupTabFired = false;
  let prevFocusedEl: HTMLElement | null = null;
  let cachedPolledElement: Element | null = null;
  let pollTimeoutId: number | null = null;
  let containerFocusTimeoutId: number | null = null;
  let menuButtonBlurTimeoutId: number | null = null;
  const initDefer = !props.open();
  // issue where it doesn't close following these steps: clicking menuPopup -> outside iframe -> open -> menuPopup -> devtools -> window.

  const refContainerCb = (el: HTMLElement) => {
    if (props.ref) {
      // @ts-ignore
      props.ref(el);
    }
    containerEl = el as any;
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

    const newTimeout = window.setTimeout(() => {
      console.log("focusout");
      props.setOpen(false);

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
            isOverlayClip: isOverlayClipped,
            overlay: typeof overlay === "object" ? "clip" : overlay,
            closeWhenDocumentBlurs,
            closeWhenEscapeKeyIsPressed,
            cursorKeys,
            focusElementOnClose,
            detectIfMenuButtonObscured:
              typeof overlay === "object"
                ? overlay.detectIfMenuButtonObscured == null
                  ? true
                  : overlay.detectIfMenuButtonObscured
                : true,
          });

          runRemoveScrollbar(open);

          if (isOverlayClipped) {
            mountOverlayClip();
          }

          activateLastFocusSentinel();
        } else {
          clearTimeout(pollTimeoutId!);
          removeOutsideFocusEvents();
          removeMenuPopupEl();
          removeCloseButtons();
          document.removeEventListener("click", onClickDocument);
          const stack = removeDismissStack(uniqueId);
          if (isOverlayClipped) {
            removeOverlayEvents(stack);
          }

          removeGlobalEvents();

          runRemoveScrollbar(open);
        }
      },
      { defer: initDefer }
    )
  );

  if (typeof overlay === "object" && overlay.redrawClippedPath) {
    createEffect(
      on(
        // @ts-ignore
        () => props.overlay.clipped.redrawClippedPath(),
        (result) => {
          if (result === null || !props.open()) return;
          console.log("run redraw");
          updateSVG(null, true);
        },
        { defer: true }
      )
    );
  }

  onCleanup(() => {
    menuBtnEl.removeEventListener("click", onClickMenuButton);
    document.removeEventListener("click", onClickDocument);
    removeCloseButtons();
    removeMenuPopupEl();

    removeOutsideFocusEvents();
    const stack = removeDismissStack(uniqueId);
    if (isOverlayClipped) {
      removeOverlayEvents(stack);
    }

    removeGlobalEvents();
    console.log("onCleanup");
  });

  return (
    <Show when={props.open()}>
      <div
        id={id}
        class={props.class}
        data-solid-dismiss-dropdown-container={uniqueId}
        classList={props.classList || {}}
        onFocusIn={onFocusInContainer}
        onFocusOut={onFocusOutContainer}
        style={
          overlay === "backdrop" ? `z-index: ${1000 + dismissStack.length}` : ""
        }
        ref={refContainerCb}
      >
        {isOverlayClipped && (
          <Portal>
            <div
              style={`position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: ${
                999 + dismissStack.length
              };`}
              data-solid-dismiss-overlay-clipped={id}
              data-solid-dismiss-overlay-clipped-level={dismissStack.length}
              onClick={onClickOverlay}
              ref={overlayEl}
            ></div>
          </Portal>
        )}
        {overlay === "backdrop" && (
          <Portal>
            <div
              role="presentation"
              data-solid-dismiss-overlay-backdrop={id}
              data-solid-dismiss-overlay-backdrop-level={dismissStack.length}
              onClick={onClickOverlay}
              style={`position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
                999 + dismissStack.length
              };`}
              ref={overlayEl}
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
          data-solid-dismiss-focus-sentinel-last={uniqueId}
          ref={focusSentinelLastEl}
        ></div>
      </div>
    </Show>
  );
};

export default Dismiss;
