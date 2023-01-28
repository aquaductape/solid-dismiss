import c from "./Modal.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);

import { createSignal } from "solid-js";
import Dismiss from "solid-dismiss";

const ModalToggleScrollbar = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let btnSaveEl!: HTMLButtonElement;

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickOverlay = (e: Event) => {
    if (e.target !== e.currentTarget) return;
    setOpen(false);
  };

  const onRemoveScrollbar = () => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const scrollingElement = document.scrollingElement as HTMLElement;
    const navbar = document.getElementById("navbar-content")!;
    scrollingElement.style.overflow = "hidden";
    scrollingElement.style.marginRight = scrollbarWidth + "px";
    navbar.style.marginRight = scrollbarWidth + "px";
  };

  const onRestoreScrollbar = () => {
    const scrollingElement = document.scrollingElement as HTMLElement;
    const navbar = document.getElementById("navbar-content")!;
    scrollingElement.style.overflow = "";
    scrollingElement.style.marginRight = "";
    navbar.style.marginRight = "";
  };

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        modal
        onToggleScrollbar={{
          onRemove: onRemoveScrollbar,
          onRestore: onRestoreScrollbar,
        }}
        focusElementOnOpen={() => btnSaveEl}
      >
        <div
          class={s("modal-container")}
          onClick={onClickOverlay}
          role="presentation"
        >
          <div class={s("modal")} role="dialog" aria-modal="true" tabindex="-1">
            <h4>Modal Text</h4>
            <p>
              Lorem{" "}
              <a class="focusable" href="javascript:void()">
                ipsum
              </a>{" "}
              dolor sit amet consectetur adipisicing elit.
            </p>
            <div class={s("close-btns")}>
              <button class="btn-secondary" onClick={onClickClose}>
                Cancel
              </button>
              <button
                class="btn-secondary"
                ref={btnSaveEl}
                onClick={onClickClose}
              >
                Save
              </button>
            </div>
            <button
              class={s("x-btn")}
              aria-label="close modal"
              onClick={onClickClose}
            >
              <div class={s("inner")}>
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

// // ...
//
// const onRemoveScrollbar = () => {
//   const scrollbarWidth =
//     window.innerWidth - document.documentElement.clientWidth;
//   const scrollingElement = document.scrollingElement;
//   const navbar = document.getElementById("navbar-content");
//   scrollingElement.style.overflow = "hidden";
//   scrollingElement.style.marginRight = scrollbarWidth + "px";
//   navbar.style.marginRight = scrollbarWidth + "px";
// };
//
// const onRestoreScrollbar = () => {
//   const scrollingElement = document.scrollingElement;
//   const navbar = document.getElementById("navbar-content");
//   scrollingElement.style.overflow = "";
//   scrollingElement.style.marginRight = "";
//   navbar.style.marginRight = "";
// };
//
// return (
//   <Dismiss
//
//     // ...
//
//     onToggleScrollbar={{
//       onRemove: onRemoveScrollbar,
//       onRestore: onRestoreScrollbar,
//     }}
//   >
//     {/* ... */}
//   </Dismiss>
// );

export default ModalToggleScrollbar;
