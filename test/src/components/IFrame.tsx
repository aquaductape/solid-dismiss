import { onMount, Component } from "solid-js";

const IFrame: Component<{
  id?: string;
  bodyHasClickListener?: boolean;
}> = ({ bodyHasClickListener = false, id }) => {
  let el!: HTMLIFrameElement;
  // onMount(() => {
  //   const doc = el.contentWindow?.document!;
  //   const message = bodyHasClickListener
  //     ? "body has click listener"
  //     : "body doesn't have click listener!!";
  //   const event = bodyHasClickListener ? `onclick="(function(){})();"` : "";
  //   const interactiveContent =
  //     '<button id="${id}">Button</button> <br><br> <a href="#">Link</a> <br><br> <input type="text" placeholder="Text input...">';
  //   doc.write(
  //     `<html style="cursor: pointer"><body ${event} style='background: #f5f5df;'><div> <h1 style="font-size: 14px">Same Domain Iframe</h1> <p>${message}</p>${interactiveContent}</body> </html>`
  //   );
  //   doc.close();
  // });
  return (
    <div
      class={"iframe"}
      style="overflow:auto;-webkit-overflow-scrolling:touch"
    >
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
        ref={el}
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
};

export default IFrame;
