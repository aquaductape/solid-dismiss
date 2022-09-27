/**
 * Why this might be better than direct check of CSS display property? Because you do not need to check all parent elements. If some parent element has display: none, its children are hidden too but still has `element.style.display !== 'none'`
 */
export const hasDisplayNone = (el: HTMLElement) =>
  el.offsetHeight === 0 && el.offsetWidth === 0;
