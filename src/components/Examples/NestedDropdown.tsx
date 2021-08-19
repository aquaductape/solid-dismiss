import Dismiss from "../../../package/index";
import { createSignal, Show, createEffect } from "solid-js";

const Dropdown = () => {
  const [toggle, setToggle] = createSignal(false);

  return (
    <Dismiss
      class="nested-dropdown-container"
      toggle={toggle}
      setToggle={setToggle}
    >
      <button class="btn-primary btn-nested">
        {toggle() ? "Opened" : "Nested Dropdown"}
      </button>
      <Show when={toggle()}>
        <div class="nested-dropdown" tabindex="-1">
          <h3>Nested Dropdown Text</h3>
          <Dropdown />
          <Dropdown />
          <Dropdown />
        </div>
      </Show>
    </Dismiss>
  );
};

const NestedDropdown = () => {
  return <Dropdown></Dropdown>;
};

export default NestedDropdown;
