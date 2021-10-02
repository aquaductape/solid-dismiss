import c from "./Dropdown.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const s = scopeModuleClasses(c);
import Dismiss from "../../../../package/index";
import { createEffect, createSignal } from "solid-js";

const DropdownOverlay = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let dropdownContainerEl!: HTMLDivElement;
  let dropdownEl!: HTMLUListElement;

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
        class={s("dropdown")}
        menuButton={btnEl}
        menuPopup={dropdownEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay
        cursorKeys
        ref={dropdownContainerEl}
      >
        <div class={s("overlay")} onClick={onClickClose}></div>
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
//   let dropdownEl;
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
//         class="dropdown"
//         menuButton={btnEl}
//         menuPopup={dropdownEl}
//         open={open}
//         setOpen={setOpen}
//         mount="body"
//         overlay
//         cursorKeys
//         ref={dropdownContainerEl}
//       >
//         <div class="overlay" onClick={onClickClose}></div>
//         <ul class="dropdown-inner" ref={dropdownEl}>
//           <li><a href="#">cat</a></li>
//           <li><a href="#">dog</a></li>
//           <li><a href="#">fish</a></li>
//         </ul>
//       </Dismiss>
//     </>
//   );
// };

export default DropdownOverlay;
