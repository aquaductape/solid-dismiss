import {
  createEffect,
  createComputed,
  createSignal,
  Component,
} from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, getWidth, reflow, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import MiniForm from "../MiniForm/MiniForm";

const id = "nested-overlay";
const NestedOverlay = () => {
  return (
    <section id={id} class="nested">
      <h2 tabindex="0">Nested overlay menuPopup</h2>
      <p>Overlay used, page is not interactable</p>
      <p>closeWhenDocumentBlurs=true</p>
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
        <Popup id={id + "-1"} />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
      </div>
    </section>
  );
};

const Popup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  const id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  createEffect(() => {
    if (!open()) return;

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
        // modal
        // doesn't work unless modal prop is included
        // closeWhenOverlayClicked={false}
        overlayElement={{ class: "overlay" }}
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        closeWhenDocumentBlurs
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div id={id + "-popup"} class="dropdown middle" ref={dropdownEl}>
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
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

export default NestedOverlay;
