import Dismiss from "../../../package/index";
import { createSignal, Show } from "solid-js";
// ...

const Dropdown = () => {
  const [toggle, setToggle] = createSignal(false);

  return (
    <Dismiss toggle={toggle} setToggle={setToggle}>
      <button class="btn-primary">Dropdown</button>
      <Show when={toggle()}>
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
      </Show>
    </Dismiss>
  );
};

export default Dropdown;
