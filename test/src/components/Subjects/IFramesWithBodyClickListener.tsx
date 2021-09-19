import { Show, createSignal, onMount, For, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import { getLeft, reflow, toggleAnimation } from "../../utils";
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

      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr">
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

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    containerEl.style.position = "absolute";
    reflow();
    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left =
      getLeft(btnBCR, containerEl.getBoundingClientRect().width) + "px";
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        {...toggleAnimation()}
        ref={containerEl}
      >
        <div class="dropdown">
          <div style="display: flex;">
            <IFrame bodyHasClickListener></IFrame>
            <IFrame bodyHasClickListener></IFrame>
          </div>
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
