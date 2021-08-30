import Dismiss from "../../../package/index";
import { Component, createSignal, Show } from "solid-js";

const Dropdown: Component<{ focusOnLeave?: boolean }> = ({ focusOnLeave }) => {
  const [toggle, setToggle] = createSignal(false);
  // const ref: any = { menuDropdown: null };
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative">
      <button class="btn-primary btn-nested" ref={btnEl}>
        {toggle() ? "Opened" : "Nested Dropdown"}
      </button>
      <Dismiss
        class="nested-dropdown"
        menuButton={btnEl}
        toggle={toggle}
        setToggle={setToggle}
        overlay={"clipped"}
        focusOnLeave={focusOnLeave ? "menuButton" : undefined}
      >
        <div>
          <h3>Nested Dropdown Text</h3>
          <input type="text" />
          <select name="" id="">
            <option value="car">car</option>
            <option value="rat">rat</option>
            <option value="cat">cat</option>
          </select>
          <Show when={toggle()}>
            <Dropdown focusOnLeave={focusOnLeave} />
            <Dropdown focusOnLeave={focusOnLeave} />
            <Dropdown focusOnLeave={focusOnLeave} />
          </Show>
        </div>
      </Dismiss>
    </div>
  );
};

const NestedDropdown: Component<{ focusOnLeave?: boolean }> = ({
  focusOnLeave,
}) => {
  return <Dropdown focusOnLeave={focusOnLeave}></Dropdown>;
};

export default NestedDropdown;
