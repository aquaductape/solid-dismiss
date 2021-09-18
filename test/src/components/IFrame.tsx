import { onMount, Component } from "solid-js";

const IFrame: Component<{ bodyHasClickListener?: boolean }> = ({
  bodyHasClickListener = false,
}) => {
  let el!: HTMLIFrameElement;
  onMount(() => {
    const doc = el.contentWindow?.document!;
    const message = bodyHasClickListener
      ? "body has click listener"
      : "body doesn't have click listener";
    const event = bodyHasClickListener ? `onclick="(function(){})();"` : "";
    doc.write(
      `<html><body ${event} style='background: #f5f5df;'><div> <h1 style="font-size: 14px">Same Domain Iframe</h1> <p>${message}</p> <button>Button</button> <br><br> <a href="#">Link</a> <br><br> <input type="text" placeholder="Text input..."> </body> </html>`
    );

    doc.close();
  });
  return <iframe class="iframe" src="" ref={el}></iframe>;
};

export default IFrame;
