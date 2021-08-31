export const parseValToNum = (value?: string | number) => {
  if (typeof value === "string") {
    return Number(value.match(/(.+)(px|%)/)![1])!;
  }

  return value || 0;
};

const focusableSelectors =
  'button, [href], input, select, textarea, details, [contentEditable=true], [tabindex]:not([tabindex="-1"])';

export const getNextFocusableElement = ({
  activeElement = document.activeElement as HTMLElement,
  stopAtElement,
}: {
  activeElement: HTMLElement;
  stopAtElement?: HTMLElement;
}) => {
  const parent = activeElement.parentElement!;
  const visitedElement = activeElement;

  if (!visitedElement) return null;

  const traverseNextSiblingsThenUp = (
    parent: HTMLElement,
    visitedElement: HTMLElement
  ): HTMLElement | null => {
    let hasPastVisitedElement = false;

    for (const child of parent.children) {
      if (hasPastVisitedElement) {
        if (child.matches(focusableSelectors)) return child as HTMLElement;
        const el = queryFocusableElement({ parent: child });
        if (el) return el as HTMLElement;
        continue;
      }
      if (child === visitedElement) {
        hasPastVisitedElement = true;
        continue;
      }
      if (child === stopAtElement) {
        return null;
      }
    }

    visitedElement = parent;
    parent = parent.parentElement!;

    if (!parent) return null;

    return traverseNextSiblingsThenUp(parent, visitedElement);
  };

  return traverseNextSiblingsThenUp(parent, visitedElement);
};

export const queryFocusableElement = ({
  parent,
  all = false,
}: {
  parent: Element | HTMLElement;
  all?: boolean;
}) => {
  if (all) {
    return parent.querySelectorAll(
      focusableSelectors
    ) as NodeListOf<HTMLElement>;
  }
  return parent.querySelector(focusableSelectors) as HTMLElement;
};
