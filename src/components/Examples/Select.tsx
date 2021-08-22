import Dismiss from "../../../package/index";
import { createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";

const Select = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let menuDropdown!: HTMLElement;

  createEffect(() => {
    if (!toggle()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    menuDropdown.style.position = "absolute";
    menuDropdown.style.width = btnBCR.width + "px";
    menuDropdown.style.top =
      btnBCR.top + btnBCR.height + window.scrollY + 10 + "px";
    menuDropdown.style.left = btnBCR.left + window.scrollX + "px";
  });

  return (
    <>
      <button class="btn-select" ref={btnEl}>
        Select... <span>V</span>
      </button>
      <Portal>
        <Dismiss
          menuButton={btnEl}
          toggle={toggle}
          setToggle={setToggle}
          withinMenuButtonParent={false}
          ref={menuDropdown}
        >
          <ul>
            <li tabindex="0">cat</li>
            <li tabindex="0">dog</li>
            <li tabindex="0">fish</li>
            <li tabindex="0">hat</li>
            <li tabindex="0">car</li>
          </ul>
        </Dismiss>
      </Portal>
    </>
  );
};

export default Select;
