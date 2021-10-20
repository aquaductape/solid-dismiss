import c from "./MultipleButtons.module.scss";
import { scopeModuleClasses } from "../../../utils/scopModuleClasses";
import { createSignal, onMount, Show } from "solid-js";
import { Collapse } from "bootstrap";
import Dismiss from "solid-dismiss";
import SimpleBar from "simplebar";

const s = scopeModuleClasses(c);

const MultipleButtons = () => {
  const [open, setOpen] = createSignal(false);
  const [btnEl, setBtnEl] = createSignal<HTMLButtonElement | null>(null);
  let navCollapse: Collapse;
  let [showNavButton, setShowNavButton] = createSignal(true);
  let navEl!: HTMLElement;
  let scrollableEl!: HTMLDivElement;

  onMount(() => {
    const navbarNav = document.getElementById("navbarNav2")!;
    navCollapse = new Collapse(navbarNav, { toggle: false });

    const el = new SimpleBar(scrollableEl, { autoHide: false });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { isIntersecting } = entry;
          setShowNavButton(isIntersecting);
        });
      },
      { root: el.getScrollElement() }
    );

    observer.observe(navEl);

    setTimeout(() => {
      scrollableEl.classList.add("border-radius");
    });
  });

  const onOpen = (open: boolean) => {
    if (!open) {
      navCollapse.toggle();
    }
  };

  return (
    <div class={s("container")}>
      <div
        class={s("scrollable-page")}
        ref={scrollableEl}
        data-simplebar-match-webkit
      >
        <div class={s("page")}>
          <nav ref={navEl} class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
              <a
                class="navbar-brand"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Navbar
              </a>
              <Show when={showNavButton()}>
                <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav2"
                  aria-controls="navbarNav2"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  ref={setBtnEl}
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
              </Show>
            </div>
          </nav>
          <Dismiss
            class={
              s("dropdown") + " navbar-dark bg-dark collapse navbar-collapse"
            }
            id="navbarNav2"
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
            </ul>
          </Dismiss>

          <div class={s("main")}>
            <p>Scroll down to reveal second menu button</p>
          </div>
        </div>
      </div>
      <Show when={!showNavButton()}>
        <div class={s("floating-btn")}>
          <button
            class={"navbar-dark bg-dark navbar-toggler "}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav2"
            aria-controls="navbarNav2"
            aria-expanded="false"
            aria-label="Toggle navigation"
            ref={setBtnEl}
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </Show>
    </div>
  );
};

// import Dismiss from "solid-dismiss";
// import { createSignal, onMount, Show } from "solid-js";
// import { Collapse } from "bootstrap";
//
// const MultipleMenuButtons = () => {
//   const [open, setOpen] = createSignal(false);
//   const [btnEl, setBtnEl] = createSignal(null);
//   let navCollapse;
//   let [showNavButton, setShowNavButton] = createSignal(true);
//   let navEl;
//
//   onMount(() => {
//     const navbarNav = document.getElementById("navbarNav");
//     navCollapse = new Collapse(navbarNav, { toggle: false });
//
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const { isIntersecting } = entry;
//           setShowNavButton(isIntersecting);
//         });
//       },
//     );
//
//     observer.observe(navEl);
//
//   });
//
//   const onOpen = (open) => {
//     if (!open) {
//       navCollapse.toggle();
//     }
//   };
//
//   return (
//     <div class="page">
//       <nav ref={navEl} class="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div class="container-fluid">
//           <a class="navbar-brand" href="#">Navbar</a>
//           <Show when={showNavButton()}>
//             <button
//               class="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarNav"
//               aria-controls="navbarNav"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//               ref={setBtnEl}
//             >
//               <span class="navbar-toggler-icon"></span>
//             </button>
//           </Show>
//         </div>
//       </nav>
//       <Dismiss
//         class="navbar-dark bg-dark collapse navbar-collapse"
//         id="navbarNav"
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         onOpen={onOpen}
//         show
//       >
//         <ul class="navbar-nav">
//           <li class="nav-item">
//             <a class="nav-link active" href="#">Home</a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link" href="#">Features</a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link" href="#">Pricing</a>
//           </li>
//         </ul>
//       </Dismiss>
//
//       <div class="main">
//         <p>Scroll down to reveal second menu button</p>
//       </div>
//       <Show when={!showNavButton()}>
//         <div class="floating-btn">
//           <button
//             class="navbar-dark bg-dark navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//             ref={setBtnEl}
//           >
//             <span class="navbar-toggler-icon"></span>
//           </button>
//         </div>
//       </Show>
//     </div>
//   );
// };

export default MultipleButtons;
