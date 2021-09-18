import { Show, createSignal, onMount, For, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import Button from "../Button/Button";
import IFrame from "../IFrame";

const IFramesWithBodyClickListener = () => {
  return (
    <section>
      <h2>menuPopup with iframes(body click listener)</h2>
      <p>No overlay, page is interactable</p>
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
    containerEl.style.top = `${btnBCR.bottom + window.scrollY}px`;
    containerEl.style.left = `${btnBCR.left + window.scrollX + 20}px`;
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Portal>
        <Dismiss
          menuButton={btnEl}
          open={open}
          setOpen={setOpen}
          ref={containerEl}
        >
          <div class="dropdown">
            <Show when={open()}>
              <IFrame bodyHasClickListener></IFrame>

              <Popup></Popup>
              <br />
              <Popup></Popup>
              <br />
              <Popup></Popup>
            </Show>
          </div>
        </Dismiss>
      </Portal>
    </div>
  );
};
export default IFramesWithBodyClickListener;
