import { createSignal, createEffect } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import Button from "../Button/Button";

const NestedPopupMounted = () => {
  return (
    <section class="nested">
      <h2>Nested mounted body menuPopup</h2>
      <p>No overlay, page is interactable</p>
      <p>
        menuPopups are <strong>mounted</strong> to the body.
      </p>
      <p>
        Tabbing forwards outside menuPopup should focus on the next tabbable
        item after menuButton.
      </p>
      <p>
        Since there is no overlay, and there's a stack of menuPops opened,
        wherever the click/focus target is, it checks through the
        stack(iterating backwards). If the target is contained withined
        menuPopup item, then any stack "above" it that did not contain it, will
        be dismissed.
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

    containerEl.style.position = "absolute";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, 320) + "px";
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        // stopComponentEventPropagation
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div class="dropdown middle" ref={dropdownEl}>
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
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

export default NestedPopupMounted;
