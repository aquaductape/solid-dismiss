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

const Dropdown: Component<{
  focusOnLeave?: boolean;
  overlay?: "clipped" | "backdrop";
}> = ({ focusOnLeave, overlay }) => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let menuDropdown!: HTMLElement;
  const [inputText, setInputText] = createSignal("");

  createEffect(() => {
    if (overlay !== "backdrop") return;
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

      <Switch>
        <Match when={overlay === "backdrop"}>
          <Portal>
            <Dismiss
              menuButton={btnEl}
              open={toggle}
              setOpen={setToggle}
              overlay={overlay}
              // focusOnLeave={focusOnLeave ? "menuButton" : undefined}
              closeWhenClickedOutside={false}
              ref={menuDropdown}
            >
              <div class="nested-dropdown" role="dialog">
                <h3>Nested Popup Text {overlay || ""}</h3>
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
          </Portal>
        </Match>
        <Match when={overlay === "clipped"}>
          <Dismiss
            class="nested-dropdown"
            menuButton={btnEl}
            open={toggle}
            setOpen={setToggle}
            overlay={"clipped"}
            focusElWhenClosed={focusOnLeave ? "menuButton" : undefined}
            ref={menuDropdown}
          >
            <div role="dialog">
              <h3>Nested Popup Text {overlay || ""}</h3>
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
        </Match>
        <Match when={true}>
          <Dismiss
            class="nested-dropdown"
            menuButton={btnEl}
            open={toggle}
            setOpen={setToggle}
            focusElWhenClosed={focusOnLeave ? "menuButton" : undefined}
            ref={menuDropdown}
          >
            <div>
              <h3>Nested Popup Text</h3>
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
        </Match>
      </Switch>
    </div>
  );
};

const NestedDropdown: Component<{
  focusOnLeave?: boolean;
  overlay?: "clipped" | "backdrop";
}> = ({ focusOnLeave, overlay }) => {
  return <Dropdown focusOnLeave={focusOnLeave} overlay={overlay}></Dropdown>;
};

export default NestedDropdown;
