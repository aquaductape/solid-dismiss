import { Transition } from "solid-transition-group";
import { createSignal, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { IconArrow, IconNPM, IconPNPM, IconYarn } from "../icons";
import { Icon } from "@amoutonbrady/solid-heroicons";
import {
  clipboardCopy,
  clipboardCheck,
} from "@amoutonbrady/solid-heroicons/outline";
import { copyTextToClipboard } from "../../utils/clipboard";
import Select from "../Select/Select";

const options: { [key: string]: () => JSX.Element } = {
  npm: IconNPM,
  yarn: IconYarn,
  pnpm: IconPNPM,
};
const PackageBtn = () => {
  const [clipboardClicked, setClipboardClicked] = createSignal(false);
  const libText = "solid-dismiss";
  const [packageText, setPackageText] = createSignal(`npm i ${libText}`);
  let timeoutId: number | null = null;

  const onClickClipboard = async () => {
    const result = await copyTextToClipboard(packageText());
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

  const onSelectInput = (value: string) => {
    switch (value) {
      case "npm":
        setPackageText(`npm i ${libText}`);
        return;
      case "yarn":
        setPackageText(`yarn add ${libText}`);
        return;
      case "pnpm":
        setPackageText(`pnpm add ${libText}`);
        return;
    }
  };

  return (
    <div class="package">
      <span class="btn-fusion">
        <div className="select">
          <Select
            selectedTemplate={({ content }) => (
              <div class="btn-inner">
                <div class="selected-icon">
                  <Dynamic component={options[content]} />
                </div>
                <div class="arrow-container">
                  <IconArrow />
                </div>
              </div>
            )}
            list={[
              { content: "npm" },
              { content: "yarn" },
              { content: "pnpm" },
            ]}
            onInput={onSelectInput}
          ></Select>
        </div>
        <button
          class="btn-secondary"
          aria-label={`copy text to clipboard: ${packageText()}`}
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
          {/* <div className="fake-el-start"></div> */}
          <div className="text-scroll-container">
            <code class="text-content">{packageText()}</code>
          </div>
          {/* <div className="fake-el-end"></div> */}
        </span>
      </span>
    </div>
  );
};

export default PackageBtn;
