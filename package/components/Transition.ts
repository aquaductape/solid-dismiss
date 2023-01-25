import {
  untrack,
  Component,
  JSX,
  createComputed,
  createSignal,
  children,
  batch,
} from "solid-js";
import { TLocalState } from "../local/localState";
import { camelize } from "../utils/camelize";
import { queryElement } from "../utils/queryElement";
import { runToggleScrollbar } from "../utils/runToggleScrollbar";

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
   * Pass CSS selector, queried from root component, `"menuPopup"` uses menuPopup element, or pass JSX element.
   *
   * @defaultValue The element is the root element of the component, where CSS classes are appended to, and it is also passed to callbacks.
   */
  appendToElement?: "menuPopup" | JSX.Element;
  /**
   * Whether to apply transition on initial render.
   *
   * @defaultValue `false`
   */
  appear?: boolean;
};

function nextFrame(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

export const Transition: Component<
  DismissAnimation & {
    children: JSX.Element;
    mode?: "inout" | "outin";
    overlay?: DismissAnimation;
    state: TLocalState;
  }
> = (props) => {
  let el: Element;
  let first = true;
  let isPortal = false;
  let portalMarker!: Text;
  let isExiting = false;
  let hasOverlayAnimation = !!props.overlay;
  const [s1, set1] = createSignal<Element | undefined>();
  const [s2, set2] = createSignal<Element | undefined>();
  const resolved = children(() => props.children);

  const {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit,
    appendToElement,
    appear,
    state,
  } = props;
  const {
    onBeforeEnter: onBeforeEnterOverlay,
    onEnter: onEnterOverlay,
    onAfterEnter: onAfterEnterOverlay,
    onBeforeExit: onBeforeExitOverlay,
    onExit: onExitOverlay,
    onAfterExit: onAfterExitOverlay,
  } = props.overlay || {};

  type TAnimatedEl = "overlay" | "content";
  const createOnBeforeEnter = (type: TAnimatedEl) =>
    type === "content" ? onBeforeEnter : onBeforeEnterOverlay;
  const createOnEnter = (type: TAnimatedEl) =>
    type === "content" ? onEnter : onEnterOverlay;
  const createOnAfterEnter = (type: TAnimatedEl) =>
    type === "content" ? onAfterEnter : onAfterEnterOverlay;
  const createOnBeforeExit = (type: TAnimatedEl) =>
    type === "content" ? onBeforeExit : onBeforeExitOverlay;
  const createOnExit = (type: TAnimatedEl) =>
    type === "content" ? onExit : onExitOverlay;
  const createOnAfterExit = (type: TAnimatedEl) =>
    type === "content" ? onAfterExit : onAfterExitOverlay;

  function getClassState(
    animatedElType: TAnimatedEl,
    type:
      | "enter"
      | "enter-active"
      | "enter-to"
      | "exit"
      | "exit-active"
      | "exit-to"
  ) {
    const getName = () => {
      return animatedElType === "content" ? props.name : props.overlay?.name;
    };
    const name = getName() || "s";
    const propStr = camelize(type) + "Class";
    // @ts-ignore
    const classState = props[propStr] as string;
    return classState ? classState.split(" ") : [`${name}-${type}`];
  }

  const getElement = (type: TAnimatedEl, el: Element) => {
    if (type === "overlay") return el;
    if (appendToElement) {
      if (appendToElement === "menuPopup") {
        return queryElement(
          { containerEl: el as HTMLDivElement },
          { inputElement: null, type: "menuPopup" }
        );
      }

      return typeof appendToElement === "string"
        ? el && el.querySelector(appendToElement)!
        : (appendToElement as Element);
    }
    return el;
  };

  let endExitTransitionRef: any;
  let endExitTransitionOverlayRef: any;

  function enterTransition(
    type: TAnimatedEl,
    _el: Element,
    prev: Element | undefined
  ) {
    if (isExiting) {
      if (type === "content") {
        endExitTransitionRef();
      } else {
        endExitTransitionOverlayRef();
      }
    }
    if (!first || props.appear) {
      const onEnter = createOnEnter(type);
      const onBeforeEnter = createOnBeforeEnter(type);
      const onAfterEnter = createOnAfterEnter(type);

      const enterClasses = getClassState(type, "enter");
      const enterActiveClasses = getClassState(type, "enter-active");
      const enterToClasses = getClassState(type, "enter-to");
      const el = getElement(type, _el);

      onBeforeEnter && onBeforeEnter(el);
      el.classList.add(...enterClasses);
      el.classList.add(...enterActiveClasses);
      nextFrame(() => {
        el.classList.remove(...enterClasses);
        el.classList.add(...enterToClasses);
        onEnter && onEnter(el, () => endTransition());
        if (!onEnter || onEnter.length < 2) {
          el.addEventListener("transitionend", endTransition);
          el.addEventListener("animationend", endTransition);
        }
      });

      function endTransition(e?: Event) {
        if (el && (!e || e.target === el)) {
          el.removeEventListener("transitionend", endTransition);
          el.removeEventListener("animationend", endTransition);
          el.classList.remove(...enterActiveClasses);
          el.classList.remove(...enterToClasses);
          batch(() => {
            const el_ = isPortal ? (portalMarker as unknown as Element) : _el;
            s1() !== el_ && set1(el_);
            s2() === el_ && set2(undefined);
          });
          onAfterEnter && onAfterEnter(el);
          if (props.mode === "inout") exitTransition(type, el, prev!);
        }
      }
    }
    if (type === "content") {
      const el_ = isPortal ? (portalMarker as unknown as Element) : _el;
      prev && !props.mode ? set2(el_) : set1(el_);
    }
  }

  function exitTransition(type: TAnimatedEl, _el: Element, _prev: Element) {
    isExiting = true;
    const onExit = createOnExit(type);
    const onBeforeExit = createOnBeforeExit(type);
    const onAfterExit = createOnAfterExit(type);

    const exitClasses = getClassState(type, "exit");
    const exitActiveClasses = getClassState(type, "exit-active");
    const exitToClasses = getClassState(type, "exit-to");
    const el = getElement(type, _el);
    const prev = getElement(type, _prev);

    if (!prev.parentNode) return endTransition();
    onBeforeExit && onBeforeExit(prev);
    prev.classList.add(...exitClasses);
    prev.classList.add(...exitActiveClasses);
    nextFrame(() => {
      prev.classList.remove(...exitClasses);
      prev.classList.add(...exitToClasses);
    });
    onExit && onExit(prev, () => endTransition());
    if (!onExit || onExit.length < 2) {
      prev.addEventListener("transitionend", endTransition);
      prev.addEventListener("animationend", endTransition);
    }

    function endTransition(e?: Event) {
      if (!e || e.target === prev) {
        prev.removeEventListener("transitionend", endTransition);
        prev.removeEventListener("animationend", endTransition);
        if (type === "content") {
          prev.classList.remove(...exitActiveClasses);
          prev.classList.remove(...exitToClasses);
        }

        if (type === "content") {
          if (isPortal) {
            // @ts-ignore
            _prev.parentElement.remove();
            runToggleScrollbar(state, false);
          }

          s1() === prev && set1(undefined);
        }
        onAfterExit && onAfterExit(prev);
        if (props.mode === "outin") enterTransition(type, el, prev);
      }
    }

    if (type === "content") {
      endExitTransitionRef = endTransition;
    } else {
      endExitTransitionOverlayRef = endTransition;
    }
  }

  createComputed<Element>((prev) => {
    el = resolved() as Element;
    while (typeof el === "function") el = (el as Function)();

    if (el && el.nodeType === 3) {
      isPortal = true;
      portalMarker = el as unknown as Text;
      // @ts-ignore
      portalMarker.willRemove = false;
      // @ts-ignore
      const portalContainerChild = el["portalContainerChild"];
      if (hasOverlayAnimation) {
        // @ts-ignore
        const overlayChildren = el["portalOverlay"];
        Object.defineProperty(portalContainerChild, "portalOverlay", {
          get() {
            return overlayChildren;
          },
          configurable: true,
        });
      }
      el = portalContainerChild;
    }

    return untrack(() => {
      if (el && el !== prev) {
        if (props.mode !== "outin") {
          enterTransition("content", el, prev);
          if (hasOverlayAnimation) {
            enterTransition(
              "overlay",
              // @ts-ignore
              el.portalOverlay,
              // @ts-ignore
              prev && prev.portalOverlay
            );
          }
        } else if (first) {
          const _el = isPortal ? (portalMarker as unknown as Element) : el;
          set1(_el);
        }
      }

      if (prev && prev !== el && props.mode !== "inout") {
        exitTransition("content", el, prev);
        if (hasOverlayAnimation) {
          // @ts-ignore
          exitTransition("overlay", el && el.portalOverlay, prev.portalOverlay);
        }
      }
      first = false;
      return el;
    });
  });

  return [s1, s2];
};
