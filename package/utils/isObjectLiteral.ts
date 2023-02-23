export const isObjectLiteral = <T>(value: T) =>
  Object.getPrototypeOf(value) === Object.prototype;
