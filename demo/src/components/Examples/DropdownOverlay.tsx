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
        Dropdown
      </button>
      <Dismiss
        menuButton={btnEl}
        menuPopup={dropdownEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlay
        cursorKeys
        useAriaExpanded
      >
        <div class={s("dropdown")} ref={dropdownContainerEl}>
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
        </div>
      </Dismiss>
    </>
  );
};

// import Dismiss from "solid-dismiss";
// import { createSignal } from "solid-js";
//
// const Dropdown = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//
//   return (
//     <div style="position: relative;">
//       <button ref={btnEl}>Dropdown</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         useAriaExpanded
//       >
//         <ul class="dropdown">
//           <li>
//             <a class="item" href="#">cat</a>
//           </li>
//           <li>
//             <a class="item" href="#">dog</a>
//           </li>
//           <li>
//             <a class="item" href="#">fish</a>
//           </li>
//         </ul>
//       </Dismiss>
//     </div>
//   );
// };

export default DropdownOverlay;
