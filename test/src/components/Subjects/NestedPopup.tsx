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
  Show,
  createComputed,
  createSignal,
  children,
  mergeProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import Dismiss from "../../../../package/index";
import Button from "../Button/Button";

type TTree = {
  [key: number]: {
    childIds: number[];
  };
};

const NestedPopup = () => {
  return (
    <section class="nested">
      <h2>Nested menuPopup</h2>
      <p>No overlay, page is interactable</p>
      <p>
        menuPopups are adjecent sibling to menuButton, this means stacks are
        also direct children
      </p>
      <p>
        Since there is no overlay, and there's a stack of menuPops opened,
        wherever the click/focus target is, it checks through the
        stack(iterating backwards). If the target is contained withined
        menuPopup item, then any stack "above" it that did not contain it, will
        be dismissed.
      </p>

      <Demo></Demo>
    </section>
  );
};

const Demo = () => {
  const [stack, setStack] = createStore<TTree>({
    "0": { childIds: [] },
    "1": { childIds: [] },
    "2": { childIds: [] },
  });

  return (
    <div class="grid">
      <Popup />
      <Popup />
      <Popup />
    </div>
  );
};

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;

  createEffect(() => {
    if (!open()) return;

    containerEl.style.padding = "10px";
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button open={open()} onClick={() => setOpen(true)} ref={btnEl} />
      <TransitionP>
        <Show when={open()}>
          <Dismiss
            menuButton={btnEl}
            open={open}
            setOpen={setOpen}
            ref={containerEl}
          >
            <div class="dropdown">
              <Popup />
              <br />
              <Popup />
              <br />
              <Popup />
            </div>
          </Dismiss>
        </Show>
      </TransitionP>
    </div>
  );
};

const TransitionP: Component = (props) => {
  return (
    <Transition
      onEnter={(el, done) => {
        (el as HTMLElement).style.transformOrigin = "top right";
        const a = el.animate(
          [
            { transform: "scale(0)", opacity: 0 },
            { transform: "scale(0.5)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ],
          {
            duration: 300,
          }
        );

        a.finished.then(done);
      }}
      onExit={(el, done) => {
        (el as HTMLElement).style.transformOrigin = "top right";
        const a = el.animate(
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(0.5)", opacity: 0 },
            { transform: "scale(0)", opacity: 0 },
          ],
          {
            duration: 300,
          }
        );
        a.finished.then(done);
      }}
    >
      {props.children}
    </Transition>
  );
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
export default NestedPopup;
