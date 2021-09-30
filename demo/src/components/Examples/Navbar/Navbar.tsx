import c from "./Navbar.module.scss";

import { scopeModuleClasses } from "../../../utils/scopModuleClasses";
import "./bootstrap.scss";
import Dismiss from "../../../../../package/index";
import { createSignal } from "solid-js";
import { onMount } from "solid-js";

const s = scopeModuleClasses(c);

function loadBootstrap() {
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    script.integrity =
      "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    script.crossOrigin = "anonymous";

    //     const link = document.createElement("link");
    //     link.href =
    //       "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    //     link.rel = "stylesheet";
    //     link.integrity =
    //       "sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC";
    //     link.crossOrigin = "anonymous";
    //
    //     document.head.appendChild(link);
    document.head.appendChild(script);
  });
}

const Navbar = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let bsCollapse: any;

  onMount(() => {
    loadBootstrap();
    setTimeout(() => {
      const menuToggle = document.getElementById("navbarNav");
      // @ts-ignore
      bsCollapse = new window.bootstrap.Collapse(menuToggle, { toggle: false });
    }, 300);
  });

  const onOpen = (open: boolean) => {
    if (!open) {
      console.log("close!!!");
      bsCollapse.toggle();
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
// import { createSignal } from "solid-js";
//
// const Popup = () => {
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//
//   return (
//     <div style="position: relative;">
//       <button ref={btnEl}>Open</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//       >
//         <div class="popup">
//           <p>Popup text!</p>
//           <p>Lorem, <a href="#">ipsum</a> dolor.</p>
//         </div>
//       </Dismiss>
//     </div>
//   );
// };

export default Navbar;
