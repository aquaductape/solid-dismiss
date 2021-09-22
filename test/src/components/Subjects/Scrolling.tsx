import { createSignal, For, createEffect } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, getWidth, toggleAnimation } from "../../utils";
import Button from "../Button/Button";

const Scrolling = () => {
  return (
    <section>
      <h2>Close when scrolling</h2>
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
        <Popup />
        <Popup />
        <Popup />
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
              <a
                id="lone-scrolling-item"
                class="item"
                href="javascript:void(0)"
              >
                chicken
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

const Popup = () => {
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
    <div style="display: inline-block; position: relative;">
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenScrolling
        ref={containerEl}
        {...toggleAnimation()}
      >
        <ol
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
          <Popup />
          <br />
          <Popup />
          <br />
          <Popup />
          <br />
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
            <a class="item" href="javascript:void(0)">
              chicken
            </a>
          </li>
        </ol>
      </Dismiss>
    </div>
  );
};
export default Scrolling;
