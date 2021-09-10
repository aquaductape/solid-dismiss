import Dismiss from "../../../../package/index";
import { createSignal } from "solid-js";

const DropdownWithCloseButtons = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;

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
        toggle={toggle}
        setToggle={setToggle}
      >
        <div>
          <h3>Dropdown Text</h3>
          <button class="btn-secondary" onClick={onClickClose}>
            Save
          </button>
          <button class="btn-secondary" onClick={onClickClose}>
            Close
          </button>
        </div>
      </Dismiss>
    </div>
  );
};

export default DropdownWithCloseButtons;
