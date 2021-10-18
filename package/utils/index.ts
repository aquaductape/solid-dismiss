import { TLocalState } from "../local/localState";
import { getNextTabbableElement } from "./tabbing";

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
    if (inputElement === "firstChild") {
      return getNextTabbableElement({
        from: state.focusSentinelBeforeEl!,
        stopAtElement: state.containerEl!,
      })!;
    }
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
