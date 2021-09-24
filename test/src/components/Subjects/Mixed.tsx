import {
  createEffect,
  createComputed,
  createSignal,
  Component,
} from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import Button from "../Button/Button";
import IFrame from "../IFrame";

const id = "mixed";
const Mixed = () => {
  return (
    <section id={id} class="nested mixed">
      <h2 tabindex="0">Mixed</h2>

      <div class="grid">
        <RegularPopup id={id}></RegularPopup>
        <MountedPopup id={id}></MountedPopup>
        <OverlayPopup id={id}></OverlayPopup>
        <OverlayDisabledClickPopup id={id}></OverlayDisabledClickPopup>
      </div>
    </section>
  );
};

const PopupContent: Component<{ id: string; idx: number }> = (props) => {
  return (
    <>
      <RegularPopup id={props.id} idx={props.idx + 1}></RegularPopup>
      <MountedPopup id={props.id} idx={props.idx + 1}></MountedPopup>
      <OverlayPopup id={props.id} idx={props.idx + 1}></OverlayPopup>
      <OverlayDisabledClickPopup
        id={props.id}
        idx={props.idx + 1}
      ></OverlayDisabledClickPopup>
    </>
  );
};

const RegularPopup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;

  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;
  let btnCloseEl!: HTMLButtonElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    // debugger;

    const containerWidth = 250;
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.height + 5 + "px";
    // containerEl.style.left = "0";
    containerEl.style.left = getLeft(btnBCR, containerWidth, false) + "px";
  });

  return (
    <div
      style="display: inline-block; position: relative; padding: 5px;"
      onClick={() => console.log("click container")}
    >
      <Button class="medium btn-regular" open={open()} ref={btnEl}>
        Regular
      </Button>
      <Dismiss
        class="popup-regular-absolute"
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeButtons={() => btnCloseEl}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          class={`${id + "-popup"} popup-regular dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Regular</strong>: Click on outside, should close stacks that
            don't contain the click
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
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
  let btnCloseEl!: HTMLButtonElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div
      style="display: inline-block; position: relative; padding: 5px;"
      onClick={() => console.log("click container MOUNTED")}
    >
      <Button class="medium btn-mounted" open={open()} ref={btnEl}>
        Mounted
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeButtons={() => btnCloseEl}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          class={`${id + "-popup"} popup-mounted dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Mounted</strong>: Click on outside, should close stacks that
            don't contain the click
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

const OverlayPopup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;
  let btnCloseEl!: HTMLButtonElement;

  createComputed(() => {
    if (!open()) return;
    const btnBCR = btnEl.getBoundingClientRect();

    console.log({ btnBCR });
  });
  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div
      style="display: inline-block; position: relative; padding: 5px;"
      onClick={() => console.log("click container")}
    >
      <Button class="medium btn-overlay" open={open()} ref={btnEl}>
        Overlay
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay={{ class: "overlay" }}
        closeButtons={() => btnCloseEl}
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div
          class={`${id + "-popup"} popup-overlay dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Overlay</strong>: Click on overlay, should only close that
            current stack
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

const OverlayDisabledClickPopup: Component<{ id: string; idx?: number }> = (
  props
) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;
  let btnCloseEl!: HTMLButtonElement;

  createComputed(() => {
    if (!open()) return;
    const btnBCR = btnEl.getBoundingClientRect();

    console.log({ btnBCR });
  });
  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div
      style="display: inline-block; position: relative; padding: 5px;"
      onClick={() => console.log("click container OVERLAY DISABLED")}
    >
      <Button class="medium btn-overlay-d" open={open()} ref={btnEl}>
        Overlay Disabled Click
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay={{ class: "overlay" }}
        closeButtons={() => btnCloseEl}
        closeWhenOverlayClicked={false}
        trapFocus={true}
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div
          class={`${id + "-popup"} popup-overlay-d dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Overlay</strong>: Click overlay to close is disabled! Press
            Escape or click "X" to close.
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

export default Mixed;
