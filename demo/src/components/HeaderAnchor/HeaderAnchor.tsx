import { ParentComponent } from "solid-js";

export const H2Anchor: ParentComponent = ({ children }) => {
  let el!: HTMLHeadingElement;
  const onClick = () => {
    el.scrollIntoView();
    setTimeout(() => {
      window.scrollBy(0, -80);
    });
    location.hash = el.textContent!.toLowerCase().replace(/\s/g, "-");
  };

  return (
    <h2
      id={children?.toString().toLowerCase().replace(/\s/g, "-")}
      onClick={onClick}
      ref={el}
      tabindex={-1}
      style="cursor: pointer;"
    >
      {children}
    </h2>
  );
};

export const H3Anchor: ParentComponent = ({ children }) => {
  let el!: HTMLHeadingElement;
  const onClick = () => {
    el.scrollIntoView();
    setTimeout(() => {
      window.scrollBy(0, -80);
    });
    location.hash = el.textContent!.toLowerCase().replace(/\s/g, "-");
  };

  return (
    <h3
      // @ts-ignore
      id={children?.toString().toLowerCase().replace(/\s/g, "-")}
      onClick={onClick}
      ref={el}
      style="cursor: pointer;"
      tabindex={-1}
    >
      {children}
    </h3>
  );
};
