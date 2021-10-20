import c from "./Navbar.module.scss";

import { scopeModuleClasses } from "../../../utils/scopModuleClasses";
import { createSignal, onMount } from "solid-js";
import { Collapse } from "bootstrap";
import Dismiss from "solid-dismiss";

const s = scopeModuleClasses(c);

const Navbar = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let navCollapse: Collapse;

  onMount(() => {
    const navbarNav = document.getElementById("navbarNav")!;
    navCollapse = new Collapse(navbarNav, { toggle: false });
  });

  const onOpen = (open: boolean) => {
    if (!open) {
      navCollapse.toggle();
    }
  };

  return (
    <div class={s("page")}>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#" onClick={(e) => e.preventDefault()}>
            Navbar
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            ref={btnEl}
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <Dismiss
            class="collapse navbar-collapse"
            id="navbarNav"
            menuButton={btnEl}
            open={open}
            setOpen={setOpen}
            onOpen={onOpen}
            show
          >
            <ul class="navbar-nav">
              <li class="nav-item">
                <a
                  class="nav-link active"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Features
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Pricing
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link disabled"
                  href="#"
                  tabindex="-1"
                  aria-disabled="true"
                >
                  Disabled
                </a>
              </li>
            </ul>
          </Dismiss>
        </div>
      </nav>
    </div>
  );
};

// import Dismiss from "solid-dismiss";
// import { createSignal, onMount } from "solid-js";
// import { Collapse } from "bootstrap";
//
// const Navbar = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//   let navCollapse;
//
//   onMount(() => {
//     const navbarNav = document.getElementById("navbarNav");
//     navCollapse = new Collapse(navbarNav, { toggle: false });
//   });
//
//   const onOpen = (open) => {
//     if (!open) {
//       navCollapse.toggle();
//     }
//   };
//
//   return (
//     <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div class="container-fluid">
//         <a class="navbar-brand" href="#">Navbar</a>
//         <button
//           class="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//           ref={btnEl}
//         >
//           <span class="navbar-toggler-icon"></span>
//         </button>
//
//         <Dismiss
//           class="collapse navbar-collapse"
//           id="navbarNav"
//           menuButton={btnEl}
//           open={open}
//           setOpen={setOpen}
//           onOpen={onOpen}
//           show
//         >
//           <ul class="navbar-nav">
//             <li class="nav-item">
//               <a class="nav-link active" href="#">Home</a>
//             </li>
//             <li class="nav-item">
//               <a class="nav-link" href="#">Features</a>
//             </li>
//             <li class="nav-item">
//               <a class="nav-link" href="#">Pricing</a>
//             </li>
//             <li class="nav-item">
//               <a
//                 class="nav-link disabled"
//                 href="#"
//                 tabindex="-1"
//                 aria-disabled="true"
//               >
//                 Disabled
//               </a>
//             </li>
//           </ul>
//         </Dismiss>
//       </div>
//     </nav>
//   );
// };

export default Navbar;
