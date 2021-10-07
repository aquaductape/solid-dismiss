import c from "./Popper.module.scss";
import { scopeModuleClasses } from "../../../utils/scopModuleClasses";
const s = scopeModuleClasses(c);

import Dismiss, { OnOpenHandler } from "solid-dismiss";
import usePopper from "solid-popper";
import { createSignal } from "solid-js";

export const PopperConditionalRender = () => {
  const [anchor, setAnchor] = createSignal<HTMLElement | null>(null);
  const [popper, setPopper] = createSignal<HTMLElement | null>(null);
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLElement;

  const refCb = (el: HTMLElement) => {
    setAnchor(el);
    btnEl = el;
  };

  const popperInstance = usePopper(anchor, popper, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 20],
        },
      },
    ],
  }) as any;

  const animationOnAfterExit = () => {
    const instance = popperInstance();

    instance.destroy();
  };

  return (
    <>
      <button class="btn-primary" ref={refCb} type="button">
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        animation={{ name: "fade-opacity", onAfterExit: animationOnAfterExit }}
      >
        <div class={s("tooltip")} ref={setPopper}>
          This is a tooltip.
        </div>
      </Dismiss>
    </>
  );
};

export const Popper = () => {
  const [anchor, setAnchor] = createSignal<HTMLElement | null>(null);
  const [popper, setPopper] = createSignal<HTMLElement | null>(null);
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLElement;

  const refCb = (el: HTMLElement) => {
    setAnchor(el);
    btnEl = el;
  };

  const popperInstance = usePopper(anchor, popper, {
    placement: "bottom",
    modifiers: [
      { name: "eventListeners", enabled: false },
      {
        name: "offset",
        options: {
          offset: [0, 20],
        },
      },
    ],
  }) as any;

  const onOpen: OnOpenHandler = (open) => {
    const instance = popperInstance();

    if (open) {
      // Enable the event listeners
      // @ts-ignore
      instance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: "eventListeners", enabled: true },
        ],
      }));
      // Update its position
      // @ts-ignore
      instance.update();
    } else {
      // @ts-ignore
      instance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: "eventListeners", enabled: false },
        ],
      }));
    }
  };

  return (
    <>
      <button class="btn-primary" ref={refCb} type="button">
        Button
      </button>
      <Dismiss
        class={s("container", open() && "active")}
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        onOpen={onOpen}
        show
      >
        <div class={s("tooltip")} ref={setPopper}>
          This is a tooltip.
        </div>
      </Dismiss>
    </>
  );
};

// import Dismiss from "solid-dismiss";
// import usePopper from "solid-popper";
// import { createSignal } from "solid-js";
//
// export const Popper = () => {
//   const [anchor, setAnchor] = createSignal(null);
//   const [popper, setPopper] = createSignal(null);
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//
//   const refCb = (el) => {
//     setAnchor(el);
//     btnEl = el;
//   };
//
//   const popperInstance = usePopper(anchor, popper, {
//     placement: "bottom",
//     modifiers: [
//       {
//         name: "offset",
//         options: {
//           offset: [0, 20],
//         },
//       },
//     ],
//   });
//
//   const animationOnAfterExit = () => {
//     const instance = popperInstance();
//
//     instance.destroy();
//   };
//
//   return (
//     <>
//       <button ref={refCb}>Button</button>
//       <Dismiss
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         animation={{ name: "fade", onAfterExit: animationOnAfterExit }}
//       >
//         <div ref={setPopper}>
//           This is a tooltip.
//         </div>
//       </Dismiss>
//     </>
//   );
// };

// import Dismiss from "solid-dismiss";
// import usePopper from "solid-popper";
// import { createSignal } from "solid-js";
//
// const Popper = () => {
//   const [anchor, setAnchor] = createSignal(null);
//   const [popper, setPopper] = createSignal(null);
//   const [open, setOpen] = createSignal(false);
//   let btnEl;
//
//   const refCb = (el) => {
//     setAnchor(el);
//     btnEl = el;
//   };
//
//   const popperInstance = usePopper(anchor, popper, {
//     placement: "bottom",
//     modifiers: [
//       { name: "eventListeners", enabled: false },
//       {
//         name: "offset",
//         options: {
//           offset: [0, 20],
//         },
//       },
//     ],
//   });
//
//   const onOpen = (open) => {
//     const instance = popperInstance();
//
//     if (open) {
//       // Enable the event listeners
//       instance.setOptions((options) => ({
//         ...options,
//         modifiers: [
//           ...options.modifiers,
//           { name: "eventListeners", enabled: true },
//         ],
//       }));
//       // Update its position
//       instance.update();
//     } else {
//       // Disable the event listeners
//       instance.setOptions((options) => ({
//         ...options,
//         modifiers: [
//           ...options.modifiers,
//           { name: "eventListeners", enabled: false },
//         ],
//       }));
//     }
//   };
//
//   return (
//     <>
//       <button ref={refCb}>Button</button>
//       <Dismiss
//         class="container"
//         classList={{ active: open() }}
//         menuButton={btnEl}
//         open={open}
//         setOpen={setOpen}
//         onOpen={onOpen}
//         show
//       >
//         <div ref={setPopper}>
//           This is a tooltip.
//         </div>
//       </Dismiss>
//     </>
//   );
// };
