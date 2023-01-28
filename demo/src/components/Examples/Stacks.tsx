import c from "./Modal.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);

import { createSignal } from "solid-js";
import Dismiss, { OnOpenHandler } from "solid-dismiss";

let modalStep = -1;

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

const Stacks = () => {
  return (
    <div class="sibling-nested-buttons">
      <Modal />
      <Popup />
    </div>
  );
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

  const onOpen: OnOpenHandler = (open, { dismissStack }) => {
    if (open) {
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
    }
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
        Modal
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        onOpen={onOpen}
        modal
        onToggleScrollbar={{
          onRemove: onRemoveScrollbar,
          onRestore: onRestoreScrollbar,
        }}
        focusElementOnOpen={() => modalEl}
        animation={{
          name: "fade-modal",
          appendToElement: `.${s("modal-container")}`,
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
            <Stacks />
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

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let popupEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  const onOpen: OnOpenHandler = (open, { dismissStack }) => {
    if (open) {
      if (dismissStack.length === 1) {
        // @ts-ignore
        popupEl.children[1]!.style.transform = "none";
      }

      let { bottom, left, width } = btnEl.getBoundingClientRect();
      const { scrollX, scrollY } = window;

      if (document.body.clientWidth <= 375) {
        left = 50;
        //@ts-ignore
        popupEl.children[1].style.transform = "none";
      }

      popupEl.style.position = "absolute";
      popupEl.style.top = bottom + scrollY + "px";
      popupEl.style.left = left + scrollX + "px";
      popupEl.style.pointerEvents = "none";
      popupEl.style.zIndex = "1000";
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
        focusElementOnClose="menuButton"
        animation={{
          name: "fade",
        }}
        mount="body"
        ref={popupEl}
      >
        <div class={s("popup")}>
          <h4>Popup Text</h4>
          <p>
            Lorem{" "}
            <a class="focusable" href="javascript:void(0)">
              ipsum
            </a>
            .
          </p>
          <Stacks />
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
      </Dismiss>
    </>
  );
};

// import Dismiss from "solid-dismiss";
// import { createSignal } from "solid-js";
//
// const Nested = () => {
//   return (
//     <>
//       <Modal/>
//       <Popup/>
//     </>
//   );
// };
//
// const Modal = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//   let modalEl;
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
//   const onRemoveScrollbar = () => {
//     const scrollbarWidth =
//       window.innerWidth - document.documentElement.clientWidth;
//     const scrollingElement = document.scrollingElement as HTMLElement;
//     const navbar = document.getElementById("navbar-content")!;
//     scrollingElement.style.overflow = "hidden";
//     scrollingElement.style.marginRight = scrollbarWidth + "px";
//     navbar.style.marginRight = scrollbarWidth + "px";
//   };
//
//   const onRestoreScrollbar = () => {
//     const scrollingElement = document.scrollingElement as HTMLElement;
//     const navbar = document.getElementById("navbar-content")!;
//     scrollingElement.style.overflow = "";
//     scrollingElement.style.marginRight = "";
//     navbar.style.marginRight = "";
//   };
//
//
//   return (
//     <>
//       <button ref={btnEl}>Modal</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         modal
//         focusElementOnOpen={() => modalEl}
//         onToggleScrollbar={{
//           onRemove: onRemoveScrollbar,
//           onRestore: onRestoreScrollbar,
//         }}
//         animation={{
//           name: "fade-modal",
//           appendToElement: ".modal-container",
//         }}
//       >
//         <div
//           class="modal-container"
//           onClick={onClickOverlay}
//           role="presentation"
//         >
//           <div
//             class="modal"
//             role="dialog"
//             aria-modal="true"
//             tabindex="-1"
//             ref={modalEl}
//           >
//             <h4>Modal Text</h4>
//             <p>Lorem <a href="#">ipsum</a>.</p>
//             <Nested/>
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
//     </>
//   );
// };
//
// const Popup = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//   let popupEl;
//
//   const onClickClose = () => {
//     setOpen(false);
//   };
//
//   const onOpen = (open) => {
//     if (open) {
//       const { bottom, left } = btnEl.getBoundingClientRect();
//       const { scrollX, scrollY } = window;
//
//       popupEl.style.position = "absolute";
//       popupEl.style.top = bottom + scrollY + "px";
//       popupEl.style.left = left + scrollX + "px";
//       popupEl.style.zIndex = "100";
//     }
//   };
//
//   return (
//     <>
//       <button ref={btnEl}>Popup</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         onOpen={onOpen}
//         focusElementOnClose="menuButton"
//         animation={{
//           name: "fade",
//         }}
//         mount="body"
//         ref={popupEl}
//       >
//         <div class="popup">
//           <h4>Popup Text</h4>
//           <p>Lorem <a href="#">ipsum</a>.</p>
//           <Nested/>
//           <button
//             class="x-btn"
//             aria-label="close modal"
//             onClick={onClickClose}
//           >
//             ✕
//           </button>
//         </div>
//       </Dismiss>
//     </>
//   );
// };

export default Stacks;
