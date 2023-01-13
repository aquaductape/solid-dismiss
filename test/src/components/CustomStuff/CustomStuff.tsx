import {
  children,
  Component,
  createMemo,
  createRoot,
  createSignal,
  onCleanup,
  onMount,
  sharedConfig,
  untrack,
  JSX,
  batch,
  createComputed,
  Show,
  createEffect,
} from "solid-js";
import { insert, Portal } from "solid-js/web";
import { Transition } from "solid-transition-group";

function nextFrame(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

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

const CustomTransition: Component<TransitionProps> = (props) => {
  let el: Element;
  let first = true;
  let isPortal = false;
  let portalMarker!: Text;
  let isExiting = false;
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
  } = props;

  const classnames = createMemo(() => {
    const name = props.name || "s";
    return {
      enterActiveClass: props.enterActiveClass || name + "-enter-active",
      enterClass: props.enterClass || name + "-enter",
      enterToClass: props.enterToClass || name + "-enter-to",
      exitActiveClass: props.exitActiveClass || name + "-exit-active",
      exitClass: props.exitClass || name + "-exit",
      exitToClass: props.exitToClass || name + "-exit-to",
    };
  });

  let endExitTransitionRef: any;

  function enterTransition(el: Element, prev: Element | undefined) {
    if (isExiting) {
      endExitTransitionRef();
    }
    if (!first || props.appear) {
      const enterClasses = classnames().enterClass!.split(" ");
      const enterActiveClasses = classnames().enterActiveClass!.split(" ");
      const enterToClasses = classnames().enterToClass!.split(" ");
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
            const _el = isPortal ? (portalMarker as unknown as Element) : el;
            s1() !== _el && set1(_el);
            s2() === _el && set2(undefined);
          });
          onAfterEnter && onAfterEnter(el);
          if (props.mode === "inout") exitTransition(el, prev!);
        }
      }
    }
    const _el = isPortal ? (portalMarker as unknown as Element) : el;
    prev && !props.mode ? set2(_el) : set1(_el);
  }

  function exitTransition(el: Element, prev: Element) {
    isExiting = true;
    const exitClasses = classnames().exitClass!.split(" ");
    const exitActiveClasses = classnames().exitActiveClass!.split(" ");
    const exitToClasses = classnames().exitToClass!.split(" ");
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
        prev.classList.remove(...exitActiveClasses);
        prev.classList.remove(...exitToClasses);

        if (isPortal) {
          // @ts-ignore
          prev.parentElement.remove();
        }

        s1() === prev && set1(undefined);
        onAfterExit && onAfterExit(prev);
        if (props.mode === "outin") enterTransition(el, prev);
      }
    }

    endExitTransitionRef = endTransition;
  }

  createComputed<Element>((prev) => {
    console.log("fire init");
    el = resolved() as Element;
    while (typeof el === "function") el = (el as Function)();
    if (el && el.nodeType === 3) {
      isPortal = true;
      portalMarker = el as unknown as Text;
      // @ts-ignore
      portalMarker.willRemove = false;
      // @ts-ignore
      el = el["portalContainerChild"];
    }
    // console.log(prev);
    return untrack(() => {
      if (el && el !== prev) {
        if (props.mode !== "outin") {
          enterTransition(el, prev);
        } else if (first) {
          const _el = isPortal ? (portalMarker as unknown as Element) : el;
          set1(_el);
        }
      }

      if (prev && prev !== el && props.mode !== "inout") {
        exitTransition(el, prev);
      }
      first = false;
      return el;
    });
  });

  return [s1, s2];
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createElement(
  tagName: string,
  isSVG = false
): HTMLElement | SVGElement {
  return isSVG
    ? document.createElementNS(SVG_NAMESPACE, tagName)
    : document.createElement(tagName);
}

export function CustomPortal<
  T extends boolean = false,
  S extends boolean = false
