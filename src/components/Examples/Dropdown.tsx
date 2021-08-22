import Dismiss from "../../../package/index";
import { createSignal, onMount } from "solid-js";
// ...

const Dropdown = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative;">
      <button class="btn-primary" ref={btnEl}>
        Dropdown
      </button>
      <Dismiss menuButton={btnEl} toggle={toggle} setToggle={setToggle}>
        <ul class="dropdown">
          <li tabindex="0">cat</li>
          <li tabindex="0">dog</li>
          <li tabindex="0">fish</li>
        </ul>
      </Dismiss>
    </div>
  );
};

export default Dropdown;
