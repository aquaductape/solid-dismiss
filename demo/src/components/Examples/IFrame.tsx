import c from "./Popup.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);
import { createSignal } from "solid-js";
import Dismiss from "solid-dismiss";

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative;">
      <button class="btn-primary" ref={btnEl}>
        Popup
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        // animation={{ name: "popup" }}
      >
        <div class={s("dropdown")}>
          <p>Popup text!</p>
          <p>
            Lorem,{" "}
            <a class="focusable" href="javascript:void(0);">
              ipsum
            </a>{" "}
            dolor.
          </p>
        </div>
      </Dismiss>
    </div>
  );
};

// import Dismiss from "solid-dismiss";
// import { createSignal } from "solid-js";
//
// const Popup = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//
//   return (
//     <div style="position: relative;">
//       <button ref={btnEl}>Popup</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//       >
//         <div class="dropdown">
//           <p>Popup text!</p>
//           <p>Lorem, <a href="#">ipsum</a> dolor.</p>
//         </div>
//       </Dismiss>
//     </div>
//   );
// };

export default Popup;
