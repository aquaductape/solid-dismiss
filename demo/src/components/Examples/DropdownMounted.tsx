import c from "./Dropdown.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const s = scopeModuleClasses(c);
import Dismiss from "../../../../package/index";
import { createEffect, createSignal } from "solid-js";

const DropdownMounted = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let dropdownEl!: HTMLUListElement;

  const onClickItem = (e: Event) => {
    e.preventDefault();
  };

  createEffect(() => {
    if (open()) {
      const { bottom, left, width } = btnEl.getBoundingClientRect();
      const { scrollX, scrollY } = window;

      dropdownEl.style.position = "absolute";
      dropdownEl.style.top = bottom + scrollY + "px";
      dropdownEl.style.left = left + scrollX + "px";
      dropdownEl.style.width = width + "px";
      dropdownEl.style.zIndex = "100";
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
        cursorKeys
        useAriaExpanded
      >
        <ul class={s("dropdown")} ref={dropdownEl}>
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
// const Dropdown = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//
//   return (
//     <div style="position: relative;">
//       <button ref={btnEl}>Button</button>
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

export default DropdownMounted;
