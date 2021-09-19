import settings, { setSettings } from "../../utils/globalSettings";

const Header = () => {
  return (
    <header>
      <div>
        <label>
          enable animations{" "}
          <input
            type="checkbox"
            checked={settings.animation.enable}
            onChange={(e) =>
              setSettings((s) => (s.animation.enable = e.currentTarget.checked))
            }
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
