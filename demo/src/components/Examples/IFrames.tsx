import Dismiss from "../../../../package/index";
import { createSignal, onMount, Component, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import IFrame from "../IFrame";
import FocusGutter from "../FocusGutter";

const SingleIFrame: Component<{
  includeIframeChild: boolean;
  includeIframeChild2?: boolean;
  iframeChildCrossDomain: boolean;
  iframeSiblingCrossDomain: boolean;
  closeWhenWindowBlurs?: boolean;
  closeWhenScrolling?: boolean;
}> = ({
  iframeChildCrossDomain,
  iframeSiblingCrossDomain,
  includeIframeChild,
  includeIframeChild2,
  closeWhenWindowBlurs,
  closeWhenScrolling,
}) => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let popupContainerEl!: HTMLElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    popupContainerEl.style.position = "absolute";
    popupContainerEl.style.top =
      btnBCR.top + btnBCR.height + window.scrollY + 10 + "px";
    popupContainerEl.style.left = btnBCR.left + window.scrollX + "px";
  });

  return (
    <>
      <FocusGutter />
      <div style="position: relative; display: flex; gap: 15px;">
        <button class="btn-primary" ref={btnEl}>
          Dropdown
        </button>
        <Portal>
          <Dismiss
            menuButton={btnEl}
            open={open}
            setOpen={setOpen}
            closeWhenDocumentBlurs={closeWhenWindowBlurs}
            closeWhenScrolling={closeWhenScrolling}
            useAriaExpanded
            ref={popupContainerEl}
          >
            <ul class="dropdown" style="overflow:auto;height: 200px;">
              {closeWhenScrolling && (
                <>
                  <p>closeWhenScrolling</p>
                  {open() && (
                    <SingleIFrame
                      includeIframeChild
                      iframeChildCrossDomain
                      iframeSiblingCrossDomain
                      closeWhenScrolling
                    />
                  )}
                </>
              )}
              {closeWhenWindowBlurs && <p>closeWhenWindowBlurs</p>}
              <li>
                <a class="item" href="#">
                  cat
                </a>
              </li>
              <li>
                <a class="item" href="#">
                  dog
                </a>
              </li>
              {includeIframeChild2 && (
                <IFrame useCrossDomain={iframeChildCrossDomain} />
              )}
              <li>
                <a class="item" href="#">
                  fish
                </a>
              </li>
              {includeIframeChild && (
                <IFrame useCrossDomain={iframeChildCrossDomain} />
              )}
            </ul>
          </Dismiss>
        </Portal>

        <IFrame useCrossDomain={iframeSiblingCrossDomain} />
      </div>
      <FocusGutter />
    </>
  );
};

const IFrames = () => {
  return (
    <div>
      <SingleIFrame
        includeIframeChild
        iframeChildCrossDomain
        iframeSiblingCrossDomain
        closeWhenScrolling
      />
      <SingleIFrame
        includeIframeChild
        iframeChildCrossDomain
        iframeSiblingCrossDomain={false}
      />
      <SingleIFrame
        includeIframeChild={false}
        iframeChildCrossDomain
        iframeSiblingCrossDomain
      />
      <SingleIFrame
        includeIframeChild={false}
        includeIframeChild2
        iframeChildCrossDomain
        iframeSiblingCrossDomain
      />
      <p>Close when window blurs</p>
      <SingleIFrame
        includeIframeChild={false}
        includeIframeChild2
        iframeChildCrossDomain
        iframeSiblingCrossDomain
        closeWhenWindowBlurs
      />
    </div>
  );
};

export default IFrames;
