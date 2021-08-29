import { Transition } from "solid-transition-group";
import Dismiss from "../../../package/index";
import { createSignal, onMount } from "solid-js";
// ...

const HeroDropdown = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="position: relative; display: inline-block;">
      <button class="btn-primary" ref={btnEl}>
        <span class="desktop-content">Click Me!</span>
        <span class="mobile-content">Tap</span>
      </button>
      <Transition
        onEnter={(el, done) => {
          (el as HTMLElement).style.transformOrigin = "top right";
          const a = el.animate(
            [
              { transform: "scale(0)", opacity: 0 },
              { transform: "scale(0.5)", opacity: 0 },
              { transform: "scale(1)", opacity: 1 },
            ],
            {
              duration: 300,
            }
          );

          a.finished.then(done);
        }}
        onExit={(el, done) => {
          (el as HTMLElement).style.transformOrigin = "top right";
          const a = el.animate(
            [
              { transform: "scale(1)", opacity: 1 },
              { transform: "scale(0.5)", opacity: 0 },
              { transform: "scale(0)", opacity: 0 },
            ],
            {
              duration: 300,
            }
          );
          a.finished.then(done);
        }}
      >
        <Dismiss
          class="hero-dropdown"
          menuButton={btnEl}
          toggle={toggle}
          setToggle={setToggle}
          // closeWhenMenuButtonIsClicked={false}
        >
          <div className="shadow"></div>
          <div class="hero-dropdown-content">
            <p style="margin-top: 0;">
              To close: <strong>click</strong> outside, or press{" "}
              <code>Esc</code> key, or press <code>Tab</code> key until focus is
              outside of dropdown
            </p>
            <div class="gutters">
              <button className="focus-gutter"></button>
              <button className="focus-gutter"></button>
              <button className="focus-gutter"></button>
            </div>
          </div>
        </Dismiss>
      </Transition>
    </div>
  );
};

export default HeroDropdown;
