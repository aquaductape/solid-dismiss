import { Component } from "solid-js";

const Button: Component<{
  open: boolean;
  active?: boolean;
  class?: string;
  onClick?: (e: MouseEvent) => void;
  ref?: HTMLButtonElement;
}> = (props) => {
  return (
    <button
      class={`menu-button ${props.class ? props.class : ""}`}
      classList={{ opened: props.open }}
      onClick={props.onClick}
      ref={props.ref}
    >
      <span class="menu-button-large-content">menuButton</span>
      <span class="menu-button-small-content">mBtn</span>
    </button>
  );
};

export default Button;
