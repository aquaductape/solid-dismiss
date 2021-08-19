import { Icon } from "@amoutonbrady/solid-heroicons";
import { sun, moon } from "@amoutonbrady/solid-heroicons/solid";
import { IconGithub, IconLogo } from "../icons";
import { createSignal, Show, onMount, createEffect, on } from "solid-js";
import { changeTheme, getCurrentTheme } from "../../lib/theme";

const Navbar = () => {
  const [theme, setTheme] = createSignal(getCurrentTheme());

  const onClickTheme = () => {
    setTheme(theme() === "light" ? "dark" : "light");
  };

  createEffect(() => {
    changeTheme(theme());
  });

  return (
    <header class="navbar">
      <div className="content">
        <div class="logo">
          {/* <IconLogo></IconLogo> */}
          Solid Dismiss
        </div>

        <nav></nav>
        <div class="utils">
          <button class="dark-toggle" onClick={onClickTheme}>
            <Icon path={theme() === "light" ? sun : moon} />
          </button>
          <a
            class="github"
            href="https://github.com/aquaductape/solid-dismiss"
            target="_blank"
          >
            <IconGithub />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
