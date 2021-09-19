import { createEffect, createComputed, createSignal } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, reflow, toggleAnimation } from "../../utils";
import Button from "../Button/Button";

const NestedOverlay = () => {
  return (
    <section class="nested">
      <h2>Nested overlay menuPopup</h2>
      <p>Overlay used, page is not interactable</p>
      <p>
        menuPopups are <strong>mounted</strong> to the body.
      </p>
      <p>
        Tabbing forwards outside menuPopup should focus on the next tabbable
        item after menuButton.
      </p>
      <p>
        Click on outside(which would be overlay, that covers the page), should
        only close that current stack
      </p>

      <div class="grid">
        <Popup />
        <Popup />
        <Popup />
      </div>
    </section>
  );
};

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    console.log({ btnBCR });
    containerEl.style.position = "absolute";
    // containerEl.style.width = btnBCR.width + "px";
    // reflow();
    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, 310) + "px";
  });

  return (
    <div
      style="display: inline-block; position: relative;"
      onClick={() => console.log("click container")}
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay={{ class: "overlay" }}
        closeWhenMenuButtonIsTabbed
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div class="dropdown" ref={dropdownEl}>
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

export default NestedOverlay;
