import Dismiss from "solid-dismiss";
import c from "./Modal.module.scss";
import { Component, createEffect, createSignal, on } from "solid-js";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import netflixModalOverflowPageViewportMP4 from "../../assets/netflix-modal-overflow-page-viewport-height.mp4";
const s = scopeModuleClasses(c);

const ModalOverflowingViewportHeight = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  let prevScrollY = 0;

  createEffect(
    on(
      open,
      (open) => {
        const main = document.querySelector("main")!;
        if (!open) {
          main.style.position = "";
          main.style.top = "";
          main.style.width = "";
          main.style.left = "";
          window.scrollTo({ top: prevScrollY });
          return;
        }

        const { scrollY } = window;

        // const btnBCR = btnEl.getBoundingClientRect();

        // containerEl.style.position = "fixed";

        const mainBCR = main.getBoundingClientRect();
        // make sure the "main page" element doesn't have bleeding margins
        // otherwise when it's position is fixed/absolute (in this case "fixed")
        // the child margins no longer bleed and instead are part of root element content size.
        // Which results in mismatched top position when toggling modal.
        // To prevent this make sure that by default "main page" element has top and bottom padding
        // or has `display: flow-root;`.
        main.style.position = "fixed";
        main.style.top = `${mainBCR.top}px`;
        main.style.width = `${mainBCR.width}px`;
        main.style.left = `${mainBCR.left}px`;
        prevScrollY = scrollY;
        window.scrollTo({ top: 0 });

        // containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
        // containerEl.style.left = getLeft(btnBCR, 320) + "px";
      },
      { defer: true }
    )
  );

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        modal
        overlayElement={{ class: s("overlay") }}
        removeScrollbar={false}
        ref={containerEl}
      >
        <div
          class={s("modal-overflow-container")}
          role="dialog"
          ref={dropdownEl}
        >
          <h3>Modal Overflowing Viewport Height</h3>
          <video
            autoplay
            loop
            muted
            controls={false}
            src={netflixModalOverflowPageViewportMP4}
          ></video>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quo
            quibusdam sapiente ducimus voluptates est deleniti vel vitae minima
            voluptatibus?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
            quisquam dolor blanditiis. Ipsam itaque adipisci nemo omnis vitae
            in, enim corporis corrupti architecto optio illum cum amet debitis
            magnam alias nobis reiciendis sed explicabo doloremque sequi
            eligendi quod? Architecto repellendus natus sunt aut temporibus
            soluta distinctio eius mollitia harum minus.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A ipsa
            placeat aperiam impedit quis veritatis eius eaque, tempore quam unde
            vitae, omnis quibusdam possimus dicta sit fugiat illo rerum atque
            explicabo libero blanditiis. Optio expedita, pariatur delectus
            libero dolores numquam odio, molestias odit recusandae facilis ad.
            Repellat ipsum repellendus eaque a architecto illo fuga. Vero ab qui
            unde, eaque pariatur, repellendus molestiae iusto praesentium iste
            explicabo iure in! Provident assumenda ducimus ratione debitis,
            pariatur sunt! Eveniet perferendis odit dolore officia? Odio,
            deserunt ex amet molestias nostrum a culpa illum cum asperiores quod
            nulla perspiciatis perferendis distinctio quaerat nam laborum id.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quo
            quibusdam sapiente ducimus voluptates est deleniti vel vitae minima
            voluptatibus?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
            quisquam dolor blanditiis. Ipsam itaque adipisci nemo omnis vitae
            in, enim corporis corrupti architecto optio illum cum amet debitis
            magnam alias nobis reiciendis sed explicabo doloremque sequi
            eligendi quod? Architecto repellendus natus sunt aut temporibus
            soluta distinctio eius mollitia harum minus.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A ipsa
            placeat aperiam impedit quis veritatis eius eaque, tempore quam unde
            vitae, omnis quibusdam possimus dicta sit fugiat illo rerum atque
            explicabo libero blanditiis. Optio expedita, pariatur delectus
            libero dolores numquam odio, molestias odit recusandae facilis ad.
            Repellat ipsum repellendus eaque a architecto illo fuga. Vero ab qui
            unde, eaque pariatur, repellendus molestiae iusto praesentium iste
            explicabo iure in! Provident assumenda ducimus ratione debitis,
            pariatur sunt! Eveniet perferendis odit dolore officia? Odio,
            deserunt ex amet molestias nostrum a culpa illum cum asperiores quod
            nulla perspiciatis perferendis distinctio quaerat nam laborum id.
          </p>

          <button
            class={s("x-btn")}
            aria-label="close modal"
            onClick={onClickClose}
          >
            <div class={s("inner")}>
              <div></div>
              <div></div>
            </div>
          </button>
        </div>
      </Dismiss>
    </>
  );
};

export default ModalOverflowingViewportHeight;
