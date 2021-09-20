import { createEffect, createComputed, createSignal } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import Button from "../Button/Button";
import IFrame from "../IFrame";

const Mixed = () => {
  return (
    <section class="nested mixed">
      <h2>Mixed</h2>

      <div class="grid">
        <RegularPopup></RegularPopup>
        <MountedPopup></MountedPopup>
        <OverlayPopup></OverlayPopup>
        <OverlayDisabledClickPopup></OverlayDisabledClickPopup>
      </div>
    </section>
  );
};

const PopupContent = () => {
  return (
    <>
      <RegularPopup></RegularPopup>
      <MountedPopup></MountedPopup>
      <OverlayPopup></OverlayPopup>
      <OverlayDisabledClickPopup></OverlayDisabledClickPopup>
    </>
  );
};

const RegularPopup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;
  let btnCloseEl!: HTMLButtonElement;

  return (
    <div
      style="display: inline-block; position: relative; padding: 5px;"
      onClick={() => console.log("click container")}
    >
      <Button class="medium" open={open()} ref={btnEl}>
        Regular
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeButtons={() => btnCloseEl}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div class="dropdown padding-top" ref={dropdownEl}>
          <p>
            <strong>Regular</strong>: Click on outside, should close stacks that
            don't contain the click
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

const MountedPopup = () => {
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
      onClick={() => console.log("click container")}
    >
      <Button class="medium" open={open()} ref={btnEl}>
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
        <div class="dropdown padding-top" ref={dropdownEl}>
          <p>
            <strong>Mounted</strong>: Click on outside, should close stacks that
            don't contain the click
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

const OverlayPopup = () => {
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
      <Button class="medium" open={open()} ref={btnEl}>
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
        <div class="dropdown padding-top" ref={dropdownEl}>
          <p>
            <strong>Overlay</strong>: Click on overlay, should only close that
            current stack
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

const OverlayDisabledClickPopup = () => {
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
      <Button class="medium" open={open()} ref={btnEl}>
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
        <div class="dropdown padding-top" ref={dropdownEl}>
          <p>
            <strong>Overlay</strong>: Click overlay to close is disabled! Press
            Escape or click "X" to close.
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent />
          <button aria-label="close" class="close" ref={btnCloseEl}></button>
        </div>
      </Dismiss>
    </div>
  );
};

export default Mixed;
