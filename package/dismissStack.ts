import { Accessor } from "solid-js";

export type TDismissStack = {
  id: string;
  setToggle: (v: boolean) => void;
  toggle: Accessor<boolean>;
  menuBtnEl: HTMLElement;
  menuDropdownEl: HTMLElement;
  containerEl: HTMLElement;
  overlayEl?: HTMLDivElement;
  overlay: "block" | "clipped" | false;
  isOverlayClipped: boolean;
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
  const foundIdx = dismissStack.findIndex((item) => item.id === id);
  if (foundIdx === -1) return;
  const prevStack = dismissStack[foundIdx - 1];

  if (prevStack && prevStack.overlayEl && prevStack.isOverlayClipped) {
    const paths = prevStack.overlayEl!.querySelectorAll(
      "path"
    ) as NodeListOf<SVGPathElement>;
    paths.forEach((path) => {
      path.style.pointerEvents = "all";
      path.style.fill = "";
    });
  }
  const foundStack = dismissStack[foundIdx];
  dismissStack.splice(foundIdx, 1);

  return foundStack;
};
