import { onMount, Component } from "solid-js";

const IFrame: Component<{ useCrossDomain?: boolean }> = ({
  useCrossDomain = false,
}) => {
  let el!: HTMLIFrameElement;
  onMount(() => {
    if (useCrossDomain) return;
    const doc = el.contentWindow?.document!;
    // const doc = document.querySelector('iframe').contentWindow?.document!;
    doc.write(
      "<html><body> <h1>Same Domain Iframe</h1> <button>hi</button> <button>bye</button> </body> </html>"
    );

    doc.close();
    setTimeout(() => {
      doc.addEventListener("touchstart", () => {});
    }, 1000);
  });
  return (
    <iframe
      src={useCrossDomain ? "https://example.org" : ""}
      width="150px"
      height="200px"
      ref={el}
    ></iframe>
  );
};

export default IFrame;
