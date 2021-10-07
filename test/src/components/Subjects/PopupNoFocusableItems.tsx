import { Component, createEffect, createSignal, onMount } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const id = "popup-no-focusable-items";
const PopupNoFocusableItems = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Popup no focusable items</h2>
      <p>No overlay, page is interactable</p>
      <p>Popup doesn't have focusable items such as buttons links ect.</p>
      <p>
        Therefore tabbing should go next or previous focusable element relative
        to menuButton and close menuPopup
      </p>
      <div class="grid">
        <Popup id={id + "-1"} />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
      </div>
    </section>
  );
};

const Popup: Component<{ id: string; idx?: number }> = (props) => {
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
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div id={id + "-popup"} class="dropdown middle" ref={dropdownEl}>
          Just some text. No focusable items here...
        </div>
      </Dismiss>
    </div>
  );
};

export default PopupNoFocusableItems;
