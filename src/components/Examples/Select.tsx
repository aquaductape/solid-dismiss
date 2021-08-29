import { Transition } from "solid-transition-group";
import Dismiss from "../../../package/index";
import { createSignal, createEffect, Show } from "solid-js";
import { Portal } from "solid-js/web";

const Select = () => {
  const [toggle, setToggle] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let menuDropdown!: HTMLElement;

  createEffect(() => {
    if (!toggle()) {
      document.body.style.marginRight = "";
      document.body.style.overflow = "";
      return;
    }

    console.log("position dropdown");
    const scrollWidth = Math.abs(
      window.innerWidth - document.documentElement.clientWidth
    );

    // document.body.style.marginRight = scrollWidth + "px";
    // document.body.style.overflow = "hidden";

    const btnBCR = btnEl.getBoundingClientRect();
    menuDropdown.style.position = "absolute";
    menuDropdown.style.width = btnBCR.width + "px";
    menuDropdown.style.top =
      btnBCR.top + btnBCR.height + window.scrollY + 10 + "px";
    menuDropdown.style.left = btnBCR.left + window.scrollX + "px";
  });

  return (
    <>
      <button
        // style="border-bottom-left-radius: 10% 20%; border-bottom-right-radius: 15px; border-top-left-radius: 10px;"
        onClick={() => setToggle(true)}
        class="btn-select"
        ref={btnEl}
      >
        Select... <span>V</span>
      </button>
      <Portal>
        <Transition
          onEnter={(el, done) => {
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
            menuButton={btnEl}
            toggle={toggle}
            setToggle={setToggle}
            overlay={"clipped"}
            focusOnLeave="menuButton"
            ref={menuDropdown}
          >
            <ul>
              <li tabindex="0">cat</li>
              <li tabindex="0">dog</li>
              <li tabindex="0">fish</li>
              <li tabindex="0">hat</li>
              <li tabindex="0">car</li>
            </ul>
          </Dismiss>
        </Transition>
      </Portal>
    </>
  );
};

export default Select;
