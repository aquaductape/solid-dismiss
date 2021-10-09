import { Component } from "solid-js";
const Anchor: Component<{ class?: string; href: string; target?: "_blank" }> = (
  props
) => {
  const { href, target } = props;
  return (
    <a
      class={(props.class || "") + " focusable anchor"}
      href={href}
      target={target}
      rel="noopener"
      onClick={(e) => {
        if (href === "#") e.preventDefault();
      }}
    >
      {props.children}
    </a>
  );
};

export default Anchor;
