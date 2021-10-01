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
import smoothScrollTo from "../../lib/smoothScrollTo";

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

  const onClickHome = (e: Event) => {
    e.preventDefault();

    smoothScrollTo({ destination: 0, duration: 500 });
  };

  const onClickNavLink = (e: Event) => {
    const target = e.currentTarget as HTMLAnchorElement;
    e.preventDefault();

    const hrefAttrValue = target.getAttribute("href")!.slice(1);
    const el = document.getElementById(hrefAttrValue)!;

    smoothScrollTo({
      destination: el,
      duration: 500,
    });
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
                <a
                  class={s("nav-item") + " focusable"}
                  href="#examples"
                  onClick={onClickNavLink}
                >
                  <span>Examples</span>
                </a>
              </li>
              <li>
                <a
                  class={s("nav-item") + " focusable"}
                  href="#docs"
                  onClick={onClickNavLink}
                >
                  <span>Docs</span>
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
                <a
                  class={s("nav-item") + " focusable"}
                  href="#examples"
                  onClick={onClickNavLink}
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  class={s("nav-item") + " focusable"}
                  href="#docs"
                  onClick={onClickNavLink}
                >
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
