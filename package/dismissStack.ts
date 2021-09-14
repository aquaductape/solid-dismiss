import { Accessor, JSX } from "solid-js";

export type TFocusElementOnClose =
  | "menuButton"
  | string
  | JSX.Element
  | {
      /**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via tabbing backwards ie "Shift + Tab".
       *
       */
      tabBackwards?: "menuButton" | string | JSX.Element;
      /**
       * Default: next tabbable element after menuButton;
       *
       * focus on element when exiting menuPopup via tabbing forwards ie "Tab".
       *
       * Note: If popup is mounted elsewhere in the DOM, when tabbing outside, this library is able to grab the correct next tabbable element after menuButton, except for tabbable elements inside iframe with cross domain.
       */
      tabForwards?: "menuButton" | string | JSX.Element;
      /**
       * focus on element when exiting menuPopup via click outside popup.
       *
       * If overlay present, and popup closes via click, then menuButton will be focused.
       *
       * Note: When clicking, user-agent determines which element recieves focus, to prevent this, use `overlay` prop.
       */
      click?: "menuButton" | string | JSX.Element;
      /**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via "Escape" key
       */
      escapeKey?: "menuButton" | string | JSX.Element;
      /**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via scrolling, from scrollable container that contains menuButton
       */
      scrolling?: "menuButton" | string | JSX.Element;
    };

export type TDismissStack = {
  id: string;
  uniqueId: string;
  setOpen: (v: boolean) => void;
  open: Accessor<boolean>;
  menuBtnEl: HTMLElement;
  menuPopupEl: HTMLElement;
  containerEl: HTMLElement;
  overlayEl?: HTMLDivElement;
  overlay: "backdrop" | "clipped" | boolean;
  isOverlayClipped: boolean;
  detectIfMenuButtonObscured: boolean;
  closeWhenDocumentBlurs: boolean;
  cursorKeys: boolean;
  closeWhenEscapeKeyIsPressed: boolean;
  focusElementOnClose: TFocusElementOnClose;
};

export const dismissStack: TDismissStack[] = [];

export const addDismissStack = (props: TDismissStack) => {
  const prevStack = dismissStack[dismissStack.length - 1];

  if (
    prevStack &&
    prevStack.overlayEl &&
    prevStack.isOverlayClipped &&
    props.isOverlayClipped
  ) {
    const paths = prevStack.overlayEl!.querySelectorAll(
      "path"
    ) as NodeListOf<SVGPathElement>;

    paths.forEach((path) => {
      path.style.pointerEvents = "none";
      path.style.fill = "transparent";
    });
  }

  dismissStack.push(props!);
};

export const removeDismissStack = (id: string) => {
  const foundIdx = dismissStack.findIndex((item) => item.uniqueId === id);
  if (foundIdx === -1) return;
  const prevStack = dismissStack[foundIdx - 1];

  if (prevStack && prevStack.overlayEl && prevStack.isOverlayClipped) {
    const paths = prevStack.overlayEl!.querySelectorAll(
      "path"
    ) as NodeListOf<SVGPathElement>;

    paths.forEach((path) => {
      path.style.pointerEvents = "";
      path.style.fill = "";
    });

    paths[5].style.pointerEvents = "all";
    paths[6].style.pointerEvents = "all";
  }

  const foundStack = dismissStack[foundIdx];
  dismissStack.splice(foundIdx, 1);

  return foundStack;
};
