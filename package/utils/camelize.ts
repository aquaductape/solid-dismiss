export const camelize = (s: string) =>
  s.replace(/-./g, (x) => x.toUpperCase()[1]);
