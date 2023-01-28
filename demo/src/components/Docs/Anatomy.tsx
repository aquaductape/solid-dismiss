import c from "./Popup.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);
import { createSignal } from "solid-js";
import Dismiss from "solid-dismiss";

const JSXCode = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative">
      <button ref={btnEl}>Button</button>
      <Dismiss menuButton={btnEl} open={open} setOpen={setOpen}>
        <div class="menu-popup">
          <p>Popup text!</p>
        </div>
      </Dismiss>
    </div>
  );
};

// HTML Output
// `
// <div style="position: relative">
//   <button>Button</button>
//   <!-- Dismiss container -->
//   <div>
//     <!-- focus sentinel before -->
//     <div style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
//       aria-hidden="true" tabindex="0"></div>
//     <!-- menuPopup -->
//     <div class="menu-popup" tabindex="-1">
//       <p>Popup text!</p>
//     </div>
//     <!-- focus sentinel after -->
//     <div style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
//       aria-hidden="true" tabindex="-1"></div>
//   </div>
// </div>
// `
const HTMLOutput = () => {
  return (
    <div style="position: relative">
      <button>Button</button>
      <div>
        <div
          style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          tabindex="0"
        ></div>
        <div class="menu-popup" tabindex="-1">
          <p>Popup text!</p>
        </div>
        <div
          style="position: fixed; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
          aria-hidden="true"
          tabindex="-1" // if Dismiss is mounted elsewhere then tabindex activated with "0"
        ></div>
      </div>
    </div>
  );
};
