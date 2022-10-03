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
          const el = queryTabbableElement(child, tabbableSelectors, direction);

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

          const el = queryTabbableElement(child, tabbableSelectors, direction);
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

const isHidden = (el: HTMLElement, windowContext: Window = window) => {
  const checkByStyle = (style: CSSStyleDeclaration) =>
    style.display === "none" || style.visibility === "hidden";

  if ((el.style && checkByStyle(el.style)) || el.hidden) return true;

  const style = windowContext.getComputedStyle(el);
  if (!style || checkByStyle(style)) return true;

  return false;
};

export const queryTabbableElement = (
  el: Element,
  selectors: string = _tabbableSelectors,
  iterationDirection: "forwards" | "backwards" = "forwards",
  windowContext: Window = window,
  init: boolean = true
): HTMLElement | null => {
  const queryChild = (
    el: Element
  ): { el: Element; matched: boolean; windowContext?: Window } => {
    if (!el.matches(selectors))
      return {
        el,
        matched: false,
      };

    const tabindex = el.getAttribute("tabindex");
    if (isIframe(el) && (!tabindex || tabindex === "-1")) {
      const iframeWindow = getIframeWindow(
        el as HTMLIFrameElement
      ) as unknown as Window;
      if (!iframeWindow) {
        return { el, matched: true };
      }
      el = iframeWindow.document.documentElement;
      windowContext = iframeWindow;

      return { el, matched: false, windowContext: iframeWindow };
    }

    return {
      el,
      matched: true,
    };
  };

  if (init) {
    if (isHidden(el as HTMLElement, windowContext)) return null;

    const {
      el: elResult,
      matched,
      windowContext: windowContextResult,
    } = queryChild(el);
    el = elResult;
    if (matched) return el as HTMLElement;
    windowContext = windowContextResult || windowContext;

    return queryTabbableElement(
      el,
      selectors,
      iterationDirection,
      windowContext,
      false
    );
  }

  const shadowRoot = el.shadowRoot;
  if (shadowRoot) el = shadowRoot as unknown as Element;

  const children = el.children;
  const childrenLength = children.length;

  const iterateChild = (
    el: Element
  ): { returnVal?: Element; continue?: boolean } | null => {
    if (isHidden(el as HTMLElement, windowContext))
      return {
        continue: true,
      };

    const {
      el: elResult,
      matched,
      windowContext: windowContextResult,
    } = queryChild(el);

    el = elResult;
    windowContext = windowContextResult || windowContext;

    if (matched) {
      return { returnVal: el };
    }

    const foundChild = queryTabbableElement(
      el,
      selectors,
      iterationDirection,
      windowContext,
      false
    );
    if (foundChild) return { returnVal: foundChild };

    return null;
  };

  if (iterationDirection === "forwards") {
    for (let i = 0; i < childrenLength; i++) {
      let child = children[i];
      const result = iterateChild(child);

      if (result) {
        if (result.continue) continue;
        if (result.returnVal) return result.returnVal as HTMLElement;
      }
    }
  } else {
    for (let i = childrenLength - 1; i >= 0; i--) {
      let child = children[i];
      const result = iterateChild(child);

      if (result) {
        if (result.continue) continue;
        if (result.returnVal) return result.returnVal as HTMLElement;
      }
    }
  }

  return null;
};

const hasShadowParent = (element: Element) => {
  while (element.parentNode && (element = element.parentNode as Element)) {
    if (element instanceof ShadowRoot) {
      return true;
    }
  }
  return false;
};

const isIframe = (el: Element) => el.tagName === "IFRAME";
