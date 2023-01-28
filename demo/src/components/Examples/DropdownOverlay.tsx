import c from "./Dropdown.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);
import { createEffect, createSignal } from "solid-js";
import Dismiss from "solid-dismiss";

export const DropdownOverlay = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let dropdownContainerEl!: HTMLDivElement;

  const onClickItem = (e: Event) => {
    e.preventDefault();
  };

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    if (open()) {
      const { bottom, left, width } = btnEl.getBoundingClientRect();
      const { scrollX, scrollY } = window;

      dropdownContainerEl.style.position = "absolute";
      dropdownContainerEl.style.top = bottom + scrollY + "px";
      dropdownContainerEl.style.left = left + scrollX + "px";
      dropdownContainerEl.style.width = width + "px";
      dropdownContainerEl.style.zIndex = "100";
    }
  });

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay
        cursorKeys
        ref={dropdownContainerEl}
      >
        <div class={s("dropdown", "top")}>
          <div class={s("overlay")} onClick={onClickClose}></div>
          <ul class={s("dropdown-inner")}>
            <li>
              <a class={s("item")} href="#" onClick={onClickItem}>
                cat
              </a>
            </li>
            <li>
              <a class={s("item")} href="#" onClick={onClickItem}>
                dog
              </a>
            </li>
            <li>
              <a class={s("item")} href="#" onClick={onClickItem}>
                fish
              </a>
            </li>
          </ul>
        </div>
      </Dismiss>
    </>
  );
};

export const DropdownOverlayElement = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let dropdownContainerEl!: HTMLDivElement;
  let dropdownEl!: HTMLUListElement;

  const onClickItem = (e: Event) => {
    e.preventDefault();
  };

  createEffect(() => {
    if (open()) {
      const { bottom, left, width } = btnEl.getBoundingClientRect();
      const { scrollX, scrollY } = window;

      dropdownContainerEl.style.position = "absolute";
      dropdownContainerEl.style.top = bottom + scrollY + "px";
      dropdownContainerEl.style.left = left + scrollX + "px";
      dropdownContainerEl.style.width = width + "px";
    }
  });

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        class={s("dropdown")}
        menuButton={btnEl}
        menuPopup={dropdownEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlayElement={{ class: s("overlay-el") }}
        cursorKeys
        ref={dropdownContainerEl}
      >
        <ul class={s("dropdown-inner")} ref={dropdownEl}>
          <li>
            <a class={s("item")} href="#" onClick={onClickItem}>
              cat
            </a>
          </li>
          <li>
            <a class={s("item")} href="#" onClick={onClickItem}>
              dog
            </a>
          </li>
          <li>
            <a class={s("item")} href="#" onClick={onClickItem}>
              fish
            </a>
          </li>
        </ul>
      </Dismiss>
    </>
  );
};

// import Dismiss from "solid-dismiss";
// import { createSignal } from "solid-js";
//
// const DropdownOverlay = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//   let dropdownContainerEl;
//
//   const onClickClose = () => {
//     setOpen(false);
//   };
//
//   createEffect(() => {
//     if (open()) {
//       const { bottom, left, width } = btnEl.getBoundingClientRect();
//       const { scrollX, scrollY } = window;
//
//       dropdownContainerEl.style.position = "absolute";
//       dropdownContainerEl.style.top = bottom + scrollY + "px";
//       dropdownContainerEl.style.left = left + scrollX + "px";
//       dropdownContainerEl.style.width = width + "px";
//       dropdownContainerEl.style.zIndex = "100";
//     }
//   });
//
//   return (
//     <>
//       <button ref={btnEl}>Button</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         mount="body"
//         overlay
//         cursorKeys
//         ref={dropdownContainerEl}
//       >
//         <div class="dropdown">
//           <div class="overlay" onClick={onClickClose}></div>
//           <ul class="dropdown-inner">
//             <li><a href="#">cat</a></li>
//             <li><a href="#">dog</a></li>
//             <li><a href="#">fish</a></li>
//           </ul>
//         </div>
//       </Dismiss>
//     </>
//   );
// };
//
// import Dismiss from "solid-dismiss";
// import { createSignal } from "solid-js";
//
// const DropdownOverlay = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//   let dropdownEl;
//
//   createEffect(() => {
//     if (open()) {
//       const { bottom, left, width } = btnEl.getBoundingClientRect();
//       const { scrollX, scrollY } = window;
//
//       dropdownEl.style.position = "absolute";
//       dropdownEl.style.top = bottom + scrollY + "px";
//       dropdownEl.style.left = left + scrollX + "px";
//       dropdownEl.style.width = width + "px";
//       dropdownEl.style.zIndex = "100";
//     }
//   });
//
//   return (
//     <>
//       <button ref={btnEl}>Button</button>
//       <Dismiss
//         class="dropdown"
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         mount="body"
//         overlayElement={{class: "overlay"}}
//         cursorKeys
//         ref={dropdownEl}
//       >
//         <ul class="dropdown-inner">
//           <li><a href="#">cat</a></li>
//           <li><a href="#">dog</a></li>
//           <li><a href="#">fish</a></li>
//         </ul>
//       </Dismiss>
//     </>
//   );
// };
