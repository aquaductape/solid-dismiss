import settings, { setSettings } from "../../utils/globalSettings";
import { Show } from "solid-js";

const Header = () => {
  return (
    <header>
      <p
        style="display: block; position: absolute; top: 0;
        left: 0; margin: 0; font-size: 14px;"
      >
        Note: Dismiss props are not reactive, refreshes page to update
      </p>
      <div>
        <label style="margin-right: 50px;">
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
