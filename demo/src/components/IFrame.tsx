import { onMount, Component } from "solid-js";

const IFrame: Component<{ useCrossDomain?: boolean }> = ({
  useCrossDomain = false,
}) => {
  let el!: HTMLIFrameElement;
  onMount(() => {
    if (useCrossDomain) return;
    const iframe = document.querySelector("iframe");
    const doc = el.contentWindow?.document!;
    doc.write(
      "<html><body style='height: 100%'><div> <h1>Same Domain Iframe</h1> <button>hi</button> <button>bye</button></div> </body> </html>"
    );

    doc.close();
    setTimeout(() => {
      doc.body.addEventListener("click", () => {});
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
