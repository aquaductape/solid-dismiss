import c from "./Navbar.module.scss";
import { scopeModuleClasses } from "../../utils/scopeModuleClasses";

const s = scopeModuleClasses(c);
import { Icon } from "@amoutonbrady/solid-heroicons";
import { sun, moon } from "@amoutonbrady/solid-heroicons/solid";
import { IconGithub, IconLogo } from "../icons";
import {
  createSignal,
  Show,
  onMount,
  createEffect,
  on,
  Component,
} from "solid-js";
import { changeTheme, getCurrentTheme } from "../../lib/theme";
import context from "../../global/global";
import smoothScrollTo from "../../lib/smoothScrollTo";
import Dismiss from "solid-dismiss";

const NavItems: Component<{ onClickNavLink: (e: Event) => void }> = ({
  onClickNavLink,
}) => {
  return (
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
  );
};

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
    window.history.replaceState(
      null,
      "",
      `${location.origin}${location.pathname}`
    );

    smoothScrollTo({ destination: 0, duration: 500 });
  };

  const onClickNavLink = (e: Event) => {
    const target = e.currentTarget as HTMLAnchorElement;
    e.preventDefault();

    const hrefAttrValue = target.getAttribute("href")!.slice(1);
    const el = document.getElementById(hrefAttrValue)!;
    const url = `${location.origin}${location.pathname}#${hrefAttrValue}`;

    window.history.replaceState(null, "", url);
    setOpen(false);

    smoothScrollTo({
      destination: el,
      padding: -60,
      duration: 500,
      onEnd: () => {
        el.focus();
      },
    });
  };

  return (
    <header class={s("navbar")}>
      <div id="navbar-content" class={s("content-container")}>
        <div
          class={s("shadow")}
          classList={{ [s("active")]: context.nav.logoActive || open() }}
        ></div>
        <div class={s("content")}>
          <a
            href="/"
            aria-label="Logo"
            onClick={onClickHome}
            class={s("logo") + " focusable"}
            classList={{ [s("active")]: context.nav.logoActive }}
            tabindex={context.nav.logoActive ? "0" : "-1"}
            aria-hidden={context.nav.logoActive ? "false" : "true"}
          >
            <IconLogo></IconLogo>
          </a>

          <nav class={s("nav")}>
            <NavItems onClickNavLink={onClickNavLink} />
          </nav>
          <div class={s("utils")}>
            <button
              class={s("dark-toggle")}
              aria-label="Toggle between dark and light mode"
              onClick={onClickTheme}
            >
              <Icon path={theme() === "light" ? moon : sun} />
            </button>
            <a
              class={s("github") + " focusable"}
              href="https://github.com/aquaductape/solid-dismiss"
              aria-label="Github"
              target="_blank"
              rel="noopener"
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
            aria-label="Navigation bar toggle"
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
              if ("animate" in el) {
                const elHeight = el.clientHeight;
                const a = el.animate(
                  [{ height: "0px" }, { height: `${elHeight}px` }],
                  { duration: 100 }
                );

                a.onfinish = () => done();
                return;
              }
              done();
            },
            onExit: (el, done) => {
              if ("animate" in el) {
                const elHeight = el.clientHeight;
                const a = el.animate(
                  [{ height: `${elHeight}px` }, { height: "0px" }],
                  { duration: 100 }
                );

                a.onfinish = () => done();
                return;
              }

              done();
            },
            appendToElement: `.${s("nav-mobile")}`,
          }}
        >
          <nav class={s("nav-mobile")}>
            <NavItems onClickNavLink={onClickNavLink} />
          </nav>
        </Dismiss>
      </div>
    </header>
  );
};

export default Navbar;
