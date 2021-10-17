import { TLocalState } from "./localState";

/**
 *  Iterate stack backwards, checks item, pass it close callback. First falsy value breaks iteration.
 */
export const checkThenClose = <T extends unknown>(
  arr: T[],
  checkCb: (item: T) => T | null | undefined,
  destroyCb: (item: T) => void
) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = checkCb(arr[i]);

    if (item) {
      destroyCb(item);
      continue;
    }

    return;
  }
};

export const findItemReverse = <T extends unknown>(
  arr: T[],
  cb: (item: T) => any
): [T | null, number] => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i];
    const foundItem = cb(item);
    if (foundItem) {
      return [item, i];
    }
  }

  return [null, -1];
};

export const parseValToNum = (value?: string | number) => {
  if (typeof value === "string") {
    return Number(value.match(/(.+)(px|%)/)![1])!;
  }

  return value || 0;
};

export const camelize = (s: string) =>
  s.replace(/-./g, (x) => x.toUpperCase()[1]);

export const _tabbableSelectors = [
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

export const matchByFirstChild = ({
  parent,
  matchEl,
}: {
  parent: HTMLElement | Element;
  matchEl: HTMLElement;
}) => {
  if (parent === matchEl) return true;

  const query = (el: Element): boolean => {
    if (!el) return false;
    const child = el.children[0];

    if (child === matchEl) {
      return true;
    }

    return query(child);
  };

  return query(parent);
};

export const queryElement = (
  state: Partial<TLocalState>,
  {
    inputElement,
    type,
    subType,
  }: {
    inputElement: any;
    type?:
      | "menuButton"
      | "menuPopup"
      | "closeButton"
      | "focusElementOnClose"
      | "focusElementOnOpen";
    subType?:
      | "tabForwards"
      | "tabBackwards"
      | "click"
      | "escapeKey"
      | "scrolling";
  }
): HTMLElement => {
  if (inputElement === "menuPopup") {
    return state.menuPopupEl!;
  }
  if (type === "focusElementOnOpen") {
    if (typeof inputElement === "string") {
      return state.containerEl?.querySelector(inputElement) as HTMLElement;
    }
    if (inputElement instanceof Element) {
      return inputElement as HTMLElement;
    }
    return inputElement();
  }
  if (inputElement == null && type === "menuPopup") {
    if (!state.containerEl) return null as any;
    if (state.menuPopupEl) return state.menuPopupEl;
    return state.containerEl.children[1] as HTMLElement;
  }
  if (typeof inputElement === "string" && type === "menuButton") {
    return document.querySelector(inputElement) as HTMLElement;
  }
  if (typeof inputElement === "string" && type === "closeButton") {
    if (!state.containerEl) return null as any;
    return state.containerEl.querySelector(inputElement) as HTMLElement;
  }
  if (typeof inputElement === "string") {
    return document.querySelector(inputElement) as HTMLElement;
  }
  if (inputElement instanceof Element) {
    return inputElement as HTMLElement;
  }

  if (typeof inputElement === "function") {
    const result = inputElement();
    if (result instanceof Element) {
      return result as HTMLElement;
    }
    if (type === "closeButton") {
      if (!state.containerEl) return null as any;
      return state.containerEl.querySelector(result) as HTMLElement;
    }
  }

  if (type === "focusElementOnClose") {
    if (!inputElement) return null as any;

    switch (subType) {
      case "tabForwards":
        return queryElement(state, { inputElement: inputElement.tabForwards });
      case "tabBackwards":
        return queryElement(state, { inputElement: inputElement.tabBackwards });
      case "click":
        return queryElement(state, { inputElement: inputElement.click });
      case "escapeKey":
        return queryElement(state, { inputElement: inputElement.escapeKey });
      case "scrolling":
        return queryElement(state, { inputElement: inputElement.scrolling });
    }
  }

  if (inputElement == null) return null as any;

  if (Array.isArray(inputElement)) {
    return inputElement.map((el) =>
      queryElement(state, { inputElement: el, type })
    ) as any;
  }

  for (const key in inputElement as { [key: string]: any }) {
    const item = (inputElement as { [key: string]: any })[key];
    return queryElement(state, { inputElement: item });
  }

  return null as any;
};

/**
 * Why this might be better than direct check of CSS display property? Because you do not need to check all parent elements. If some parent element has display: none, its children are hidden too but still has `element.style.display !== 'none'`
 */
export const hasDisplayNone = (el: HTMLElement) =>
  el.offsetHeight === 0 && el.offsetWidth === 0;
