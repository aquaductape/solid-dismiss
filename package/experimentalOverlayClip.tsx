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
import { queryElement } from "./utils";
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
import { TLocalState } from "./localState";
import {
  onClickDocument,
  onFocusFromOutsideAppOrTab,
  removeOutsideFocusEvents,
} from "./outside";
import { onClickOverlay } from "./overlay";
import {
  onFocusInContainer,
  onFocusOutContainer,
  runFocusOnActive,
} from "./container";
import {
  onBlurMenuButton,
  onClickMenuButton,
  onFocusMenuButton,
  onKeydownMenuButton,
  runAriaExpanded,
} from "./menuButton";
import {
  addCloseButtons,
  onClickCloseButtons,
  removeCloseButtons,
} from "./closeButtons";
import { addMenuPopupEl, removeMenuPopupEl } from "./menuPopup";
import { activateLastFocusSentinel, onFocusSentinel } from "./focusSentinel";

/**
 * Default: `false`
 *
 * If `true` or `"backdrop": Adds root level div that acts as a layer. This removes interaction of the page elements that's underneath the overlay element, that way menuPopup is the only element that can be interacted with. Author must ensure that menuPopup is placed above overlay element, one of the ways, is to nest this Component inside Solid's {@link https://www.solidjs.com/docs/latest/api#%3Cportal%3E Portal}.
 *
 * If `clip` or `"backdrop"`: Serves the same goal as `"backdrop"`, to prevent interaction of page elements except for menuPopup. The two differences are that the user can interact with menuButton, so hover effects will show ect, and menuPopup doesn't need to be mounted at the root in the DOM. This is possible because an overlay mask clips around menuButton and menuPopup. However menuButton and menuPopup must be rectangular shaped.
 */
type TOverlay =
  | "backdrop"
  | "clip"
  | {
      type: "clip";
      className?: string;
      classList?: { [key: string]: boolean };
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
      ref?: (el: HTMLElement) => void;
    }
  | {
      type: "backdrop";
      className?: string;
      classList?: { [key: string]: boolean };
      ref?: (el: HTMLElement) => void;
    };

/**
 *
 * Handles "click outside" behavior for button popup pairings. Closing is triggered by click/focus outside of popup element or pressing "Escape" key. Includes overlay clip experimental feature.
 */
const Dismiss: Component<Omit<TDismiss, "overlay"> & { overlay?: TOverlay }> = (
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
    closeWhenOverlayClicked: closeWhenClickedOutside = true,
    closeWhenEscapeKeyIsPressed = true,
    overlay = false,
    trapFocus = false,
    removeScrollbar = false,
    useAriaExpanded = false,
    enableLastFocusSentinel: mountedElseWhere = false,
    onOpen,
  } = props;
  const state: TLocalState = {
    addedFocusOutAppEvents: false,
    children,
    closeBtns: [],
    closeBtnsAdded: false,
    closeButtons,
    closeWhenOverlayClicked: closeWhenClickedOutside,
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
    menuPopup,
    menuPopupAdded: false,
    enableLastFocusSentinel: mountedElseWhere,
    // @ts-ignore
    overlay,
    removeScrollbar,
    trapFocus,
    useAriaExpanded,
    hasFocusSentinels:
      !!focusElementOnClose || !!overlay || trapFocus || mountedElseWhere,
    open: props.open,
    setOpen: props.setOpen,
    setFocus: props.setFocus,
    onClickDocumentRef: (e) => onClickDocument(state, e),
    onClickOverlayRef: () => onClickOverlay(state),
    onFocusInContainerRef: () => onFocusInContainer(state),
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
        if (overlay.type === "clip") {
          el.style.pointerEvents = "none";
        }
        overlay.ref(el);
      }

      state.overlayEl = el as any;
    },
  };

  const initDefer = !props.open();
  const isOverlayClip =
    overlay === "clip"
      ? true
      : typeof overlay === "object"
      ? overlay.type === "clip"
      : false;

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
    state.menuBtnEl.setAttribute("type", "button");
    state.menuBtnEl.addEventListener("click", state.onClickMenuButtonRef);
    state.menuBtnEl.addEventListener("focus", state.onFocusMenuButtonRef);
    state.menuBtnId = state.menuBtnEl.id;

    runAriaExpanded(state, props.open());

    if (!state.menuBtnId) {
      state.menuBtnId = id || state.uniqueId;
      state.menuBtnEl.id = state.menuBtnId;
    }
  });

  if (
    typeof overlay === "object" &&
    // @ts-ignore
    overlay.redrawClippedPath
  ) {
    if ("redrawClippedPath" in overlay) {
      overlay;
    }
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

  createEffect(
    on(
      () => !!props.open(),
      (open, prevOpen) => {
        if (open === prevOpen) return;

        runAriaExpanded(state, open);

        if (open) {
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
            overlay:
              typeof overlay === "string"
                ? overlay
                : typeof overlay === "boolean"
                ? overlay
                : overlay.type,
            closeWhenDocumentBlurs,
            closeWhenEscapeKeyIsPressed,
            cursorKeys,
            focusElementOnClose,
            detectIfMenuButtonObscured: false,
          });
          if (isOverlayClip) {
            mountOverlayClip();
          }

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
    const stack = removeDismissStack(state.uniqueId);
    if (isOverlayClip) {
      removeOverlayEvents(stack);
    }
    removeGlobalEvents();
    console.log("onCleanup");
  });

  return (
    <Show when={props.open()}>
      <div
        id={state.id}
        class={props.class}
        classList={props.classList || {}}
        onFocusIn={state.onFocusInContainerRef}
        onFocusOut={state.onFocusOutContainerRef}
        style={state.overlay ? `z-index: ${1000 + dismissStack.length}` : ""}
        ref={state.refContainerCb}
      >
        {state.overlay && (
          <Portal>
            <div
              class={
                typeof state.overlay === "object"
                  ? state.overlay.class
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
        )}

        {isOverlayClip && (
          <Portal>
            <div
              class={
                typeof state.overlay === "object"
                  ? state.overlay.class
                  : undefined
              }
              classList={
                typeof state.overlay === "object"
                  ? state.overlay.classList || {}
                  : {}
              }
              role="presentation"
              data-solid-dismiss-overlay-clipped-level={dismissStack.length}
              onClick={state.onClickOverlayRef}
              ref={state.refContainerCb}
            ></div>
          </Portal>
        )}
        <div
          tabindex="0"
          onFocus={(e) => {
            onFocusSentinel(state, "first", e.relatedTarget as HTMLElement);
          }}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelFirstEl}
        ></div>
        {state.children}
        <div
          tabindex={state.hasFocusSentinels ? "0" : "-1"}
          onFocus={() => onFocusSentinel(state, "last")}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          ref={state.focusSentinelLastEl}
        ></div>
      </div>
    </Show>
  );
};

export default Dismiss;
