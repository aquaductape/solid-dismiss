import { createSignal } from "solid-js";
import { customElement } from "solid-element";

const style = /*css*/ `
.hidden-button {
  display: none;
}
`;

customElement("web-component-button", () => {
  const [count, setCount] = createSignal(0);
  return (
    <div>
      <style>{style}</style>
      <button class="hidden-button">hidden</button>
      <button
        class="web-component-button"
        onClick={() => setCount((prev) => prev + 1)}
      >
        WC Button{count() ? ` ${count()}` : ""}
      </button>
      <button class="hidden-button">hidden</button>
    </div>
  );
});
