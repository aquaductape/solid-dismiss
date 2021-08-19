import Dismiss from "../../../package/index";
import { createSignal, Show, createEffect } from "solid-js";

const DropdownWidget = () => {
  const [toggle, setToggle] = createSignal(false);
  const dropdown: { [key: string]: any } = {
    el: null,
  };
  const closeBtns: { [key: string]: any } = {
    save: null,
    close: null,
  };

  return (
    <Dismiss
      class="dropdown-container"
      closeButton={closeBtns}
      toggle={toggle}
      setToggle={setToggle}
      focusOnActive="menuDropdown"
    >
      <button class="btn-secondary">Dropdown Widget</button>
      <Show when={toggle()}>
        <div class="dropdown dropdown-widget" tabindex="-1">
          <h2>Dropdown Widget Text</h2>
          <button class="btn-secondary" ref={closeBtns.save}>
            Save
          </button>
          <button class="btn-secondary" ref={closeBtns.close}>
            Close
          </button>
        </div>
      </Show>
    </Dismiss>
  );
};

export default DropdownWidget;
