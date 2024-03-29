import { TLocalState } from "../local/localState";
import { getMenuButton } from "../local/menuButton";
import { isObjectLiteral } from "./isObjectLiteral";
import { getNextTabbableElement } from "./tabbing";

export const queryElement = (
  state: Partial<TLocalState>,
  {
    inputElement,
    type,
    subType,
  }: {
    /**
     * `"menuPopup"` | `"menuButton"` | `any`
     */
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
  if (inputElement === "menuButton") {
    return getMenuButton(state.menuBtnEls!);
  }
  if (type === "focusElementOnOpen") {
    if (isObjectLiteral(inputElement)) {
      return queryElement(state, {
        inputElement: inputElement.target,
        type: "focusElementOnOpen",
      });
    }
    if (inputElement === "none") return null as any;
    if (inputElement === "firstChild") {
      return getNextTabbableElement({
        from: state.focusSentinelBeforeEl!,
        stopAtRootElement: state.containerEl!,
      })!;
    }
    if (typeof inputElement === "string") {
      return state.containerEl?.querySelector(inputElement) as HTMLElement;
    }
    if (inputElement instanceof Element) {
      return inputElement as HTMLElement;
    }
    if (typeof inputElement === "object") {
      return queryElement(state, {
        inputElement: inputElement.target,
        type: "focusElementOnOpen",
      });
    }
    const component = inputElement();
    if (typeof component === "string") {
      return state.containerEl?.querySelector(component) as HTMLElement;
    }
    return component;
  }
  if (inputElement == null && type === "menuPopup") {
    if (!state.containerEl) return null as any;
    if (state.menuPopupEl) return state.menuPopupEl;
    return state.containerEl.children[1] as HTMLElement;
  }
  if (typeof inputElement === "string" && type === "menuButton") {
    return document.querySelector(inputElement) as HTMLElement;
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
