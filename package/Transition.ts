import {
  untrack,
  Component,
  JSX,
  createComputed,
  createSignal,
  children,
} from "solid-js";
import { DismissAnimation, TDismiss } from ".";
import { camelize } from "./utils";

export const Transition: Component<
  DismissAnimation & { children: JSX.Element }
> = (props) => {
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
    appendToElement,
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

  const getElement = (el: Element) => {
    if (appendToElement) {
      return typeof appendToElement === "string"
        ? el.querySelector(appendToElement)!
        : (appendToElement as Element);
    }
    return el;
  };

  function enterTransition(_el: Element, prev: Element | undefined) {
    const enterClasses = getClassState("enter");
    const enterActiveClasses = getClassState("enter-active");
    const enterToClasses = getClassState("enter-to");
    const el = getElement(_el);

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
        s1() !== _el && set1(_el);
        onAfterEnter && onAfterEnter(el);
      }
    }
    set1(_el);
  }

  function exitTransition(_el: Element) {
    const exitClasses = getClassState("exit");
    const exitActiveClasses = getClassState("exit-active");
    const exitToClasses = getClassState("exit-to");
    const el = getElement(_el);

    if (!_el.parentNode) return endTransition();
    onBeforeExit && onBeforeExit(_el);

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
      s1() === _el && set1(undefined);
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
      if (prev && prev !== el) exitTransition(prev);
      first = false;
      return el;
    });
  });
  return [s1];
};
