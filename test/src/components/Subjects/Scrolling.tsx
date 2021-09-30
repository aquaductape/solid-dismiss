import { createSignal, For, createEffect, Component } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, getWidth, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const id = "scrolling";
const Scrolling = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Close when scrolling</h2>
      <p>No overlay, page is interactable.</p>
      <p>
        menuPopups are <strong>mounted</strong> to the body.
      </p>
      <p>
        Tabbing forwards outside menuPopup should focus on the next tabbable
        item after menuButton.
      </p>
      <p>
        Close menuPopup by scrolling scrollable containers that are not inside
        menuPopup.
      </p>
      <p>Scrolling to close must be initiated by user</p>
      <p style="margin-bottom: 35px;">
        Scrolling run by javascript or page reflow should not close menuPopup
      </p>

      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr">
        <Popup id={id + "-1"} />
        <Popup id={id + "-2"} />
        <Popup id={id + "-3"} />
        <div class="lone-scrolling">
          <ol>
            <For each={Array(8).fill(["cat", "dog", "fish"]).flat()}>
              {(item) => {
                return (
                  <li>
                    <a class="item" href="javascript:void(0)">
                      {item}
                    </a>
                  </li>
                );
              }}
            </For>
            <li>
              <a class="item scrolling-item" href="javascript:void(0)">
                chicken
              </a>
            </li>
          </ol>
        </div>
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

  const list = Array(8).fill(["cat", "dog", "fish"]).flat();

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    containerEl.style.position = "absolute";
    containerEl.style.minWidth = `100px`;
    containerEl.style.maxWidth = `300px`;
    containerEl.style.width = `30vw`;

    // reflow();
    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left =
      getLeft(
        btnBCR,
        getWidth({ viewportUnit: 30, minWidth: 100, maxWidth: 300 })
      ) + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenScrolling
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <ol
          id={id + "-popup"}
          class="dropdown"
          style="max-height: 300px; height: 40vh; overflow: scroll;"
        >
          <For each={Array(2).fill(["cat", "dog", "fish"]).flat()}>
            {(item) => {
              return (
                <li>
                  <a class="item" href="javascript:void(0)">
                    {item}
                  </a>
                </li>
              );
            }}
          </For>
          <div>
            <Popup id={props.id} idx={idx + 1}></Popup>
            <br />
            <Popup id={props.id} idx={idx + 1}></Popup>
            <br />
            <Popup id={props.id} idx={idx + 1}></Popup>
          </div>
          <input type="text" placeholder="text input..." class="input-test" />
          <For each={list}>
            {(item) => {
              return (
                <li>
                  <a class="item" href="javascript:void(0)">
                    {item}
                  </a>
                </li>
              );
            }}
          </For>
          <li>
            <a class="item scrolling-item" href="javascript:void(0)">
              chicken
            </a>
          </li>
        </ol>
      </Dismiss>
    </div>
  );
};
export default Scrolling;
