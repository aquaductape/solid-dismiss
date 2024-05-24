import { Component, createEffect, createSignal, onMount } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

// For non-modals/dialog
const id = "dont-close-when-clicking-outside";

const DontCloseWhenClickingOutside = () => {
  return (
    <section id={id} class="nested">
      <h2 tabindex="0">Don't close when clicking outside</h2>
      <p>No overlay, page is interactable</p>
      <p>
        menuPopups are adjecent sibling to menuButton, this means stacks are
        also direct children
      </p>
      <p>
        <a id={id + "-some-link"} href="javascript:void()">
          some link
        </a>
      </p>

      <div class="grid">
        <Popup id={id + "-1"} />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
      </div>
      <h3>Mounted Popups</h3>
      <div class="grid">
        <MountedPopup id={id + "-1"} />
        <MountedPopup id={id + "-2"} />
      </div>
    </section>
  );
};

const Popup: Component<{ id: string; idx?: number }> = (props) => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;

  createEffect(() => {
    if (!open()) return;

    containerEl.style.padding = "10px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: block; position: relative;"
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        closeWhenClickingOutside={false}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          id={id + "-popup"}
          class="dropdown"
          style="padding: 10px 25px 25px 25px;"
        >
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <Popup id={props.id} idx={idx + 1}></Popup>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};

const MountedPopup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    containerEl.style.position = "absolute";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, 320) + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        closeWhenClickingOutside={false}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          id={id + "-popup"}
          class="dropdown middle"
          ref={dropdownEl}
          tabindex="-1"
        >
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <MountedPopup id={props.id} idx={idx + 1} />
            <MountedPopup id={props.id} idx={idx + 1} />
            <MountedPopup id={props.id} idx={idx + 1} />
          </div>
        </div>
      </Dismiss>
    </div>
  );
};

export default DontCloseWhenClickingOutside;
