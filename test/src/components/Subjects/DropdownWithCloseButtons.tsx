import Dismiss from "../../../../package/index";
import { createSignal } from "solid-js";

const DropdownWithCloseButtons = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let btnSaveEl!: HTMLButtonElement;

  const onClickClose = () => {
    setToggle(false);
  };

  return (
    <div style="position: relative">
      <button class="btn-primary" ref={btnEl}>
        Dropdown
      </button>
      <Dismiss
        class="dropdown dropdown-widget"
        menuButton={btnEl}
        open={toggle}
        setOpen={setToggle}
        focusElementOnOpen={() => btnSaveEl}
      >
        <div>
          <h3>Dropdown Text</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <div className="close-btns">
            <button class="btn-secondary" onClick={onClickClose}>
              Cancel
            </button>
            <button
              class="btn-secondary"
              ref={btnSaveEl}
              onClick={onClickClose}
            >
              Save
            </button>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};

export default DropdownWithCloseButtons;
