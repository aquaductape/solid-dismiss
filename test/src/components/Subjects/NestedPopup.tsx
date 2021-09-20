import { createEffect, createSignal } from "solid-js";
import Dismiss from "../../../../package/index";
import { toggleAnimation } from "../../utils";
import Button from "../Button/Button";

const NestedPopup = () => {
  return (
    <section class="nested">
      <h2>Nested menuPopup</h2>
      <p>No overlay, page is interactable</p>
      <p>
        menuPopups are adjecent sibling to menuButton, this means stacks are
        also direct children
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

  createEffect(() => {
    if (!open()) return;

    containerEl.style.padding = "10px";
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div class="dropdown" style="padding: 10px 25px 25px 25px;">
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <Popup />
          <br />
          <Popup />
          <br />
          <Popup />
        </div>
      </Dismiss>
    </div>
  );
};

export default NestedPopup;
