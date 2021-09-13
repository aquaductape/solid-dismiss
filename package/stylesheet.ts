let style: HTMLStyleElement;

export const initStyleElement = (id: string) => {
  if (style) {
    updateIframeStyle({ id });
    return;
  }

  style = document.createElement("style");
  style.type = "text/css";
  updateIframeStyle({ id });
  document.head.appendChild(style);
};

export const updateIframeStyle = ({
  id,
  clear,
}: {
  id?: string;
  clear?: boolean;
}) => {
  //     iframe {
  //       pointer-events: none !important;
  //     }
  //
  //     [data-solid-dismiss-dropdown-container="${id}"] iframe {
  //       pointer-events: unset !important;
  //     }
  const stylesheet = !clear
    ? `
  `
    : "";

  style.textContent = stylesheet;
};
