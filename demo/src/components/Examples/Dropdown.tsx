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
            <button>hi</button>
            {/* <a href="#">cat</a> */}
          </li>
          <li>
            <button>bye</button>
            {/* <a href="#">dog</a> */}
          </li>
          <li>
            <button>hello</button>
            {/* <a href="#">fish</a> */}
          </li>
        </ul>
      </Dismiss>
    </div>
  );
};

export default Dropdown;
