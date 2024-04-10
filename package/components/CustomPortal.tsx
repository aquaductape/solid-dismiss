import {
  createRoot,
  createSignal,
  onCleanup,
  sharedConfig,
  JSX,
} from "solid-js";
import { insert } from "solid-js/web";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createElement(
  tagName: string,
  isSVG = false
): HTMLElement | SVGElement {
  return isSVG
    ? document.createElementNS(SVG_NAMESPACE, tagName)
    : document.createElement(tagName);
}

function CustomPortal<
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

  overlayChildren?: JSX.Element;
  isModal?: boolean;
  children: JSX.Element;
}) {
  const { useShadow, isModal } = props,
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

    const containerObjectValue = {
      get() {
        return marker.parentNode;
      },
      configurable: true,
    };
    Object.defineProperty(container, "host", containerObjectValue);
    Object.defineProperty(container, "_$host", containerObjectValue);
    // will be "_$portalContainerChild"
    Object.defineProperty(marker, "portalContainerChild", {
      get() {
        if (overlayChildren) {
          return container.children[1];
        }
        // return container.querySelector('[role="dialog"]');
        return container.firstElementChild;
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
    const overlayChildren = props.overlayChildren;
    if (overlayChildren) {
      // Object.defineProperty(containerFirstChild, "portalOverlay", {
      //   get() {
      //     return overlayChildren;
      //   },
      //   configurable: true,
      // });
      Object.defineProperty(marker, "portalOverlay", {
        get() {
          return overlayChildren;
        },
        configurable: true,
      });
      container.insertAdjacentElement(
        "afterbegin",
        overlayChildren as HTMLElement
      );
    }
    mount.appendChild(container);
    (props as any).ref && (props as any).ref(container);
    onCleanup(() => {
      // @ts-ignore
      if (!marker.willRemove) return;
      mount.removeChild(container);
    });
  }
  return marker;
}

export default CustomPortal;
