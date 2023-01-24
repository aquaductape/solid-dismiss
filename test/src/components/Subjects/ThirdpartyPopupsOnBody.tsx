import { Component, createEffect, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const id = "third-party-popups-on-body";
const ThirdpartyPopupsOnBody = () => {
  return (
    <section id={id} class="nested third-party-popups-on-body">
      <h2 tabindex="0">Third-Party Popups mounted on body</h2>
      <p>
        When there are popups or interactive tooltips, that are mounted to the
        body, Solid Dismiss isn't aware of them, so interacting them by clicking
        them, will close all stacks and other unintended consequences. If that
        third-party popup is closed by escape key, the expectation is that only
        that popup will close, but Dismiss will close it's topmost stack which
        happens to contain that mounted popup, so "2 stacks" will be closed.
      </p>

      <div class="grid">
        <RegularPopup id={id + "-1"}></RegularPopup>
        <RegularPopup id={id + "-2"} disableThirdPartyEscapeKey></RegularPopup>
        {/* <MountedPopup id={id}></MountedPopup>
        <OverlayPopup id={id}></OverlayPopup>
        <OverlayDisabledClickPopup id={id}></OverlayDisabledClickPopup> */}
      </div>
    </section>
  );
};

const PopupContent: Component<{ id: string; idx: number }> = (props) => {
  return (
    <>
      <RegularPopup id={props.id} idx={props.idx + 1}></RegularPopup>
      <MountedPopup id={props.id} idx={props.idx + 1}></MountedPopup>
      <OverlayPopup id={props.id} idx={props.idx + 1}></OverlayPopup>
      <OverlayDisabledClickPopup
        id={props.id}
        idx={props.idx + 1}
      ></OverlayDisabledClickPopup>
    </>
  );
};

const CreateThirdpartyPopupsOnBody = ({
  disableThirdPartyEscapeKey,
}: { disableThirdPartyEscapeKey?: boolean } = {}) => {
  const [open, setOpen] = createSignal(false);
  const [target, setTarget] = createSignal<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = createSignal(false);
  let popupEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    const targetEl = target();
    if (!targetEl) return;

    targetEl.addEventListener("click", () => {
      setOpen((prev) => !prev);
    });
  });

  createEffect(() => {
    if (!open()) return;
    const targetEl = target();
    if (!targetEl) return;

    const targetBCR = targetEl.getBoundingClientRect();

    const containerWidth = 250;
    popupEl.style.position = "absolute";
    popupEl.style.width = 250 + "px";
    popupEl.style.zIndex = "1000";

    popupEl.style.top = targetBCR.bottom + window.scrollY + "px";
    popupEl.style.left = getLeft(targetBCR, containerWidth) + "px";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const close = () => {
        setOpen(false);

        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("click", onClick);
      };
      if (disableThirdPartyEscapeKey) {
        setIsClosing(true);
        setTimeout(() => {
          setIsClosing(false);
          close();
        }, 1000);
        return;
      }

      close();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (popupEl.contains(target)) return;
      setOpen(false);

      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
    requestAnimationFrame(() => {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("click", onClick);
    });
  });

  const PortalPopup = () => (
    <Portal>
      <Show when={open()}>
        <div
          id="third-party-mounted-popup"
          class="popup-regular dropdown padding-top"
          style="border-radius: 20px; border-color: red; padding: 20px;"
          ref={popupEl}
        >
          <Show when={isClosing()}>
            <p style="font-weight: bold;">
              <strong>IS CLOSING in 1 second ...</strong>
            </p>
          </Show>
          <h2 style="font-weight: bold;">Third Party Popup</h2>
          <Show
            when={disableThirdPartyEscapeKey}
            fallback={
              <>
                <p>Press Escape key to Close this popup</p>
                <p>
                  So pressing Escape key will NOT close topmost Dismiss stack
                </p>
              </>
            }
          >
            <p>This popup DOES NOT ClOSE when pressing Escape key</p>
            <p>So pressing Escape key will close topmost Dismiss stack</p>
          </Show>
          <input type="text" placeholder="text input..." class="input-test" />
          <p>
            Some{" "}
            <a data-test="first-tabbable-item" href="javascript:void(0)">
              random
            </a>{" "}
            text
          </p>

          <button
            aria-label="close"
            class="close"
            style="top: 8px; right: 8px;"
            onClick={onClickClose}
          ></button>
        </div>
      </Show>
    </Portal>
  );

  return { setTarget, PortalPopup };
};

