import { Accessor, JSX } from "solid-js";
import { TFocusElementOnClose } from ".";
import { TLocalState } from "./localState";

export type TDismissStack = {
  id: string;
  uniqueId: string;
  setOpen: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
  open: Accessor<boolean>;
  menuBtnEl: HTMLElement;
  menuPopupEl: HTMLElement;
  containerEl: HTMLElement;
  overlayEl?: HTMLDivElement;
  overlay: "backdrop" | "clip" | boolean;
  detectIfMenuButtonObscured: boolean;
  closeWhenDocumentBlurs: boolean;
  cursorKeys: boolean;
  closeWhenEscapeKeyIsPressed: boolean;
  focusElementOnClose: TFocusElementOnClose;
  queueRemoval: boolean;
  upperStackRemovedByFocusOut: boolean;
};

export const dismissStack: TDismissStack[] = [];

export const addDismissStack = (props: TDismissStack) => {
  const prevStack = dismissStack[dismissStack.length - 1];
  const isOverlayClip =
    props.overlay === "clip"
      ? true
      : typeof props.overlay === "object"
      ? // @ts-ignore
        props.overlay.type === "clip"
      : false;

  if (
    prevStack &&
    prevStack.overlayEl &&
    prevStack.overlay === "clip" &&
    isOverlayClip
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

  if (prevStack && prevStack.overlayEl && prevStack.overlay === "clip") {
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
