import { onMount, Component } from "solid-js";
import { wait } from "../utils";

const IFrame: Component<{
  id?: string;
  class?: string;
  bodyHasClickListener?: boolean;
  notTest?: boolean;
}> = ({
  bodyHasClickListener = false,
  id,
  class: className,
  notTest = false,
}) => {
  let el!: HTMLIFrameElement;

  onMount(() => {
    setTimeout(() => {
      const doc = el.contentWindow?.document!;

      const message = bodyHasClickListener
        ? "body has click listener"
        : "body doesn't have click listener!!";
      const interactiveContent = `<button style="display:none;">Hidden Button</button><button id="${id}" >Button</button> <br><br> <a href="#">Link</a> <br><br> <input type="text" placeholder="Text input...">`;
      doc.write(
        `<html><body style='background: #f5f5df;'><div> <h1 style="font-size: 14px">Same Domain Iframe</h1> <p>${message}</p>${interactiveContent}</body> </html>`
      );
      setTimeout(() => {
        if (bodyHasClickListener) {
          doc.body.addEventListener("click", () => {});
        }
        doc.close();
      }, 0);
    }, 50); // timeout to solve testcafe Firefox rendering issue
  });
  return (
    <div
      class={`iframe `}
      style="overflow:auto;-webkit-overflow-scrolling:touch"
    >
      <iframe
        class={className || ""}
        ref={el}
        width="100%"
        height="100%"
        {...(notTest ? {} : { "data-test-iframe": "" })}
      ></iframe>
    </div>
  );
};

export default IFrame;
