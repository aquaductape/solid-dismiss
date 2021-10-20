import { Component } from "solid-js";

const Button: Component<{
  id?: string;
  open?: boolean;
  active?: boolean;
  class?: string;
  onClick?: (e: MouseEvent) => void;
  ref?: HTMLButtonElement | ((el: HTMLElement) => void);
}> = (props) => {
  return (
    <button
      id={props.id}
      class={`menu-button ${props.class ? props.class : ""}`}
      classList={{ opened: props.open }}
      onClick={(e) => {
        e.currentTarget.focus();
        props.onClick && props.onClick(e);
      }}
      data-test-menu-button
      ref={props.ref}
    >
      {props.children ? (
        props.children
      ) : (
        <>
          <span class="menu-button-large-content">menuButton</span>
          <span class="menu-button-small-content">mBtn</span>
        </>
      )}
    </button>
  );
};

export default Button;
