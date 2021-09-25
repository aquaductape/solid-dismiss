type IDark = {
  "--main-blue": "#2a398b";
  "--secondary-blue": "#4088d3";
  "--dark-blue": "#1f2b6e";
  "--hovered-blue": "#26245e";
  "--main-grey": "#625e76";
  "--secondary-grey": "#8184a3";
  "--dark-grey": "#534f66";
  "--hovered-grey": "#454157";
  "--focus": "#fff";
  "--focus-blur": "#625cff";
  "--focus-blur-spread": "2px";
  "--logo-shadow": "drop-shadow(-1px 2px 0px #000)";
  "--bg": "#201d26";
  "--text": "#cfcfcf";
  "--dropdown-bg": "#2c2835";
  "--dropdown-btn": "rgb(0, 0, 0)";
  "--dropdown-root-bg": "#2d2837";
  "--dropdown-root-border": "#635f75";
  "--dropdown-root-shadow": "#000";
  "--list-item-hover": "#3e384a";
  "--list-item-active": "#ccc6e4";
  "--list-item-active-txt": "#000";
  "--select-btn-bg": "#9691ac";
  "--select-btn-bg-hover": "#b0aaca";
  "--color-scheme": "dark";
  "--nav-item-bg": "#000";
  "--code-bg": "#252436";
  "--code-actual-text": "#d5dbff";
  "--code-text": "var(--code-actual-text)";
  "--token-keyword": "#7777ca";
  "--token-punctuation": "#58a6da";
  "--token-operator": "#b117ce";
  "--token-boolean": "#c428e7";
  "--token-function": "#cd02c5";
  "--token-string": "#498cff";
  "--token-attr-value": "#498cff";
  "--token-class-name": "#ff00c9";
  "--token-attr-name": " #9777ff";
  "--token-tag": "#8181cd";
  "--token-plain-text": "#a0b6d4";
  "--token-script": "var(--code-actual-text)";
  "--token-language-javascript": "#000";
  "--token-comment": "#4a6078";
  "--inline-code-bg": "var(--code-bg)";
  "--inline-code-color": "#fff";
};
type ILight = {
  "--main-blue": "#142cb0";
  "--secondary-blue": "#00bcd4";
  "--dark-blue": "#112699";
  "--hovered-blue": "#0c0957";
  "--main-grey": "#cfcbea";
  "--secondary-grey": "#dbddff";
  "--dark-grey": "#b4afd2";
  "--hovered-grey": "#918cad";
  "--focus": "#000";
  "--focus-blur": "#0627e0";
  "--focus-blur-spread": "0px";
  "--logo-shadow": "none";
  "--bg": "#f3effd";
  "--text": "#000";
  "--dropdown-bg": "#f3effd";
  "--dropdown-btn": "rgba(10, 10, 60, 57%)";
  "--dropdown-root-bg": "#fff";
  "--dropdown-root-border": "#bcb7d4";
  "--dropdown-root-shadow": "#22243ab8";
  "--list-item-hover": "#dbd8eb";
  "--list-item-active": "#3b374c";
  "--list-item-active-txt": "#fff";
  "--select-btn-bg": "#b2add0";
  "--select-btn-bg-hover": "#9d98bc";
  "--color-scheme": "light";
  "--nav-item-bg": "var(--main-grey)";
  "--code-actual-text": "#000000";
  "--code-bg": "#e7e6f7";
  "--code-text": "var(--code-actual-text)";
  "--token-keyword": "#4141ab";
  "--token-punctuation": "#196191";
  "--token-operator": "#8f389f";
  "--token-boolean": "#c428e7";
  "--token-function": "#cd02c5";
  "--token-string": "#0000c6";
  "--token-attr-value": "#0000c6";
  "--token-class-name": "#db2982";
  "--token-attr-name": "#3500e7";
  "--token-tag": "#1d1dac";
  "--token-plain-text": "#304463";
  "--token-script": "var(--code-actual-text)";
  "--token-language-javascript": "#000";
  "--token-comment": "#8a9fb5";
  "--inline-code-bg": "var(--code-bg)";
  "--inline-code-color": "#000";
};
type IThemeConfig = {
  dark: IDark;
  light: ILight;
};
export const themeConfig: IThemeConfig = {
  dark: {
    "--main-blue": "#2a398b",
    "--secondary-blue": "#4088d3",
    "--dark-blue": "#1f2b6e",
    "--hovered-blue": "#26245e",
    "--main-grey": "#625e76",
    "--secondary-grey": "#8184a3",
    "--dark-grey": "#534f66",
    "--hovered-grey": "#454157",
    "--focus": "#fff",
    "--focus-blur": "#625cff",
    "--focus-blur-spread": "2px",
    "--logo-shadow": "drop-shadow(-1px 2px 0px #000)",
    "--bg": "#201d26",
    "--text": "#cfcfcf",
    "--dropdown-bg": "#2c2835",
    "--dropdown-btn": "rgb(0, 0, 0)",
    "--dropdown-root-bg": "#2d2837",
    "--dropdown-root-border": "#635f75",
    "--dropdown-root-shadow": "#000",
    "--list-item-hover": "#3e384a",
    "--list-item-active": "#ccc6e4",
    "--list-item-active-txt": "#000",
    "--select-btn-bg": "#9691ac",
    "--select-btn-bg-hover": "#b0aaca",
    "--color-scheme": "dark",
    "--nav-item-bg": "#000",
    "--code-bg": "#252436",
    "--code-actual-text": "#d5dbff",
    "--code-text": "var(--code-actual-text)",
    "--token-keyword": "#7777ca",
    "--token-punctuation": "#58a6da",
    "--token-operator": "#b117ce",
    "--token-boolean": "#c428e7",
    "--token-function": "#cd02c5",
    "--token-string": "#498cff",
    "--token-attr-value": "#498cff",
    "--token-class-name": "#ff00c9",
    "--token-attr-name": " #9777ff",
    "--token-tag": "#8181cd",
    "--token-plain-text": "#a0b6d4",
    "--token-script": "var(--code-actual-text)",
    "--token-language-javascript": "#000",
    "--token-comment": "#4a6078",
    "--inline-code-bg": "var(--code-bg)",
    "--inline-code-color": "#fff",
  },
  light: {
    "--main-blue": "#142cb0",
    "--secondary-blue": "#00bcd4",
    "--dark-blue": "#112699",
    "--hovered-blue": "#0c0957",
    "--main-grey": "#cfcbea",
    "--secondary-grey": "#dbddff",
    "--dark-grey": "#b4afd2",
    "--hovered-grey": "#918cad",
    "--focus": "#000",
    "--focus-blur": "#0627e0",
    "--focus-blur-spread": "0px",
    "--logo-shadow": "none",
    "--bg": "#f3effd",
    "--text": "#000",
    "--dropdown-bg": "#f3effd",
    "--dropdown-btn": "rgba(10, 10, 60, 57%)",
    "--dropdown-root-bg": "#fff",
    "--dropdown-root-border": "#bcb7d4",
    "--dropdown-root-shadow": "#22243ab8",
    "--list-item-hover": "#dbd8eb",
    "--list-item-active": "#3b374c",
    "--list-item-active-txt": "#fff",
    "--select-btn-bg": "#b2add0",
    "--select-btn-bg-hover": "#9d98bc",
    "--color-scheme": "light",
    "--nav-item-bg": "var(--main-grey)",
    "--code-actual-text": "#000000",
    "--code-bg": "#e7e6f7",
    "--code-text": "var(--code-actual-text)",
    "--token-keyword": "#4141ab",
    "--token-punctuation": "#196191",
    "--token-operator": "#8f389f",
    "--token-boolean": "#c428e7",
    "--token-function": "#cd02c5",
    "--token-string": "#0000c6",
    "--token-attr-value": "#0000c6",
    "--token-class-name": "#db2982",
    "--token-attr-name": "#3500e7",
    "--token-tag": "#1d1dac",
    "--token-plain-text": "#304463",
    "--token-script": "var(--code-actual-text)",
    "--token-language-javascript": "#000",
    "--token-comment": "#8a9fb5",
    "--inline-code-bg": "var(--code-bg)",
    "--inline-code-color": "#000",
  },
};
export const changeTheme = (inputTheme: string) => {
  if (inputTheme === "dark") {
    const theme = themeConfig.dark;
    for (let key in theme) {
      // @ts-ignore
      setCSSVar(key, theme[key]);
    }
    localStorage.setItem("theme", inputTheme);
  } else {
    const theme = themeConfig.light;
    for (let key in theme) {
      // @ts-ignore
      setCSSVar(key, theme[key]);
    }
    localStorage.setItem("theme", inputTheme);
  }
};

export const setCSSVar = (property: string, color: string) => {
  document.documentElement.style.setProperty(property, color);
};

export const getCurrentTheme = () => {
  try {
    const currentTheme = localStorage.getItem("theme") || "light";
    return currentTheme;
  } catch (err) {
    return "light";
  }
};

export const initialSetTheme = () => {
  const currentTheme = getCurrentTheme();

  changeTheme(currentTheme);
};
