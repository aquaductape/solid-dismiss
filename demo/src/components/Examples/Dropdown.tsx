import c from "./Dropdown.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);
import { createSignal } from "solid-js";
import Dismiss from "solid-dismiss";

const Dropdown = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  const onClickItem = (e: Event) => {
    e.preventDefault();
  };

  return (
    <div style="position: relative;">
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss menuButton={btnEl} open={open} setOpen={setOpen} cursorKeys>
        <ul class={s("dropdown")}>
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
    </div>
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
//         cursorKeys
//       >
//         <ul class="dropdown">
//           <li><a href="#">cat</a></li>
//           <li><a href="#">dog</a></li>
//           <li><a href="#">fish</a></li>
//         </ul>
//       </Dismiss>
//     </div>
//   );
// };

export default Dropdown;
