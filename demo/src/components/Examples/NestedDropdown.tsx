import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import {
  Component,
  createSignal,
  Show,
  Match,
  Switch,
  createEffect,
} from "solid-js";

const Dropdown: Component = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let menuDropdown!: HTMLElement;
  const [inputText, setInputText] = createSignal("");

  createEffect(() => {
    if (overlay === "clip") return;
    if (!toggle()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    menuDropdown.style.position = "absolute";
    menuDropdown.style.top =
      btnBCR.top + btnBCR.height + window.scrollY + 10 + "px";
    menuDropdown.style.left = btnBCR.left + window.scrollX + "px";
  });

  return (
    <div style="position: relative">
      <button class="btn-primary btn-nested" ref={btnEl}>
        {toggle() ? "Opened" : "Popup"}
      </button>
      <Dismiss
        menuButton={btnEl}
        open={toggle}
        setOpen={setToggle}
        overlay
        ref={menuDropdown}
      >
        <div class="nested-dropdown absolute" role="dialog">
          <h3>Nested Popup Text {"backdrop"}</h3>
          <input
            type="text"
            placeholder={"input text..."}
            onInput={(e) => setInputText(e.currentTarget.value)}
          />
          {inputText()}
          <br />
          <select name="" id="">
            <option value="car">car</option>
            <option value="rat">rat</option>
            <option value="cat">cat</option>
          </select>
          <Show when={toggle()}>
            <Dropdown focusOnLeave={focusOnLeave} overlay={overlay} />
            <Dropdown focusOnLeave={focusOnLeave} overlay={overlay} />
            <Dropdown focusOnLeave={focusOnLeave} overlay={overlay} />
          </Show>
        </div>
      </Dismiss>
    </div>
  );
};

export default NestedDropdown;
