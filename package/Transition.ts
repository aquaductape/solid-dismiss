import {
  untrack,
  Component,
  JSX,
  createComputed,
  createSignal,
  children,
} from "solid-js";
import { camelize } from "./utils";

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
};

export const Transition: Component<TransitionProps> = (props) => {
  let el: Element;
  let first = true;
  const [s1, set1] = createSignal<Element | undefined>();
  const resolved = children(() => props.children);

  const {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit,
  } = props;

  function getClassState(
    type:
      | "enter"
      | "enter-active"
      | "enter-to"
      | "exit"
      | "exit-active"
      | "exit-to"
  ) {
    const name = props.name || "s";
    const propStr = camelize(type) + "Class";
    // @ts-ignore
    const classState = props[propStr] as string;
    return classState ? classState : `${name}-${type}`;
  }

  function enterTransition(el: Element, prev: Element | undefined) {
    const enterClasses = getClassState("enter");
    const enterActiveClasses = getClassState("enter-active");
    const enterToClasses = getClassState("enter-to");

    onBeforeEnter && onBeforeEnter(el);

    el.classList.add(enterClasses);
    el.classList.add(enterActiveClasses);
    requestAnimationFrame(() => {
      el.classList.remove(enterClasses);
      el.classList.add(enterToClasses);
      onEnter && onEnter(el, endTransition);
      if (!onEnter || onEnter.length < 2) {
        el.addEventListener("transitionend", endTransition, { once: true });
        el.addEventListener("animationend", endTransition, { once: true });
      }
    });

    function endTransition() {
      if (el) {
        el.classList.remove(enterActiveClasses);
        el.classList.remove(enterToClasses);
        s1() !== el && set1(el);
        onAfterEnter && onAfterEnter(el);
      }
    }
    set1(el);
  }

  function exitTransition(el: Element) {
    const exitClasses = getClassState("exit");
    const exitActiveClasses = getClassState("exit-active");
    const exitToClasses = getClassState("exit-to");

    if (!el.parentNode) return endTransition();
    onBeforeExit && onBeforeExit(el);

    el.classList.add(exitClasses);
    el.classList.add(exitActiveClasses);
    requestAnimationFrame(() => {
      el.classList.remove(exitClasses);
      el.classList.add(exitToClasses);
    });
    onExit && onExit(el, endTransition);
    if (!onExit || onExit.length < 2) {
      el.addEventListener("transitionend", endTransition, { once: true });
      el.addEventListener("animationend", endTransition, { once: true });
    }

    function endTransition() {
      el.classList.remove(exitActiveClasses);
      el.classList.remove(exitToClasses);
      s1() === el && set1(undefined);
      onAfterExit && onAfterExit(el);
    }
  }

  createComputed<Element>((prev) => {
    el = resolved() as Element;
    while (typeof el === "function") el = (el as Function)();
    return untrack(() => {
      if (el && el !== prev) {
        enterTransition(el, prev);
      }
      if (prev && prev !== el) exitTransition(prev!);
      first = false;
      return el;
    });
  });
  return [s1];
};
