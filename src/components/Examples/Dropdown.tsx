import Dismiss from "../../../package/index";
import { createSignal } from "solid-js";
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
          <li>
            <a href="javascript:void(0);">cat</a>
          </li>
          <li>
            <a href="javascript:void(0);">dog</a>
          </li>
          <li>
            <a href="javascript:void(0);">fish</a>
          </li>
          <li>
            <a href="javascript:void(0);">bird</a>
          </li>
        </ul>
      </Dismiss>
    </div>
  );
};

export default Dropdown;