>(props: {
  mount?: Node;
  useShadow?: T;
  isSVG?: S;
  ref?:
    | (S extends true ? SVGGElement : HTMLDivElement)
    | ((
        el: (T extends true ? { readonly shadowRoot: ShadowRoot } : {}) &
          (S extends true ? SVGGElement : HTMLDivElement)
      ) => void);
  children: JSX.Element;
}) {
  const { useShadow } = props,
    marker = document.createTextNode(""),
    mount = props.mount || document.body;

  // don't render when hydrating
  function renderPortal() {
    if (sharedConfig.context) {
      const [s, set] = createSignal(false);
      queueMicrotask(() => set(true));
      return () => s() && props.children;
    } else return () => props.children;
  }

  if (mount instanceof HTMLHeadElement) {
    const [clean, setClean] = createSignal(false);
    const cleanup = () => setClean(true);
    createRoot((dispose) =>
      insert(mount, () => (!clean() ? renderPortal()() : dispose()), null)
    );
    onCleanup(() => {
      if (sharedConfig.context) queueMicrotask(cleanup);
      else cleanup();
    });
  } else {
    const container = createElement(props.isSVG ? "g" : "div", props.isSVG),
      renderRoot =
        useShadow && container.attachShadow
          ? container.attachShadow({ mode: "open" })
          : container;

    // originally "_$host"
    Object.defineProperty(container, "host", {
      get() {
        return marker.parentNode;
      },
      configurable: true,
    });
    // will be "_$portalContainerChild"
    Object.defineProperty(marker, "portalContainerChild", {
      get() {
        return container.firstChild;
      },
      configurable: true,
    });
    Object.defineProperty(marker, "portalContainer", {
      get() {
        return container;
      },
      configurable: true,
    });
    Object.defineProperty(marker, "portalMount", {
      get() {
        return mount;
      },
      configurable: true,
    });
    // @ts-ignore
    marker.willRemove = true;
    insert(renderRoot, renderPortal());
    console.log("Portal appendChild!");
    mount.appendChild(container);
    (props as any).ref && (props as any).ref(container);
    onCleanup(() => {
      console.log("Portal cleanup");
      // @ts-ignore
      if (!marker.willRemove) return;
      mount.removeChild(container);
    });
  }
  return marker;
}

function CustomShow<T>(props: {
  when: T | undefined | null | false;
  keyed?: boolean;
  fallback?: any;
  children: any;
}) {
  let strictEqual = false;
  const keyed = props.keyed;
  const condition = createMemo<T | undefined | null | boolean>(
    () => props.when,
    undefined,
    { equals: (a, b) => (strictEqual ? a === b : !a === !b) }
  );
  return createMemo(
    () => {
      const c = condition();
      if (c) {
        const child = props.children;

        const fn = typeof child === "function" && child.length > 0;
        strictEqual = keyed || fn;
        return fn ? untrack(() => (child as any)(c as T)) : child;
      }
      return props.fallback;
    },
    undefined,
    undefined
  );
}

const FooComponent = () => {
  const [count, setCount] = createSignal(0);
  onCleanup(() => {
    console.log("FooComponent cleanup");
  });
  return (
    <div
      style="position: fixed; top: 190px; left: 0; padding: 5px; background: red;"
      onClick={(e) => {
        e.currentTarget.style.background = "blue";
      }}
    >
      <p>hi</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
        quisquam. Eos quisquam dicta, illum necessitatibus sapiente iure atque
        inventore perspiciatis, aliquid facilis, excepturi minima a aut
        molestiae quis fugit
      </p>
      <button onClick={() => setCount(count() + 1)}>Counter: {count()}</button>
    </div>
  );
};

const CustomStuff = () => {
  const [open, setOpen] = createSignal(false);
  createEffect(() => {
    console.log("open", open());
  });
  return (
    <>
      <button onClick={() => setOpen(!open())}>Toggle</button>
      <CustomTransition name="popup">
        <CustomShow when={open()}>
          <CustomPortal>
            <div style="position: fixed; top: 190px; left: 0; background: red;">
              <p>hi</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
                quisquam. Eos quisquam dicta, illum necessitatibus sapiente iure
                atque inventore perspiciatis, aliquid facilis, excepturi minima
                a aut molestiae quis fugit fuga voluptatibus possimus.
                Consequatur fuga est in? Magni facilis animi modi recusandae
                nemo perferendis itaque laboriosam! Possimus rerum placeat
                laudantium a.
              </p>
            </div>
          </CustomPortal>
        </CustomShow>
      </CustomTransition>
      {/* <Transition name="popup">
        <Show when={open()}>
          <FooComponent />
        </Show>
      </Transition> */}
    </>
  );
};

export default CustomStuff;
