import { Transition } from "solid-transition-group";
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

const Mixed: Component = () => {
  const [toggleNorm, setToggleNorm] = createSignal(false);
  const [toggleBlock, setToggleBlock] = createSignal(false);
  const [toggleClip, setToggleClip] = createSignal(false);
  const [inputTextNorm, setInputTextNorm] = createSignal("");
  const [inputTextBlock, setInputTextBlock] = createSignal("");
  const [inputTextClip, setInputTextClip] = createSignal("");
  let btnElNorm!: HTMLButtonElement;
  let btnElBlock!: HTMLButtonElement;
  let btnElClip!: HTMLButtonElement;
  let menuDropdown!: HTMLElement;

  console.log("render");

  createEffect(() => {
    if (!toggleBlock()) return;

    const btnBCR = btnElBlock.getBoundingClientRect();
    menuDropdown.style.position = "absolute";
    menuDropdown.style.top =
      btnBCR.top + btnBCR.height + window.scrollY + 10 + "px";
    menuDropdown.style.left = btnBCR.left + window.scrollX + "px";
  });

  return (
    <div style="position: relative">
      <button class="btn-primary btn-nested" ref={btnElNorm}>
        {!toggleNorm() ? "Norm" : "Norm ✅"}
      </button>
      <button class="btn-primary btn-nested" ref={btnElBlock}>
        {!toggleBlock() ? "Block" : "Block ✅"}
      </button>
      <button class="btn-primary btn-nested" ref={btnElClip}>
        {!toggleClip() ? "Clip" : "Clip ✅"}
      </button>
      <Dismiss
        class="nested-dropdown"
        menuButton={btnElNorm}
        open={toggleNorm}
        setOpen={setToggleNorm}
        // ref={menuDropdown}
      >
        <div>
          <h3>Nested Dropdown Text Norm</h3>
          <input
            type="text"
            placeholder={"input text..."}
            onInput={(e) => setInputTextNorm(e.currentTarget.value)}
          />
          {inputTextNorm()}
          <br />
          <select name="" id="">
            <option value="car">car</option>
            <option value="rat">rat</option>
            <option value="cat">cat</option>
          </select>
          <Show when={toggleNorm()}>
            <Mixed></Mixed>
          </Show>
        </div>
      </Dismiss>
      <Portal>
        <Dismiss
          class="nested-dropdown"
          menuButton={btnElBlock}
          open={toggleBlock}
          setOpen={setToggleBlock}
          overlay={"block"}
          ref={menuDropdown}
        >
          <div>
            <h3>Nested Dropdown Text Block</h3>
            <input
              type="text"
              placeholder={"input text..."}
              onInput={(e) => setInputTextBlock(e.currentTarget.value)}
            />
            {inputTextBlock()}
            <br />
            <select name="" id="">
              <option value="car">car</option>
              <option value="rat">rat</option>
              <option value="cat">cat</option>
            </select>
            <Show when={toggleBlock()}>
              <Mixed></Mixed>
            </Show>
          </div>
        </Dismiss>
      </Portal>

      <Dismiss
        class="nested-dropdown"
        menuButton={btnElClip}
        open={toggleClip}
        setOpen={setToggleClip}
        overlay={"clipped"}
      >
        <div>
          <h3>Nested Dropdown Text Clip</h3>
          <input
            type="text"
            placeholder={"input text..."}
            onInput={(e) => setInputTextClip(e.currentTarget.value)}
          />
          {inputTextClip()}
          <br />
          <select name="" id="">
            <option value="car">car</option>
            <option value="rat">rat</option>
            <option value="cat">cat</option>
          </select>
          <Show when={toggleClip()}>
            <Mixed></Mixed>
          </Show>
        </div>
      </Dismiss>
    </div>
  );
};

export default Mixed;
