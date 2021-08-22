import Dismiss from "../../../package/index";
import { createSignal, Show, createEffect } from "solid-js";

const DropdownWithCloseButtons = () => {
  const [toggle, setToggle] = createSignal(false);
  const closeBtns: { [key: string]: any } = {
    save: null,
    close: null,
  };
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative">
      <button class="btn-primary" ref={btnEl}>
        Dropdown
      </button>
      <Dismiss
        class="dropdown dropdown-widget"
        menuButton={btnEl}
        closeButton={closeBtns}
        toggle={toggle}
        setToggle={setToggle}
      >
        <div>
          <h3>Dropdown Text</h3>
          <button class="btn-secondary" ref={closeBtns.save}>
            Save
          </button>
          <button class="btn-secondary" ref={closeBtns.close}>
            Close
          </button>
        </div>
      </Dismiss>
    </div>
  );
};

export default DropdownWithCloseButtons;
