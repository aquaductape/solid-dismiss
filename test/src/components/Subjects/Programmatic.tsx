import { createEffect, createSignal, Component } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, getWidth, reflow, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const id = "modal";
const idMounted = "mounted";

const Programmatic = () => {
  return (
    <section id={"programmatic"} class="nested">
      <h2 tabindex="0">Programmatic</h2>
      <p>
        menuPopups are <strong>mounted</strong> to the body.
      </p>
      <p>
        <a id="some-link" href="javascript:void()">
          some link
        </a>
      </p>

      <div class="grid">
        <PopupModal id={id + "-1"} closeTimeout />
        <PopupMounted id={idMounted + "-2"} closeTimeout />
      </div>
    </section>
  );
};

const PopupModal: Component<{
  id: string;
  idx?: number;
  closeTimeout?: boolean;
}> = (props) => {
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
    const linkEl = document.getElementById("some-link")!;

    if (props.closeTimeout) {
      setTimeout(() => {
        setOpen(false);
        linkEl.focus();
      }, 1000);
    }

    const btnBCR = btnEl.getBoundingClientRect();

    console.log({ btnBCR });
    containerEl.style.position = "absolute";
    const containerWidth = getWidth({
      viewportUnit: 90,
      minWidth: 100,
      maxWidth: 320,
    });
    containerEl.style.width = containerWidth + "px";
    // reflow();
    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
      onClick={() => console.log("click container")}
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlayElement={{ class: "overlay" }}
        trapFocus
        focusElementOnOpen=".save"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div id={id + "-popup"} class="dropdown middle" ref={dropdownEl}>
          {props.closeTimeout && (
            <p>
              This menuPopup will close after 1 second and focus will be moved
              to "some link" link
            </p>
          )}
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <PopupModal id={props.id} idx={idx + 1}></PopupModal>
          </div>
          <button class="save">Save</button>
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

const PopupMounted: Component<{
  id: string;
  idx?: number;
  closeTimeout?: boolean;
}> = (props) => {
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
    const linkEl = document.getElementById("some-link")!;

    if (props.closeTimeout) {
      setTimeout(() => {
        linkEl.focus();
        setOpen(false);
      }, 1000);
    }

    const btnBCR = btnEl.getBoundingClientRect();

    console.log({ btnBCR });
    containerEl.style.position = "absolute";
    const containerWidth = getWidth({
      viewportUnit: 90,
      minWidth: 100,
      maxWidth: 320,
    });
    containerEl.style.width = containerWidth + "px";
    // reflow();
    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
      onClick={() => console.log("click container")}
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlayElement={{ class: "overlay" }}
        trapFocus
        focusElementOnOpen=".save"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div id={id + "-popup"} class="dropdown middle" ref={dropdownEl}>
          {props.closeTimeout && (
            <p>
              This {props.id} menuPopup will close after 1 second and focus will
              be moved to "some link" link
            </p>
          )}
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <PopupModal id={props.id} idx={idx + 1}></PopupModal>
          </div>
          <button class="save">Save</button>
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

export default Programmatic;
