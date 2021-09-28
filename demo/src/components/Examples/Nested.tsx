import c from "./Modal.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const s = scopeModuleClasses(c);

import Dismiss, { OnOpenHandler } from "../../../../package/index";
import { Component, createSignal, createEffect } from "solid-js";

let modalStep = -1;
let popupCount = 0;
const Nested = () => {
  return (
    <div class="sibling-nested-buttons">
      <Modal></Modal>
      <Popup></Popup>
    </div>
  );
};

const getPointFromCircle = (
  step: number,
  {
    h,
    k,
    radius,
    steps,
  }: { radius: number; steps: number; h: number; k: number }
) => {
  const theta = ((2 * Math.PI) / steps) * step;
  const x = h + radius * Math.cos(theta);
  const y = k - radius * Math.sin(theta);

  return { x, y };
};

const Modal = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let modalEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickOverlay = (e: Event) => {
    if (e.target !== e.currentTarget) return;
    setOpen(false);
  };

  const onOpen: OnOpenHandler = (open, { dismissStack, uniqueId }) => {
    if (open) {
      if (dismissStack.length <= 1) {
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        const scrollingElement = document.scrollingElement as HTMLElement;
        scrollingElement.style.overflow = "hidden";
        scrollingElement.style.marginRight = scrollbarWidth + "px";
      }

      modalStep = (modalStep + 1) % 10;

      const { x, y } = getPointFromCircle(modalStep, {
        radius: 2,
        steps: 10,
        h: 0,
        k: 23,
      });
      modalEl.style.top = `-${y}vh`;
      modalEl.style.left = `${x}vw`;
    } else {
      --modalStep;
      if (modalStep < 0) modalStep = -1;
      // if there happened to be a stack of modals, we don't want the scrollbar to return when topmost modal is removed while there's more modals below.
      if (dismissStack.length) return;

      setTimeout(() => {
        const scrollingElement = document.scrollingElement as HTMLElement;
        scrollingElement.style.overflow = "";
        scrollingElement.style.marginRight = "";
      }, 300);
    }
  };

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Modal
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        onOpen={onOpen}
        mount="body"
        trapFocus
        overlay
        focusElementOnClose="menuButton"
        focusElementOnOpen={() => modalEl}
        animation={{
          name: "fade-modal",
        }}
      >
        <div
          class={s("modal-container")}
          onClick={onClickOverlay}
          role="presentation"
        >
          <div
            class={s("modal")}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            ref={modalEl}
          >
            <h4>Modal Text</h4>
            <p>
              Lorem{" "}
              <a class="focusable" href="javascript:void(0)">
                ipsum
              </a>
              .
            </p>
            <Nested></Nested>
            <button
              class={s("x-btn")}
              aria-label="close modal"
              onClick={onClickClose}
            >
              <div className={s("inner")}>
                <div></div>
                <div></div>
              </div>
            </button>
          </div>
        </div>
      </Dismiss>
    </>
  );
};

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  const onOpen: OnOpenHandler = (open, { dismissStack }) => {
    if (open) {
      if (dismissStack.length === 1) {
        dropdownEl.style.transform = "none";
      }

      const { bottom, left, width } = btnEl.getBoundingClientRect();
      const { scrollX, scrollY } = window;

      dropdownEl.style.position = "absolute";
      dropdownEl.style.top = bottom + scrollY + "px";
      dropdownEl.style.left = left + scrollX + "px";
      dropdownEl.style.zIndex = "100";
    }
  };

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Popup
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        onOpen={onOpen}
        animation={{
          name: "fade",
        }}
        mount="body"
      >
        <div class={s("popup")} ref={dropdownEl}>
          <h4>Popup Text</h4>
          <p>
            Lorem{" "}
            <a class="focusable" href="javascript:void(0)">
              ipsum
            </a>
            .
          </p>
          <Nested></Nested>
          <button
            class={s("x-btn")}
            aria-label="close modal"
            onClick={onClickClose}
          >
            <div className={s("inner")}>
              <div></div>
              <div></div>
            </div>
          </button>
        </div>
      </Dismiss>
    </>
  );
};

export default Nested;
