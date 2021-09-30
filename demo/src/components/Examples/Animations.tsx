import c from "./Popup.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const s = scopeModuleClasses(c);
import Dismiss from "../../../../package/index";
import { createSignal } from "solid-js";

export const PopupWithCSSAnimation = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative; z-index: 5">
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        animation={{ name: "fade" }}
      >
        <div class={s("popup")}>
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

export const PopupWithJSAnimation = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative; z-index: 5">
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        animation={{
          onEnter: (el, done) => {
            const a = el.animate(
              [
                {
                  transform: "translateY(25px)",
                  opacity: 0,
                },
                {
                  transform: "translateY(0)",
                  opacity: 1,
                },
              ],
              { duration: 200 }
            );

            a.onfinish = () => done();
          },
          onExit: (el, done) => {
            const animation = el.animate(
              [
                {
                  transform: "translateY(0)",
                  opacity: 1,
                },
                {
                  transform: "translateY(25px)",
                  opacity: 0,
                },
              ],
              { duration: 200 }
            );

            animation.onfinish = () => done();
          },
        }}
      >
        <div class={s("popup")}>
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

// const Popup = () => {
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
//         animation={{
//           onEnter: (el, done) => {
//             const a = el.animate(
//               [
//                 {
//                   transform: "translateY(25px)",
//                   opacity: 0,
//                 },
//                 {
//                   transform: "translateY(0)",
//                   opacity: 1,
//                 },
//               ],
//               { duration: 300 }
//             );
//
//             a.onfinish = () => done();
//           },
//           onExit: (el, done) => {
//             const animation = el.animate(
//               [
//                 {
//                   transform: "translateY(0)",
//                   opacity: 1,
//                 },
//                 {
//                   transform: "translateY(25px)",
//                   opacity: 0,
//                 },
//               ],
//               { duration: 300 }
//             );
//
//             animation.onfinish = () => done();
//           },
//         }}
//       >
//         <div class="dropdown">
//           <p>Popup text!</p>
//           <p> Lorem, <a href="#"> ipsum </a> dolor.</p>
//         </div>
//       </Dismiss>
//     </div>
//   );
// };
