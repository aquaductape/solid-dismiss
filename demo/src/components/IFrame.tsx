import { onMount, Component } from "solid-js";

const IFrame: Component<{ useCrossDomain?: boolean }> = ({
  useCrossDomain = false,
}) => {
  let el!: HTMLIFrameElement;
  onMount(() => {
    if (useCrossDomain) return;
    const doc = el.contentWindow?.document!;
    doc.write(
      "<html><body> <button>hi</button> <button>bye</button> </body> </html>"
    );
    doc.close();
  });
  return (
    <iframe
      src={useCrossDomain ? "https://example.org" : ""}
      width="200px"
      height="200px"
      // @ts-ignore
      tabindex="0"
      ref={el}
    ></iframe>
  );
};

export default IFrame;
