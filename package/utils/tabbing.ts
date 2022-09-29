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

let willWrap = false;
let originalFrom: HTMLElement | null = null;

// TODO: does this work with web components, due to shadow root

type GetNextTabbableElement = {
  /**
   * Sets the relative position on getting the next tabbable element
   *
   * If `"activeElement"`, gets the current active element either from document or iframe context.
   *
   * If you are passing an iframe element, but intending to use current active element inside that iframe context, then use object argument `{ el: Element; getActiveElement: true }`
   */
  from:
    | Element
    | "activeElement"
    | { el: Element; getActiveElement: boolean; isIframe: boolean };
  direction?: "forwards" | "backwards";
  stopAtRootElement?: HTMLElement;
  /**
   * Skips tabbable elements
   *
   * @defaultValue `undefined`
   */
  ignoreElement?: HTMLElement[];
  allowSelectors?: string[];
  /**
   * To be used with `stopAtRootElement`.
   *
   * When `from` is the last tabbable item within `stopAtRootElement`, when continueing in the same direction, the first item will be focused within `stopAtRootElement`.
   *
   * @defaultValue `false`
   */
  wrap?: boolean;
};

export const getNextTabbableElement = ({
  from: _from,
  stopAtRootElement: stopAtRootElement,
  ignoreElement = [],
  allowSelectors,
  direction = "forwards",
  wrap,
}: GetNextTabbableElement) => {
  let fromResult!: Element;
  let _isFromElIframe = false;

  if (!(_from instanceof Element)) {
    if (_from === "activeElement") {
      const activeElement = document.activeElement!;
      _isFromElIframe = isIframe(activeElement);
      fromResult = getActiveElement(activeElement);
    }
    if (typeof _from === "object") {
      if (_from.getActiveElement) {
        fromResult = getActiveElement(_from.el);
      }
      _isFromElIframe = _from.isIframe;
    }
  } else {
    _isFromElIframe = isIframe(_from);
    fromResult = _from;
  }

  const from = fromResult;
  const parent = from.parentElement!;
  const isFromElIframe = _isFromElIframe;
  const visitedElement = from;
  const tabbableSelectors =
    _tabbableSelectors + (allowSelectors ? "," + allowSelectors.join(",") : "");

  if (!visitedElement) return null;

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
        if (originalFrom === child) continue;

        if (
          !checkHiddenAncestors(child as HTMLElement, parent, contentWindow)
        ) {
          if (isIframe(child)) {
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
      if (originalFrom === child) continue;

      if (!checkHiddenAncestors(child as HTMLElement, parent, contentWindow)) {
        if (isIframe(child)) {
          const iframeChild = queryIframe(child);
          if (iframeChild) return iframeChild;
        }

        return child;
      }
    }

    return null;
  };

  const queryIframe = (
    el: Element,
    inverseQuery?: boolean
  ): HTMLElement | null => {
    if (!el) return null;
    if (!isIframe(el)) return el as HTMLElement;
    const iframeWindow = getIframeWindow(
      el as HTMLIFrameElement
    ) as unknown as Window;

    // here iframe will get focused whether it has tab index or not, so checking tabindex conditional a couple lines down is redundant
    if (!iframeWindow) return el as HTMLElement;
    const iframeDocument = iframeWindow.document;
    // conditional used to be here
    // if (!iframeWindow) return el as HTMLElement;
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

    if (willWrap) {
      hasPassedVisitedElement = true;
    }

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
        if (child === stopAtRootElement) {
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
        if (child === stopAtRootElement) {
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

    if (!parent && isFromElIframe) {
      // TODO: only get's top level iframe, should get correct iframe
      const iframe = document.activeElement;

      if (iframe && isIframe(iframe)) {
        visitedElement = iframe;
        parent = iframe.parentElement!;
      }
    }

    if (!parent) {
      return null;
    }

    return traverseNextSiblingsThenUp(parent, visitedElement);
  };

  let result = traverseNextSiblingsThenUp(parent, visitedElement);

  if (!result && wrap && stopAtRootElement) {
    // direction = direction === "forwards" ? "backwards" : "forwards";

    willWrap = true;
    originalFrom = from as HTMLElement;
    result = getNextTabbableElement({
      from: stopAtRootElement,
      allowSelectors,
      direction,
      ignoreElement,
      // stopAtElement,
      wrap: false,
    }) as HTMLElement | null;
  }
  willWrap = false;
  originalFrom = null;

  return result;
};

const getIframeWindow = (iframe: HTMLIFrameElement) => {
  try {
    return iframe.contentWindow;
  } catch (e) {
    return null;
  }
};

const getIframeDocument = (iframe: HTMLIFrameElement) => {
  const iframeWindow = getIframeWindow(
    iframe as HTMLIFrameElement
  ) as unknown as Window;

  if (!iframeWindow) return null;

  return iframeWindow.document as Document | null;
};

const getActiveElement = (el: Element) => {
  // TODO: only goes one depth, should go infinitly
  if (!isIframe(el)) return el;
  const iframeDocument = getIframeDocument(el as HTMLIFrameElement);
  if (!iframeDocument) return el;

  return iframeDocument.activeElement || el;
};

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

const isIframe = (el: Element) => el.tagName === "IFRAME";
