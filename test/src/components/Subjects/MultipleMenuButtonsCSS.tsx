import {
  Component,
  createEffect,
  createSignal,
  on,
  onMount,
  Show,
} from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const id = "multiple-menu-buttons-css";

const MultipleMenuButtonsCSS = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Multiple Menu Buttons CSS</h2>
      <p>
        There are cases where multiple menu buttons toggle the same dropdown.
      </p>
      <p>
        But only one is active at a time, while the other is hidden by style
        "display: none;"
      </p>
      <p>Here menu buttons will be toggled by style "display: none;"</p>
      <p>No overlay, page is interactable</p>
      <div class="grid">
        <Popup id={id + "-1"} switchMenuBtnImmediatly />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
      </div>
      <p>focusElementOnOpen is firstChild</p>
      <div class="grid">
        <Popup
          id={id + "-a1"}
          switchMenuBtnImmediatly
          focusFirstChildElementOnOpen
        />
      </div>
    </section>
  );
};
let count = -1;

const Popup: Component<{
  id: string;
  idx?: number;
  switchMenuBtnImmediatly?: boolean;
  focusFirstChildElementOnOpen?: boolean;
}> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  const [switchBtn, setSwitchBtn] = createSignal(true);
  let btn0El!: HTMLButtonElement;
  let btn1El!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;
  count++;

  createEffect(
    on(
      open,
      () => {
        setTimeout(
          () => {
            setSwitchBtn((prev) => !prev);
          },
          props.switchMenuBtnImmediatly ? 0 : 2000
        );
      },
      { defer: true }
    )
  );

  createEffect(() => {
    if (!open()) return;

    const btnBCR = (
      btn0El.offsetHeight ? btn0El : btn1El
    ).getBoundingClientRect();

    containerEl.style.position = "absolute";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, 320) + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      <span style={`${switchBtn() ? "" : "display: none;"}`}>
        <Button
          open={open()}
          ref={btn0El}
          attr={{
            [`data-btn-child-${id}`]: "",
            [`data-btn-child-idx-${count % 3}`]: "",
          }}
        >
          menuButton1
        </Button>
      </span>
      <span style={`${switchBtn() ? "display: none;" : ""}`}>
        <Button
          open={open()}
          ref={btn1El}
          attr={{
            [`data-btn-child-${id}`]: "",
            [`data-btn-child-idx-${idx}`]: "",
          }}
        >
          menuButton2
        </Button>
      </span>
      <Dismiss
        menuButton={[btn0El, btn1El]}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        focusElementOnOpen={
          props.focusFirstChildElementOnOpen ? "firstChild" : undefined
        }
        closeWhenDocumentBlurs
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div id={id + "-popup"} class="dropdown middle" ref={dropdownEl}>
          {!switchBtn() ? (
            "menuButton1 switched with menuButton2"
          ) : (
            <span>
              menuButton1 will switch <br /> with menuButton2 in 2 seconds
            </span>
          )}
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

export default MultipleMenuButtonsCSS;
