import { createSignal, createEffect, Component } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, reflow, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import HiddenTabbableItems from "../HiddenTabbableItems";
import IFrame from "../IFrame";

const id = "iframes-bcl";
const IFramesWithBodyClickListener = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">menuPopup with iframes(body click listener)</h2>
      <p>No overlay, page is interactable</p>
      <p>
        menuPopups are <strong>mounted</strong> to the body.
      </p>
      <p>
        Tabbing forwards outside menuPopup should focus on the next tabbable
        item after menuButton.
      </p>
      <p>
        When menuPopup active, click/tab "outside" iframe. menuPopup should be
        closed
      </p>
      <p>
        When menuPopup active, click/tab menuPopup iframe, then click/tab
        "outside" iframe. menuPopup should be closed
      </p>
      <p>For iOS, supports 13+</p>

      <div class="grid" style="grid-template-columns: repeat(4, 1fr)">
        <Popup id={id + "-1"} />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
        <div class="lone-iframe">
          <IFrame bodyHasClickListener />
        </div>
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

  if (!settings.animation.enable) {
    createEffect(() => {
      if (!open()) return;

      const btnBCR = btnEl.getBoundingClientRect();
      containerEl.style.position = "absolute";
      reflow();
      containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
      containerEl.style.left = getLeft(btnBCR, containerEl.clientWidth) + "px";
    });
  }

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      {/* {open() ? "open" : "closed"} */}
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        ref={containerEl}
        {...toggleAnimation({
          onBeforeEnter: (_el) => {
            const el = _el as HTMLElement;
            const btnBCR = btnEl.getBoundingClientRect();
            el.style.position = "absolute";
            el.style.top = btnBCR.bottom + window.scrollY + "px";
            el.style.left = getLeft(btnBCR, el.clientWidth) + "px";
          },
        })}
      >
        <div id={id + "-popup"} class="dropdown" style="height: 100%;">
          <div style="display: flex;">
            <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
            <IFrame class="f-1" bodyHasClickListener></IFrame>
            <IFrame class="f-2" bodyHasClickListener></IFrame>
          </div>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <Popup id={props.id} idx={idx + 1}></Popup>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <Popup id={props.id} idx={idx + 1}></Popup>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};
export default IFramesWithBodyClickListener;
