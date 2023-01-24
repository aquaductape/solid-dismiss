import { Component, createEffect, createSignal, on } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import HiddenTabbableItems from "../HiddenTabbableItems";

const id = "modal-overflow-on-body";
const ModalOverflowOnBody = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Modal Overflow On Page Viewport height</h2>
      <p>overlay, page is not interactable</p>

      <p>
        It's common that Modal's max height is set to be no larger than viewport
        height. This way when modal has large amount of content that outsizes
        the viewport, the modal container becomes scrollable.
      </p>
      <p>
        Here's an aesthetic alternative where you don't want Modal's height to
        be fixed to viewport, and instead overflow the page viewport height, as
        if the modal was part of document flow.
      </p>
      <p>This is similar on how Netflix displays their movie info modals.</p>

      <div class="grid">
        <HiddenTabbableItems></HiddenTabbableItems>
        <Modal id={id + "-1"} />
        <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
        <Modal id={id + "-2"} />
        <HiddenTabbableItems></HiddenTabbableItems>
        <Modal id={id + "-3"} />
        <HiddenTabbableItems></HiddenTabbableItems>
      </div>
    </section>
  );
};

const Modal: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  let prevScrollY = 0;

  createEffect(
    on(
      open,
      (open) => {
        const main = document.querySelector("main")!;
        if (!open) {
          main.style.position = "";
          main.style.top = "";
          main.style.width = "";
          // main.style.left = "";
          window.scrollTo({ top: prevScrollY });
          return;
        }

        const { scrollY } = window;

        // const btnBCR = btnEl.getBoundingClientRect();

        // containerEl.style.position = "fixed";

        const mainBCR = main.getBoundingClientRect();
        // make sure the "main page" element doesn't have bleeding margins
        // otherwise when it's position is fixed/absolute (in this case "fixed")
        // the child margins no longer bleed and instead are part of root element content size.
        // Which results in mismatched top position when toggling modal.
        // To prevent this make sure that by default "main page" element has top and bottom padding
        // or has `display: flow-root;`.
        main.style.position = "fixed";
        main.style.top = `${mainBCR.top}px`;
        main.style.width = `${mainBCR.width}px`;
        // main.style.left = `${mainBCR.left}px`;
        prevScrollY = scrollY;
        window.scrollTo({ top: 0 });

        // containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
        // containerEl.style.left = getLeft(btnBCR, 320) + "px";
      },
      { defer: true }
    )
  );

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
        // focusElementOnOpen="firstChild"
        removeScrollbar={false}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          id={id + "-popup"}
          data-test="menu-popup"
          class="dropdown middle"
          role="dialog"
          style="height: 150vh; width: 80%; margin: 0 auto;"
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
          <p style="position: absolute; bottom: 0; left: 0;">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Repudiandae a itaque officia sequi doloremque doloribus quo
            consequatur unde nemo culpa.
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <RegularPopup id={props.id} idx={idx + 1} />
            <HiddenTabbableItems />
            <MountedPopup id={props.id} idx={idx + 1} />
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

const RegularPopup: Component<{ id: string; idx?: number }> = (props) => {
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

    const containerWidth = 250;
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.height + 5 + "px";
    // containerEl.style.left = "0";
    containerEl.style.left = getLeft(btnBCR, containerWidth, false) + "px";
  });

  return (
    <div style="display: inline-block; position: relative; padding: 5px;">
      <Button class="medium btn-regular" open={open()} ref={btnEl}>
        Regular
      </Button>
      <Dismiss
        class="popup-regular-absolute"
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
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
          <RegularPopup id={props.id} idx={idx} />
          <button
            aria-label="close"
            class="close"
            onClick={onClickClose}
          ></button>
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

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";
    containerEl.style.zIndex = "1000";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div style="display: inline-block; position: relative; padding: 5px;">
      <Button class="medium btn-mounted" open={open()} ref={btnEl}>
        Mounted
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
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
          <MountedPopup id={props.id} idx={idx} />
          <button
            aria-label="close"
            class="close"
            onClick={onClickClose}
          ></button>
        </div>
      </Dismiss>
    </div>
  );
};

export default ModalOverflowOnBody;
