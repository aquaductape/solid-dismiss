import {
  Component,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const id = "multiple-menu-buttons";

const MultipleMenuButtons = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Multiple Menu Buttons</h2>
      <p>
        There are cases where multiple menu buttons toggle the same dropdown.
      </p>
      <p>
        But only one is active at a time, while the other is not conditionally
        rendered in the DOM.
      </p>
      <p>Here menu buttons will be removed and added to DOM.</p>
      <p>No overlay, page is interactable</p>
      <div class="grid">
        <Popup id={id + "-1"} switchMenuBtnImmediatly />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
      </div>
    </section>
  );
};

const Popup: Component<{
  id: string;
  idx?: number;
  switchMenuBtnImmediatly?: boolean;
}> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  const [switchBtn, setSwitchBtn] = createSignal(true);
  const [btnEl, setBtnEl] = createSignal<HTMLElement | null>(null);
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  createEffect(
    on(
      open,
      () => {
        const timerId = setTimeout(
          () => {
            setSwitchBtn((prev) => !prev);
          },
          props.switchMenuBtnImmediatly ? 0 : 2000
        );

        onCleanup(() => {
          clearTimeout(timerId);
        });
      },
      { defer: true }
    )
  );

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl()!.getBoundingClientRect();

    containerEl.style.position = "absolute";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, 320) + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      {switchBtn() ? (
        <Button open={open()} ref={setBtnEl}>
          menuButton1
        </Button>
      ) : (
        <Button open={open()} ref={setBtnEl}>
          menuButton2
        </Button>
      )}
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
        <div id={id + "-popup"} class="dropdown middle" ref={dropdownEl}>
          <p>
            {!switchBtn() ? (
              "menuButton1 switched with menuButton2"
            ) : (
              <span>
                menuButton1 will switch <br /> with menuButton2 in 2 seconds
              </span>
            )}
          </p>
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <div class="grid" style="grid-template-columns: repeat(3, auto)">
            <Popup
              id={props.id}
              idx={idx + 1}
              switchMenuBtnImmediatly={props.switchMenuBtnImmediatly}
            ></Popup>
            <Popup
              id={props.id}
              idx={idx + 1}
              switchMenuBtnImmediatly={props.switchMenuBtnImmediatly}
            ></Popup>
            <Popup
              id={props.id}
              idx={idx + 1}
              switchMenuBtnImmediatly={props.switchMenuBtnImmediatly}
            ></Popup>
          </div>
        </div>
      </Dismiss>
    </div>
  );
};
export default MultipleMenuButtons;
