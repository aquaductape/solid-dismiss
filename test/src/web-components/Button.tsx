import { createSignal } from "solid-js";
import { customElement } from "solid-element";
customElement("web-component-button", () => {
  const [count, setCount] = createSignal(0);
  return (
    <button onClick={() => setCount((prev) => prev + 1)}>Button {count}</button>
  );
});
