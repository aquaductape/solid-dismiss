import { hasDisplayNone } from "./hasDisplayNone";

/**
 * checks if element is hidden or invisible
 *
 * The shallow checking is whether element has css `visibility: hidden` property
 */
const isHiddenOrInvisbleShallow = (el: HTMLElement) => {
  const isInvisible = (el: HTMLElement) => {
    const checkByStyle = (style: CSSStyleDeclaration) =>
      style.visibility === "hidden";

    if ((el.style && checkByStyle(el.style)) || el.hidden) return true;

    const style = window.getComputedStyle(el);
    if (!style || checkByStyle(style)) return true;

    return false;
  };
  return hasDisplayNone(el) || isInvisible(el);
};

export default isHiddenOrInvisbleShallow;
