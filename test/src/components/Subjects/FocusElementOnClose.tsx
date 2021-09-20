import { Show, createSignal, onMount, For, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import { toggleAnimation } from "../../utils";
import Button from "../Button/Button";
import IFrame from "../IFrame";

const FocusElementOnClose = () => {
  return (
    <section>
      <h2>Focus Element on Close/Open</h2>
      <p>Overlay used, page is not interactable</p>
      <p>
        menuPopups are <strong>mounted</strong> to the body.
      </p>
      <p>
        <strong>Focused</strong> button should be focused when menuPopup is
        opened
      </p>
      <p>
        Tab backwards outside of menuButton and <strong>0</strong> should be
        focused
      </p>
      <p>
        Tab forwards outside of menuButton and <strong>4</strong> should be
        focused
      </p>
      <p>
        Click outside of menuButton and <strong>1</strong> should be focused
      </p>
      <p>
        Scroll page and <strong>5</strong> should be focused
      </p>
      <p>
        Press Escape and <strong>6</strong> should be focused
      </p>
      <p>
        Note: iOS and Desktop Safari doesn't focus buttons when tapped, but in
        this test, they are in order to display CSS focus indicator ring for
        clarity
      </p>

      <div class="grid focuse-el-on-close">
        <Button class="btn-0">0</Button>
        <Button class="btn-1">1</Button>
        <Button>2</Button>
        <Popup />
        <Button>3</Button>
        <Button class="btn-4">4</Button>
        <Button class="btn-5">5</Button>
        <Button class="btn-6">6</Button>
      </div>
    </section>
  );
};

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let focusedBtnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    containerEl.style.position = "absolute";
    containerEl.style.top = `${btnBCR.bottom + window.scrollY}px`;
    containerEl.style.left = `${btnBCR.left + window.scrollX}px`;
  });

  return (
    <div style="display: inline-block; position: relative;">
      <Button class="btn-small" open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        overlay={{ class: "overlay" }}
        focusElementOnOpen={() => focusedBtnEl}
        focusElementOnClose={{
          tabBackwards: ".btn-0",
          tabForwards: ".btn-4",
          click: ".btn-1",
          scrolling: ".btn-5",
          escapeKey: ".btn-6",
        }}
        closeWhenScrolling
        mount="body"
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div class="dropdown" style="padding: 10px;">
          <p>
            Some <a href="javascript:void(0)">random</a> text
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <Button>Placeholder</Button>
          <br />
          <Button ref={focusedBtnEl}>
            <strong>Focused</strong>
          </Button>
          <br />
          <Button>Placeholder</Button>
        </div>
      </Dismiss>
    </div>
  );
};
export default FocusElementOnClose;
