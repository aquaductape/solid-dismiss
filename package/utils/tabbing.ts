const _tabbableSelectors = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "[tabindex]",
  "[contentEditable=true]",
].reduce((a, c, idx) => `${a}${idx ? "," : ""}${c}:not([tabindex="-1"])`, "");

export const getNextTabbableElement = ({
  from = document.activeElement as HTMLElement,
  stopAtElement,
  ignoreElement = [],
  allowSelectors,
  direction = "forwards",
}: {
  from: Element;
  stopAtElement?: HTMLElement;
  ignoreElement?: HTMLElement[];
  allowSelectors?: string[];
  direction?: "forwards" | "backwards";
}) => {
  const parent = from.parentElement!;
  const visitedElement = from;
  const tabbableSelectors =
    _tabbableSelectors + (allowSelectors ? "," + allowSelectors.join(",") : "");

  if (!visitedElement) return null;

  const isHidden = (el: HTMLElement, contentWindow: Window = window) => {
    const checkByStyle = (style: CSSStyleDeclaration) =>
      style.display === "none" || style.visibility === "hidden";

    if ((el.style && checkByStyle(el.style)) || el.hidden) return true;

    const style = contentWindow.getComputedStyle(el);
    if (!style || checkByStyle(style)) return true;

    return false;
  };

  const checkHiddenAncestors = (
    target: HTMLElement,
    parent: Element,
    contentWindow?: Window
  ) => {
    const ancestors = [];

    let node = target;
    if (isHidden(node)) return true;

    while (true) {
      node = node.parentElement as HTMLElement;
      if (!node || node === parent) {
        break;
      }
      ancestors.push(node);
    }

    for (const node of ancestors) {
      if (isHidden(node, contentWindow)) {
        return true;
      }
    }

    return false;
  };

  const checkChildren = (
    children: NodeListOf<Element>,
    parent: Element,
    reverse?: boolean,
    contentWindow?: Window
  ) => {
    const length = children.length;

    if (length && isHidden(parent as HTMLElement)) return null;

    if (reverse) {
      for (let i = length - 1; i > -1; i--) {
        const child = children[i];

        if (ignoreElement.some((el) => el.contains(child))) continue;

        if (
          !checkHiddenAncestors(child as HTMLElement, parent, contentWindow)
        ) {
          if (child.tagName === "IFRAME") {
            const iframeChild = queryIframe(child, reverse);
            if (iframeChild) return iframeChild;
          }

          return child;
        }
      }
      return null;
    }

    for (let i = 0; i < length; i++) {
      const child = children[i];

      if (ignoreElement.some((el) => el.contains(child))) continue;

      if (!checkHiddenAncestors(child as HTMLElement, parent, contentWindow)) {
        if (child.tagName === "IFRAME") {
          const iframeChild = queryIframe(child);
          if (iframeChild) return iframeChild;
        }

        return child;
      }
    }

    return null;
  };

  const getIframeWindow = (iframe: HTMLIFrameElement) => {
    try {
      return iframe.contentWindow;
    } catch (e) {
      return null;
    }
  };

  const queryIframe = (
    el: Element,
    inverseQuery?: boolean
  ): HTMLElement | null => {
    if (!el) return null;
    if (el.tagName !== "IFRAME") return el as HTMLElement;
    const iframeWindow = getIframeWindow(
      el as HTMLIFrameElement
    ) as unknown as Window;
    const iframeDocument = iframeWindow.document;
    if (!iframeWindow) return el as HTMLElement;
    const tabindex = el.getAttribute("tabindex");
    if (tabindex) return el as HTMLElement;

    const els = iframeDocument.querySelectorAll(tabbableSelectors);
    const result = checkChildren(
      els,
      iframeDocument.documentElement,
      inverseQuery,
      iframeWindow
    )!;
    return queryIframe(result) as HTMLElement;
  };

  const traverseNextSiblingsThenUp = (
    parent: Element,
    visitedElement: Element
  ): HTMLElement | null => {
    let hasPassedVisitedElement = false;

    const children = parent.children;
    const childrenCount = children.length;

    if (direction === "forwards") {
      for (let i = 0; i < childrenCount; i++) {
        const child = children[i];

        if (hasPassedVisitedElement) {
          if (ignoreElement.some((el) => el === child)) continue;
          if (child.matches(tabbableSelectors)) {
            if (isHidden(child as HTMLElement)) continue;

            const el = queryIframe(child);
            if (el) return el as HTMLElement;
            return child as HTMLElement;
          }

          const els = child.querySelectorAll(tabbableSelectors);
          const el = checkChildren(els, child);

          if (el) {
            return el as HTMLElement;
          }
          continue;
        }
        if (child === stopAtElement) {
          return null;
        }
        if (child === visitedElement) {
          hasPassedVisitedElement = true;
          continue;
        }
      }
    } else {
      for (let i = childrenCount - 1; i >= 0; i--) {
        const child = children[i];

        if (hasPassedVisitedElement) {
          if (ignoreElement.some((el) => el === child)) continue;
          if (child.matches(tabbableSelectors)) {
            if (isHidden(child as HTMLElement)) continue;
            const el = queryIframe(child);
            if (el) return el as HTMLElement;
            return child as HTMLElement;
          }
          const els = child.querySelectorAll(tabbableSelectors);

          const el = checkChildren(els, child, true);

          if (el) return el as HTMLElement;
          continue;
        }
        if (child === stopAtElement) {
          return null;
        }
        if (child === visitedElement) {
          hasPassedVisitedElement = true;
          continue;
        }
      }
    }

    visitedElement = parent;
    parent = parent.parentElement!;

    if (!parent) return null;

    return traverseNextSiblingsThenUp(parent, visitedElement);
  };

  const result = traverseNextSiblingsThenUp(parent, visitedElement);

  return result;
};