const RegularPopup: Component<{
  id: string;
  idx?: number;
  disableThirdPartyEscapeKey?: boolean;
}> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;

  const { setTarget, PortalPopup } = CreateThirdpartyPopupsOnBody({
    disableThirdPartyEscapeKey: props.disableThirdPartyEscapeKey,
  });
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.height + 5 + "px";
    // containerEl.style.left = "0";
    containerEl.style.left = getLeft(btnBCR, containerWidth, false) + "px";
  });

  return (
    <div style="display: inline-block; position: relative; padding: 5px;">
      <Button class="medium btn-regular" open={open()} ref={btnEl}>
        Regular
      </Button>
      <Dismiss
        class="popup-regular-absolute"
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        mountedPopupsSafeList={["#third-party-mounted-popup"]}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          class={`${id + "-popup"} popup-regular dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            Click{" "}
            <a
              data-test="first-tabbable-item"
              href="javascript:void(0)"
              style="color: red; font-weight: bold;"
              ref={setTarget}
            >
              this link!!!
            </a>{" "}
            that opens third-party popup that is mounted on body element.
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button
            aria-label="close"
            class="close"
            onClick={onClickClose}
          ></button>
        </div>
      </Dismiss>
      <PortalPopup />
    </div>
  );
};

const MountedPopup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";
    containerEl.style.zIndex = "1000";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div style="display: inline-block; position: relative; padding: 5px;">
      <Button class="medium btn-mounted" open={open()} ref={btnEl}>
        Mounted
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        ref={containerEl}
        {...toggleAnimation()}
      >
        <div
          class={`${id + "-popup"} popup-mounted dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Mounted</strong>: Click on outside, should close stacks that
            don't contain the click
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button
            aria-label="close"
            class="close"
            onClick={onClickClose}
          ></button>
        </div>
      </Dismiss>
    </div>
  );
};

const OverlayPopup: Component<{ id: string; idx?: number }> = (props) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div style="display: inline-block; position: relative; padding: 5px;">
      <Button class="medium btn-overlay" open={open()} ref={btnEl}>
        Overlay
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlayElement={{ class: "overlay" }}
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div
          class={`${id + "-popup"} popup-overlay dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Overlay</strong>: Click on overlay, should only close that
            current stack
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button
            aria-label="close"
            class="close"
            onClick={onClickClose}
          ></button>
        </div>
      </Dismiss>
    </div>
  );
};

const OverlayDisabledClickPopup: Component<{ id: string; idx?: number }> = (
  props
) => {
  const idx = props.idx || 1;
  let id = `${props.id}-level-${idx}`;
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  const onClickClose = () => {
    setOpen(false);
  };

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();

    const containerWidth = 250;
    containerEl.style.position = "absolute";
    containerEl.style.width = 250 + "px";

    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = getLeft(btnBCR, containerWidth) + "px";
  });

  return (
    <div style="display: inline-block; position: relative; padding: 5px;">
      <Button class="medium btn-overlay-d" open={open()} ref={btnEl}>
        Overlay Disabled Click
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        overlayElement={{ class: "overlay" }}
        closeWhenOverlayClicked={false}
        trapFocus={true}
        ref={containerEl}
        {...toggleAnimation({ includeOverlay: true })}
      >
        <div
          class={`${id + "-popup"} popup-overlay-d dropdown padding-top`}
          ref={dropdownEl}
        >
          <p>
            <strong>Overlay</strong>: Click overlay to close is disabled! Press
            Escape or click "X" to close.
          </p>
          <input type="text" placeholder="text input..." class="input-test" />
          <br />
          <PopupContent id={props.id} idx={idx} />
          <button
            aria-label="close"
            class="close"
            onClick={onClickClose}
          ></button>
        </div>
      </Dismiss>
    </div>
  );
};

export default ThirdpartyPopupsOnBody;
