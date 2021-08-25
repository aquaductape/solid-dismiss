import { Transition } from "solid-transition-group";
import { createSignal, Show, onMount, createEffect, on } from "solid-js";
import HeroDropdown from "../Examples/HeroDropdown";
import { IconLogo } from "../icons";
import { Icon } from "@amoutonbrady/solid-heroicons";
import {
  clipboardCopy,
  clipboardCheck,
} from "@amoutonbrady/solid-heroicons/outline";
import { copyTextToClipboard } from "../../utils/clipboard";

const Hero = () => {
  const [clipboardClicked, setClipboardClicked] = createSignal(false);
  const packageText = "npm i solid-dismiss";
  let timeoutId: number | null = null;

  const onClickClipboard = async () => {
    const result = await copyTextToClipboard(packageText);
    if (!result) {
      return;
    }
    if (clipboardClicked()) return;
    setClipboardClicked(true);

    window.clearTimeout(timeoutId!);
    timeoutId = window.setTimeout(() => {
      setClipboardClicked(false);
    }, 3500);
  };

  return (
    <div class="hero">
      <div class="title">
        <h1>
          Solid <span style="display: block">Dismiss</span>
        </h1>{" "}
        <div class="logo">
          <IconLogo />{" "}
        </div>
      </div>
      <p class="content">
        Handle <strong>"click outside"</strong> behavior to close
        dropdowns/popups for <br />
        <a class="link" href="https://www.solidjs.com/" target="_blank">
          Solid Framework
        </a>
      </p>
      <div class="demo">
        <HeroDropdown></HeroDropdown>
      </div>
      <div class="package">
        <span class="btn-fusion">
          <button
            class="btn-secondary"
            aria-label={`copy text to clipboard: ${packageText}`}
            onClick={onClickClipboard}
          >
            <span class="btn-fusion-icon">
              <Transition
                onEnter={(el, done) => {
                  const a = el.animate(
                    [
                      { transform: "scale(0)", opacity: 0 },
                      { transform: "scale(1)", opacity: 1 },
                    ],
                    {
                      duration: 300,
                    }
                  );
                  a.finished.then(done);
                }}
                onExit={(el, done) => {
                  const a = el.animate(
                    [
                      { transform: "scale(1)", opacity: 1 },
                      { transform: "scale(0)", opacity: 0 },
                    ],
                    {
                      duration: 300,
                    }
                  );
                  a.finished.then(done);
                }}
              >
                {clipboardClicked() ? (
                  <span>
                    <Icon path={clipboardCheck}></Icon>
                  </span>
                ) : (
                  <span>
                    <Icon path={clipboardCopy}></Icon>
                  </span>
                )}
              </Transition>
            </span>
          </button>
          <span class="text-wrapper">
            <code class="contentt">{packageText}</code>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Hero;
