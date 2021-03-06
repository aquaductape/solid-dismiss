import { Component, createEffect, createSignal } from "solid-js";
import Dismiss from "../../../../package/index";
import { toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import HiddenTabbableItems from "../HiddenTabbableItems";

const id = "nested-regular";
const NestedPopup = () => {
  return (
    <section id={id} class="nested">
      <h2 tabindex="0">Nested menuPopup</h2>
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
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-1"} />
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-2"} />
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-3"} />
        <HiddenTabbableItems></HiddenTabbableItems>
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

  createEffect(() => {
    if (!open()) return;

    containerEl.style.padding = "10px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: block; position: relative;"
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          id={id + "-popup"}
          class="dropdown"
          style="padding: 10px 25px 25px 25px;"
        >
          <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems></HiddenTabbableItems>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems></HiddenTabbableItems>
            <Popup id={props.id} idx={idx + 1}></Popup>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};

export default NestedPopup;
