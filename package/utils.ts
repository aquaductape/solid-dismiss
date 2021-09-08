export const parseValToNum = (value?: string | number) => {
  if (typeof value === "string") {
    return Number(value.match(/(.+)(px|%)/)![1])!;
  }

  return value || 0;
};

export const focusableSelectors =
  'button, [href], input, select, textarea, details, [contentEditable=true], [tabindex]:not([tabindex="-1"])';

export const getNextFocusableElement = ({
  from = document.activeElement as HTMLElement,
  stopAtElement,
  ignoreElement = [],
  direction = "forwards",
}: {
  from: Element;
  stopAtElement?: HTMLElement;
  ignoreElement?: HTMLElement[];
  direction?: "forwards" | "backwards";
}) => {
  const parent = from.parentElement!;
  const visitedElement = from;

  if (!visitedElement) return null;

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
          if (child.matches(focusableSelectors)) return child as HTMLElement;
          const el = child.querySelector(focusableSelectors);
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
    } else {
      for (let i = childrenCount - 1; i >= 0; i--) {
        const child = children[i];

        if (hasPassedVisitedElement) {
          if (ignoreElement.some((el) => el === child)) continue;
          if (child.matches(focusableSelectors)) return child as HTMLElement;
          const el = inverseQuerySelector(child, focusableSelectors);
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

  return traverseNextSiblingsThenUp(parent, visitedElement);
};

/**
 *
 * like querySelector but iterates through children backwards, which results that the selector matches last child first.
 */
export const inverseQuerySelector = (
  el: Element,
  selector: string
): HTMLElement | null => {
  let foundElement: HTMLElement | null = null;

  const query = (el: Element) => {
    const children = el.children;
    const childrenCount = children.length;

    for (let i = childrenCount - 1; i >= 0; i--) {
      const child = children[i];

      if (foundElement) return foundElement;

      if (child.matches(selector)) {
        foundElement = child as HTMLElement;
        return foundElement;
      }

      query(child);
    }

    return foundElement;
  };

  return query(el);
};
