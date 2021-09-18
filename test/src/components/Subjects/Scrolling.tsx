import { Show, createSignal, onMount, For, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import Button from "../Button/Button";

const Scrolling = () => {
  return (
    <section>
      <h2>Close when scrolling</h2>
      <p>No overlay, page is interactable</p>
      <p>
        Prop: <code>closeWhenScrolling</code>
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
            <For each={Array(10).fill(["cat", "dog", "fish"]).flat()}>
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
          </ol>
        </div>
      </div>
    </section>
  );
};

// const onOpen = (open: boolean, stack: DismissStack) => {
//
// }

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;

  const list = Array(10).fill(["cat", "dog", "fish"]).flat();

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    containerEl.style.position = "absolute";
    containerEl.style.top = `${btnBCR.bottom + window.scrollY}px`;
    containerEl.style.left = `${btnBCR.left + window.scrollX + 20}px`;
    containerEl.style.minWidth = `100px`;
    containerEl.style.maxWidth = `300px`;
    containerEl.style.width = `30vw`;
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Portal>
        <Dismiss
          menuButton={btnEl}
          open={open}
          setOpen={setOpen}
          closeWhenScrolling
          ref={containerEl}
        >
          <ol
            class="dropdown"
            style="max-height: 500px; height: 50vh; overflow: scroll;"
          >
            <li>
              <a class="item" href="javascript:void(0)">
                cat
              </a>
            </li>
            <li>
              <a class="item" href="javascript:void(0)">
                dog
              </a>
            </li>
            <Show when={open()}>
              <Popup />
            </Show>
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
          </ol>
        </Dismiss>
      </Portal>
    </div>
  );
};
export default Scrolling;
