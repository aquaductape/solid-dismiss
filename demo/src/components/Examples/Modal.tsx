import c from "./Modal.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const s = scopeModuleClasses(c);

import Dismiss from "../../../../package/index";
import { Component, createSignal, createEffect } from "solid-js";

const Modal: Component<{ animated?: boolean }> = ({ animated }) => {
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

  createEffect(() => {
    // Dismiss has does have `removeScrollbar` prop where it just removes the scrollbar, but instead we're customizing the removal where we add margin to prevent visual page "jank".
    if (open()) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const scrollingElement = document.scrollingElement as HTMLElement;
      scrollingElement.style.overflow = "hidden";
      scrollingElement.style.marginRight = scrollbarWidth + "px";
    } else {
      const scrollingElement = document.scrollingElement as HTMLElement;
      scrollingElement.style.overflow = "";
      scrollingElement.style.marginRight = "";
    }
  });

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Modal
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay
        trapFocus
        focusElementOnOpen={() => btnSaveEl}
      >
        <div
          class={s("modal-container")}
          onClick={onClickOverlay}
          role="presentation"
        >
          <div class={s("modal")} role="dialog" aria-modal="true" tabindex="-1">
            <h4>Modal Text</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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
//
// import Dismiss from "solid-dismiss";
// import { createSignal } from "solid-js";
//
// const Modal = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//   let btnSaveEl;
//
//   const onClickClose = () => {
//     setOpen(false);
//   };
//
//   const onClickOverlay = (e) => {
//     if (e.target !== e.currentTarget) return;
//     setOpen(false);
//   };
//
//   return (
//     <div style="position: relative">
//       <button ref={btnEl}>
//         Modal
//       </button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         mount="body"
//         trapFocus
//         focusElementOnOpen={() => btnSaveEl}
//       >
//         <div
//           class="modal-container"
//           onClick={onClickOverlay}
//           role="presentation"
//         >
//           <div class="modal" role="dialog" aria-modal="true" tabindex="-1">
//             <h3>Modal Text</h3>
//             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//
//             <div class="close-btns">
//               <button onClick={onClickClose}>Cancel</button>
//               <button
//                 ref={btnSaveEl}
//                 onClick={onClickClose}
//               >
//                 Save
//               </button>
//             </div>
//
//             <button
//               class="x-btn"
//               aria-label="close modal"
//               onClick={onClickClose}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       </Dismiss>
//     </div>
//   );
// };

export default Modal;
