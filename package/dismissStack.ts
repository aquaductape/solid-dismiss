import { Accessor } from "solid-js";
import { updateIframeStyle } from "./stylesheet";

export type TDismissStack = {
  id: string;
  uniqueId: string;
  setOpen: (v: boolean) => void;
  open: Accessor<boolean>;
  menuBtnEl: HTMLElement;
  menuPopupEl: HTMLElement;
  containerEl: HTMLElement;
  overlayEl?: HTMLDivElement;
  overlay: "backdrop" | "clipped" | false;
  isOverlayClipped: boolean;
  detectIfMenuButtonObscured: boolean;
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

  if (prevStack) {
    updateIframeStyle({ id: prevStack.uniqueId });
  } else {
    updateIframeStyle({ clear: true });
  }

  const foundStack = dismissStack[foundIdx];
  dismissStack.splice(foundIdx, 1);

  return foundStack;
};
