import Dismiss from "../../../../package/index";
import { createSignal, onMount } from "solid-js";
import IFrame from "../IFrame";
// ...

const Dropdown = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative;">
      <button class="btn-primary" id="foobar" ref={btnEl}>
        Dropdown
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenWindowBlurs
        // trapFocus
        cursorKeys
        useAriaExpanded
      >
        <ul class="dropdown" style="overflow:auto;height: 200px;">
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
