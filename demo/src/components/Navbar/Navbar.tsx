import c from "./Navbar.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const s = scopeModuleClasses(c);
import { Icon } from "@amoutonbrady/solid-heroicons";
import { sun, moon } from "@amoutonbrady/solid-heroicons/solid";
import { IconGithub, IconLogo } from "../icons";
import { createSignal, Show, onMount, createEffect, on } from "solid-js";
import { changeTheme, getCurrentTheme } from "../../lib/theme";
import Dismiss from "../../../../package/index";
import context from "../../global/global";

const Navbar = () => {
  const [theme, setTheme] = createSignal(getCurrentTheme());
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  const onClickTheme = () => {
    setTheme(theme() === "light" ? "dark" : "light");
  };

  createEffect(() => {
    changeTheme(theme());
  });

  createEffect(() => {
    console.log(context.nav.logoActive);
  });

  const onClickHome = (e: Event) => {
    e.preventDefault();

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <header class={s("navbar")}>
      <div id="navbar-content" class={s("content-container")}>
        <div
          class={s("shadow", (context.nav.logoActive || open()) && "active")}
        ></div>
        <div class={s("content")}>
          <a
            href="/"
            onClick={onClickHome}
            class={s("logo", context.nav.logoActive && "active") + " focusable"}
            tabindex={context.nav.logoActive ? "0" : "-1"}
            aria-hidden={context.nav.logoActive ? "false" : "true"}
          >
            {/* Solid Dismiss */}
            <IconLogo></IconLogo>
          </a>

          <nav class={s("nav")}>
            <ul class={s("nav-list")}>
              <li>
                <a class={s("nav-item") + " focusable"} href="#examples">
                  Examples
                </a>
              </li>
              <li>
                <a class={s("nav-item") + " focusable"} href="#docs">
                  Docs
                </a>
              </li>
            </ul>
          </nav>
          <div class={s("utils")}>
            <button class={s("dark-toggle")} onClick={onClickTheme}>
              <Icon path={theme() === "light" ? sun : moon} />
            </button>
            <a
              class={s("github") + " focusable"}
              href="https://github.com/aquaductape/solid-dismiss"
              target="_blank"
            >
              <IconGithub />
            </a>
          </div>
          <button
            class={
              s("hamburger-container") +
              " hamburger hamburger--collapse focusable"
            }
            classList={{ "is-active": open() }}
            ref={btnEl}
            type="button"
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
        </div>
        <Dismiss
          menuButton={btnEl}
          open={open}
          setOpen={setOpen}
          animation={{
            onEnter: (el, done) => {
              const elHeight = el.clientHeight;
              const a = el.animate(
                [{ height: "0px" }, { height: `${elHeight}px` }],
                { duration: 100 }
              );

              a.onfinish = () => done();
            },
            onExit: (el, done) => {
              const elHeight = el.clientHeight;
              const a = el.animate(
                [{ height: `${elHeight}px` }, { height: "0px" }],
                { duration: 100 }
              );

              a.onfinish = () => done();
            },
          }}
        >
          <nav class={s("nav-mobile")}>
            <ul class={s("nav-list")}>
              <li>
                <a class={s("nav-item") + " focusable"} href="#examples">
                  Examples
                </a>
              </li>
              <li>
                <a class={s("nav-item") + " focusable"} href="#docs">
                  Docs
                </a>
              </li>
            </ul>
          </nav>
        </Dismiss>
      </div>
    </header>
  );
};

export default Navbar;
