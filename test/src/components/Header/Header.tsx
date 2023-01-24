import settings, { setSettings } from "../../utils/globalSettings";

const Header = () => {
  return (
    <header>
      <div>
        <label id="enable-animations">
          enable animations{" "}
          <input
            type="checkbox"
            checked={settings.animation.enable}
            onChange={(e) => {
              const scrollY = window.scrollY;
              setSettings(
                (s) => (s.animation.enable = e.currentTarget.checked)
              );
              setTimeout(() => {
                window.scrollTo({ top: scrollY, behavior: "auto" });
              });
            }}
          />
        </label>
        <label id="close-menuBtn-reclick">
          close menuBtn reclick{" "}
          <input
            type="checkbox"
            checked={settings.closeMenuBtnReclick}
            onChange={(e) => {
              const scrollY = window.scrollY;
              setSettings(
                (s) => (s.closeMenuBtnReclick = e.currentTarget.checked)
              );
              setTimeout(() => {
                window.scrollTo({ top: scrollY, behavior: "auto" });
              });
            }}
          />
        </label>
      </div>
      {/* <Show when={settings.animation.enable}>
        <label>
          animation duration{" "}
          <input
            type="text"
            style="width: 50px; text-align: center; margin-right: 5px;"
            // size={`${settings.animation.duration}`.length}
            value={settings.animation.duration}
            onChange={(e) =>
              setSettings(
                (s) => (s.animation.duration = e.currentTarget.valueAsNumber)
              )
            }
          />
          <span aria-hidden="true">ms</span>
        </label>
      </Show> */}
      <div></div>
    </header>
  );
};

export default Header;
