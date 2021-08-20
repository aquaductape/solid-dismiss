import Dismiss from "../../../package/index";
import { createSignal, Show, createEffect } from "solid-js";

const Dropdown = () => {
  const [toggle, setToggle] = createSignal(false);
  const ref: any = { menuDropdown: null };

  return (
    <Dismiss
      class="nested-dropdown-container"
      toggle={toggle}
      setToggle={setToggle}
      menuDropdown={ref}
      focusOnLeave="menuButton"
    >
      <button class="btn-primary btn-nested">
        {toggle() ? "Opened" : "Nested Dropdown"}
      </button>
      <Show when={toggle()}>
        <div class="nested-dropdown" tabindex="-1" ref={ref.menuDropdown}>
          <h3>Nested Dropdown Text</h3>
          <input type="text" />
          <select name="" id="">
            <option value="car">car</option>
            <option value="rat">rat</option>
            <option value="cat">cat</option>
          </select>
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
