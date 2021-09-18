import Dismiss from "../../../../package/index";
import { createSignal, onMount } from "solid-js";
import IFrame from "../IFrame";

const Dropdown = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative;">
      <button class="btn-primary" ref={btnEl}>
        Dropdown
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenScrolling
        useAriaExpanded
      >
        <ul class="dropdown">
          <li>
            <a class="item" href="#">
              cat
            </a>
          </li>
          <li>
            <a class="item" href="#">
              dog
            </a>
          </li>
          <li>
            <a class="item" href="#">
              fish
            </a>
          </li>
        </ul>
      </Dismiss>
    </div>
  );
};

export default Dropdown;
