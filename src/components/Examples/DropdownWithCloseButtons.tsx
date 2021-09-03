import Dismiss from "../../../package/index";
import { createSignal, Show, createEffect } from "solid-js";

const DropdownWithCloseButtons = () => {
  const [toggle, setToggle] = createSignal(false);
  const [redrawClippedPath, setRedrawClippedPath] = createSignal(0, {
    equals: false,
  });
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
        overlay={{ clipped: { redrawClippedPath } }}
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
