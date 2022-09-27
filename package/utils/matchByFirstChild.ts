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
