import { Transition } from "solid-transition-group";
import Dismiss from "../../../../package/dismissWithOverlayClip";
import { createSignal, onMount, createEffect, Component } from "solid-js";

// instead of having property to toggle scrollbar, developers can have more control on removing scrollbar such as preserving "space" when removing scrollbar without causing a page shift. This will be different depending on how the header bar or body is styled.
export const toggleScrollbarWithoutPageShift = (type: "add" | "remove") => {
  if (type === "add") {
    const scrollWidth = Math.abs(
      window.innerWidth - document.documentElement.clientWidth
    );

    document.body.style.marginRight = scrollWidth + "px";
    document.body.style.overflow = "hidden";
  }

  if (type === "remove") {
    document.body.style.marginRight = "";
    document.body.style.overflow = "";
  }
};

// ...

const HeroDropdown = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  //   createEffect(() => {
  //     if (!toggle()) {
  //       toggleScrollbarWithoutPageShift("remove");
  //       return;
  //     }
  //
  //     toggleScrollbarWithoutPageShift("add");
  //   });

  return (
    <div style="position: relative; display: inline-block;">
      <button class="btn-primary" ref={btnEl}>
        <span class="desktop-content">Click Me!</span>
        <span class="mobile-content">Tap</span>
      </button>
      <TransitionHero>
        <Dismiss
          class="hero-dropdown"
          menuButton={btnEl}
          open={toggle}
          setOpen={setToggle}
          trapFocus
          overlay={"clip"}

          // closeWhenMenuButtonIsClicked={false}
        >
          <div className="shadow"></div>
          <div class="hero-dropdown-content">
            <p style="margin-top: 0;">
              To close: <strong>click</strong> outside, or press{" "}
              <code>Esc</code> key, or press <code>Tab</code> key until focus is
              outside of popup
            </p>
            <div class="gutters">
              <button className="focus-gutter"></button>
              <button className="focus-gutter"></button>
              <button className="focus-gutter"></button>
            </div>
          </div>
        </Dismiss>
      </TransitionHero>
    </div>
  );
};

const TransitionHero: Component = (props) => {
  return (
    <Transition
      name="hero-animate"

      //       onEnter={(el, done) => {
      //         (el as HTMLElement).style.transformOrigin = "top right";
      //         const a = el.animate(
      //           [
      //             { transform: "scale(0)", opacity: 0 },
      //             { transform: "scale(0.5)", opacity: 0 },
      //             { transform: "scale(1)", opacity: 1 },
      //           ],
      //           {
      //             duration: 300,
      //           }
      //         );
      //
      //         a.finished.then(done);
      //       }}
      //       onExit={(el, done) => {
      //         (el as HTMLElement).style.transformOrigin = "top right";
      //         const a = el.animate(
      //           [
      //             { transform: "scale(1)", opacity: 1 },
      //             { transform: "scale(0.5)", opacity: 0 },
      //             { transform: "scale(0)", opacity: 0 },
      //           ],
      //           {
      //             duration: 300,
      //           }
      //         );
      //         a.finished.then(done);
      //       }}
    >
      {props.children}
    </Transition>
  );
};

export default HeroDropdown;
