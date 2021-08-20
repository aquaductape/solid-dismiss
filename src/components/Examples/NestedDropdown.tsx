import Dismiss from "../../../package/index";
import { createSignal, Show } from "solid-js";

const Dropdown = () => {
  const [toggle, setToggle] = createSignal(false);
  // const ref: any = { menuDropdown: null };
  let btnEl!: HTMLButtonElement;

  return (
    <>
      <button class="btn-primary btn-nested" ref={btnEl}>
        {toggle() ? "Opened" : "Nested Dropdown"}
      </button>
      <Dismiss menuButton={btnEl} toggle={toggle} setToggle={setToggle}>
        <div class="nested-dropdown">
          <h3>Nested Dropdown Text</h3>
          <input type="text" />
          <select name="" id="">
            <option value="car">car</option>
            <option value="rat">rat</option>
            <option value="cat">cat</option>
          </select>
          <Show when={toggle()}>
            <Dropdown />
            <Dropdown />
            <Dropdown />
          </Show>
        </div>
      </Dismiss>
    </>
  );
};

const NestedDropdown = () => {
  return <Dropdown></Dropdown>;
};

export default NestedDropdown;
