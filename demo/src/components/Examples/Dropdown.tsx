import Dismiss from "../../../../package/index";
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
      <Dismiss
        menuButton={btnEl}
        toggle={toggle}
        setToggle={setToggle}
        cursorKeys
      >
        <ul class="dropdown">
          <li>
            <a href="#">cat</a>
          </li>
          <li>
            <a href="#">dog</a>
          </li>
          <li>
            <a href="#">fish</a>
          </li>
        </ul>
      </Dismiss>
    </div>
  );
};

export default Dropdown;
