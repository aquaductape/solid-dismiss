function userAgent(pattern: RegExp) {
  // @ts-ignore
  if (typeof window !== "undefined" && window.navigator) {
    return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
  }
}
const iOS = userAgent(/iP(ad|od|hone)/i);
const iOS13 =
  typeof window !== "undefined"
    ? iOS && "download" in document.createElement("a")
    : null;

if (iOS && !iOS13) {
  // const html = document.querySelector("html")!;
  // html.style.cursor = "pointer";
  // // @ts-ignore
  // html.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
  document.body.addEventListener("click", () => {});
}
