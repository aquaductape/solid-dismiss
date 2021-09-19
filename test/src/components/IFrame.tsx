import { onMount, Component } from "solid-js";

const IFrame: Component<{
  id?: string;
  bodyHasClickListener?: boolean;
}> = ({ bodyHasClickListener = false, id }) => {
  let el!: HTMLIFrameElement;
  onMount(() => {
    const doc = el.contentWindow?.document!;
    const message = bodyHasClickListener
      ? "body has click listener"
      : "body doesn't have click listener!!";
    const event = bodyHasClickListener ? `onclick="(function(){})();"` : "";
    const interactiveContent =
      '<button id="${id}">Button</button> <br><br> <a href="#">Link</a> <br><br> <input type="text" placeholder="Text input...">';
    doc.write(
      `<html><body ${event} style='background: #f5f5df;'><div> <h1 style="font-size: 14px">Same Domain Iframe</h1> <p>${message}</p>${interactiveContent}</body> </html>`
    );

    doc.close();
  });
  return <iframe class={"iframe"} src="" ref={el}></iframe>;
};

export default IFrame;
