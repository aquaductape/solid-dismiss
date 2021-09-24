import settings from "./globalSettings";

export const wait = (timeout: number) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });

export const getLeft = (
  bcr: DOMRect,
  containerWidth: number,
  isMounted: boolean = true
) => {
  const vw = document.documentElement.clientWidth;
  if (bcr.left + containerWidth >= vw) {
    if (!isMounted) {
      return vw - (bcr.left + containerWidth) - 5 + window.scrollX;
    }
    return bcr.left - (bcr.left + containerWidth - vw) - 5 + window.scrollX;
  }

  if (!isMounted) return "0";

  return bcr.left + window.scrollX;
};

export const parseValToNum = (value?: string | number) => {
  if (typeof value === "string") {
    return Number(value.match(/(.+)(px|%)/)![1])!;
  }

  return value || 0;
};

export const reflow = () => document.body.clientWidth;

export const getWidth = ({
  viewportUnit,
  minWidth,
  maxWidth,
}: {
  viewportUnit: number;
  minWidth: number;
  maxWidth: number;
}) => {
  const vwWidth = document.documentElement.clientWidth;
  const width = vwWidth * (viewportUnit / 100);

  if (width < minWidth) return minWidth;
  if (width > maxWidth) return maxWidth;
  return width;
};

export const toggleAnimation = ({
  includeOverlay,
  onBeforeEnter,
}: {
  includeOverlay?: boolean;
  onBeforeEnter?: (el: Element) => void;
} = {}) => {
  if (!settings.animation.enable) {
    return {};
  }
  const overlay = includeOverlay
    ? { overlay: { class: "overlay", animation: { name: "overlay-a" } } }
    : {};

  const onBeforeEnterCb = onBeforeEnter ? { onBeforeEnter } : {};
  return {
    animation: { name: "popup", ...onBeforeEnterCb },
    ...overlay,
  };
};
