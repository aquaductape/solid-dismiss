import Dismiss from "../../../../package/index";
import { createSignal, onMount, Component } from "solid-js";
import IFrame from "../IFrame";
import FocusGutter from "../FocusGutter";

const SingleIFrame: Component<{
  includeIframeChild: boolean;
  includeIframeChild2?: boolean;
  iframeChildCrossDomain: boolean;
  iframeSiblingCrossDomain: boolean;
  closeWhenWindowBlurs?: boolean;
}> = ({
  iframeChildCrossDomain,
  iframeSiblingCrossDomain,
  includeIframeChild,
  includeIframeChild2,
  closeWhenWindowBlurs,
}) => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <>
      <FocusGutter />
      <div style="position: relative; display: flex; gap: 15px;">
        <button class="btn-primary" ref={btnEl}>
          Dropdown
        </button>
        <Dismiss
          menuButton={btnEl}
          open={open}
          setOpen={setOpen}
          closeWhenWindowBlurs={closeWhenWindowBlurs}
          useAriaExpanded
        >
          <ul class="dropdown" style="overflow:auto;height: 200px;">
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
