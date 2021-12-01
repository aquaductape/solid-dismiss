import { JSX, createSignal, sharedConfig, Component } from "solid-js";
import { insert, isServer } from "solid-js/web";

const CreatePortal: Component<{
  mount?: Node;
  useShadow?: boolean;
  isSVG?: boolean;
  popupChildren: JSX.Element;
  overlayChildren: JSX.Element;
  stopComponentEventPropagation?: boolean;
  marker?: Text | null;
  onCreate?: (mount: HTMLElement, container: HTMLElement, marker: Text) => void;
}> = (props) => {
  if (isServer) return "";

  const { useShadow } = props,
    marker = props.marker || document.createTextNode(""),
    mount = props.mount || document.body;

  // don't render when hydrating
  function renderPortal() {
    if (sharedConfig.context) {
      const [s, set] = createSignal(false);
      queueMicrotask(() => set(true));
      return () => s() && props.popupChildren;
    } else return () => props.popupChildren;
  }

  const container = document.createElement("div"),
    renderRoot =
      useShadow && container.attachShadow
        ? container.attachShadow({ mode: "open" })
        : container;

  // if (!props.stopComponentEventPropagation) {
  Object.defineProperty(container, "host", {
    get() {
      return marker.parentNode;
    },
  });
  // }

  insert(renderRoot, renderPortal());
  // mount.appendChild(props.overlayChildren as HTMLElement);
  const overlayChildren = props.overlayChildren;
  if (overlayChildren) {
    container.insertAdjacentElement(
      "afterbegin",
      overlayChildren as HTMLElement
    );
  }
  mount.appendChild(container);
  (props as any).ref && (props as any).ref(container);

  if (props.onCreate != null) {
    // @ts-ignore
    props.onCreate(mount, container, marker);
  }

  return !props.stopComponentEventPropagation ? marker : null;
};

export default CreatePortal;
