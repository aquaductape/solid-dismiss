import { createSignal, createEffect, Component } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import HiddenTabbableItems from "../HiddenTabbableItems";

const id = "nested-mounted";
const NestedPopupMounted = () => {
  return (
    <section id={id} class="nested">
      <h2 tabindex="0">Nested mounted body menuPopup</h2>
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
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-1"} />
        <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
        <Popup id={id + "-2"} />
        <HiddenTabbableItems></HiddenTabbableItems>
        <Popup id={id + "-3"} />
        <HiddenTabbableItems></HiddenTabbableItems>
      </div>
    </section>
  );
};

const Popup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
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
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        closeWhenDocumentBlurs
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          id={id + "-popup"}
          class="dropdown middle"
          ref={dropdownEl}
          tabindex="-1"
        >
          <HiddenTabbableItems></HiddenTabbableItems>
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems></HiddenTabbableItems>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems></HiddenTabbableItems>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <HiddenTabbableItems type="emptyNested"></HiddenTabbableItems>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};

export default NestedPopupMounted;
