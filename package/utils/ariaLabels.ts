export const addAriaLabels = (
  targetEl: HTMLElement,
  containerEl: HTMLElement
) => {
  targetEl.setAttribute("aria-expanded", "true");
};

export const removeAriaLabels = (
  targetEl: HTMLElement,
  containerEl: HTMLElement
) => {
  targetEl.setAttribute("aria-expanded", "false");
};
