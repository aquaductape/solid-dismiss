import { Component } from "solid-js";

const Button: Component<{
  open?: boolean;
  active?: boolean;
  class?: string;
  onClick?: (e: MouseEvent) => void;
  ref?: HTMLButtonElement;
}> = (props) => {
  return (
    // <button
    //   class={`menu-button ${props.class ? props.class : ""}`}
    //   classList={{ opened: props.open }}
    //   onClick={(e) => {
    //     e.currentTarget.focus();
    //     props.onClick && props.onClick(e);
    //   }}
    //   ref={props.ref}
    // >
    //   {props.children ? (
    //     props.children
    //   ) : (
    //     <>
    //       <span class="menu-button-large-content">menuButton</span>
    //       <span class="menu-button-small-content">mBtn</span>
    //     </>
    //   )}
    // </button>
    <a
      class={`menu-button ${props.class ? props.class : ""}`}
      classList={{ opened: props.open }}
      onClick={(e) => {
        e.currentTarget.focus();
        props.onClick && props.onClick(e);
      }}
      href="javascript:void(0)"
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
    </a>
  );
};

export default Button;
