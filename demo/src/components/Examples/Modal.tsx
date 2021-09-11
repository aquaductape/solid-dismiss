import Dismiss from "../../../../package/index";
import { createSignal } from "solid-js";
import { Portal } from "solid-js/web";

const Modal = () => {
  const [toggle, setToggle] = createSignal(false);
  let ulEl!: HTMLUListElement;

  const onClick = () => {
    ulEl.focus();
  };

  return (
    <>
      <button class="btn-primary" onClick={onClick}>
        Modal
      </button>
      <Portal>
        <div>
          <Dismiss class="dropdown-container" open={toggle} setOpen={setToggle}>
            <h3>Text in Modal</h3>
            <button>Close</button>
          </Dismiss>
        </div>
      </Portal>
    </>
  );
};

export default Modal;
