type IDark = {
  "--main-blue": "#2a398b";
  "--secondary-blue": "#4088d3";
  "--dark-blue": "#1f2b6e";
  "--hovered-blue": "#26245e";
  "--main-grey": "#a4a0bc";
  "--secondary-grey": "#c7caee";
  "--dark-grey": "#87839e";
  "--hovered-grey": "#6b6780";
  "--focus": "#fff";
  "--focus-blur": "#625cff";
  "--focus-blur-spread": "2px";
  "--logo-shadow": "drop-shadow(-1px 2px 0px #000)";
  "--bg": "#201d26";
  "--text": "#cfcfcf";
  "--dropdown-bg": "#2c2835";
  "--color-scheme": "dark";
  "--nav-item-bg": "#000";
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
  "--color-scheme": "light";
  "--nav-item-bg": "var(--main-grey)";
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
    "--main-grey": "#a4a0bc",
    "--secondary-grey": "#c7caee",
    "--dark-grey": "#87839e",
    "--hovered-grey": "#6b6780",
    "--focus": "#fff",
    "--focus-blur": "#625cff",
    "--focus-blur-spread": "2px",
    "--logo-shadow": "drop-shadow(-1px 2px 0px #000)",
    "--bg": "#201d26",
    "--text": "#cfcfcf",
    "--dropdown-bg": "#2c2835",
    "--color-scheme": "dark",
    "--nav-item-bg": "#000",
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
    "--color-scheme": "light",
    "--nav-item-bg": "var(--main-grey)",
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
