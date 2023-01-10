import { createSignal, createEffect, Component } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import HiddenTabbableItems from "../HiddenTabbableItems";

const id = "modal2";
const Modal2 = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Modal 2</h2>
      <p>overlay, page is not interactable</p>
      <p>overlay click to dismiss is enabled</p>
      <p>focusElementOnOpen is not set, which defaults to "menuPopup"</p>
      <p>Focus trap enabled</p>

      <div class="grid">
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-1"} />
        <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
        <Popup id={id + "-2"} />
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-3"} />
        <HiddenTabbableItems></HiddenTabbableItems>
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

  const onClickClose = () => {
    setOpen(false);
  };

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
        modal
        overlayElement={{ class: "overlay" }}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          id={id + "-popup"}
          data-test="menu-popup"
          class="dropdown middle"
          role="dialog"
          ref={dropdownEl}
        >
          <HiddenTabbableItems></HiddenTabbableItems>
          <p>
            Some{" "}
            <a data-test="first-tabbable-item" href="javascript:void(0)">
              random
            </a>{" "}
            text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems></HiddenTabbableItems>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems></HiddenTabbableItems>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
            <button
              aria-label="close"
              class="close"
              data-test="close-btn"
              onClick={onClickClose}
            ></button>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};

export default Modal2;
