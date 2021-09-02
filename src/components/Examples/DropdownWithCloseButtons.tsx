import Dismiss from "../../../package/index";
import { createSignal, Show, createEffect } from "solid-js";

const DropdownWithCloseButtons = () => {
  const [toggle, setToggle] = createSignal(false);
  let bntSaveEl!: HTMLButtonElement;
  let bntCloseEl!: HTMLButtonElement;
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative">
      <button class="btn-primary" ref={btnEl}>
        Dropdown
      </button>
      <Dismiss
        class="dropdown dropdown-widget"
        menuButton={btnEl}
        closeButton={() => [bntSaveEl, bntCloseEl]}
        toggle={toggle}
        setToggle={setToggle}
      >
        <div>
          <h3>Dropdown Text</h3>
          <button class="btn-secondary" ref={bntSaveEl}>
            Save
          </button>
          <button class="btn-secondary" ref={bntCloseEl}>
            Close
          </button>
        </div>
      </Dismiss>
    </div>
  );
};

export default DropdownWithCloseButtons;
