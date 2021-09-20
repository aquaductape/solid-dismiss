import {
  Show,
  createSignal,
  onMount,
  For,
  createEffect,
  createRenderEffect,
  Component,
} from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import { getLeft, reflow, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import IFrame from "../IFrame";

const IFramesWithBodyClickListener = () => {
  return (
    <section>
      <h2>menuPopup with iframes(body click listener)</h2>
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
        <Popup />
        <Popup />
        <Popup />
        <div class="lone-iframe">
          <IFrame bodyHasClickListener />
        </div>
      </div>
    </section>
  );
};

const Popup: Component<{ id?: string }> = ({ id }) => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;

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
    <div style="display: inline-block; position: relative;">
      {/* {open() ? "open" : "closed"} */}
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Dismiss
        id={id}
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
        <div class="dropdown" style="height: 100%;">
          <div style="display: flex;">
            <IFrame bodyHasClickListener></IFrame>
            <IFrame bodyHasClickListener></IFrame>
          </div>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, 1fr)">
            <Popup></Popup>
            <Popup></Popup>
            <Popup></Popup>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};
export default IFramesWithBodyClickListener;
