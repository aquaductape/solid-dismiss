import { onCleanup, JSX, createSignal, sharedConfig } from "solid-js";
import { insert } from "solid-js/web";

function CreatePortal(props: {
  mount?: Node;
  useShadow?: boolean;
  isSVG?: boolean;
  children: JSX.Element;
  stopComponentEventPropagation?: boolean;
  marker?: Text | null;
  onCreate?: (mount: HTMLElement, container: HTMLElement, marker: Text) => void;
  useCleanup?: boolean;
}) {
  const { useShadow } = props,
    marker = props.marker || document.createTextNode(""),
    mount = props.mount || document.body;

  // don't render when hydrating
  function renderPortal() {
    if (sharedConfig.context) {
      const [s, set] = createSignal(false);
      queueMicrotask(() => set(true));
      return () => s() && props.children;
    } else return () => props.children;
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
  mount.appendChild(container);
  (props as any).ref && (props as any).ref(container);

  if (props.onCreate != null) {
    // @ts-ignore
    props.onCreate(mount, container, marker);
  }

  if (props.useCleanup == null || props.useCleanup) {
    console.log("don use cleanup");
    onCleanup(() => {
      mount.removeChild(container);
    });
  }

  return !props.stopComponentEventPropagation ? marker : null;
}

export default CreatePortal;
