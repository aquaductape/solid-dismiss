import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
  Show,
  untrack,
} from "solid-js";
import { Component, Match, Switch } from "solid-js";
import "./App.scss";
import Header from "./components/Header/Header";
import Basic from "./components/Subjects/Basic";
import FocusElementOnClose from "./components/Subjects/FocusElementOnClose";
import IFrames from "./components/Subjects/IFrames";
import IFramesWithBodyClickListener from "./components/Subjects/IFramesWithBodyClickListener";
import Mixed from "./components/Subjects/Mixed";
import Programmatic from "./components/Subjects/Programmatic";
import NestedOverlay from "./components/Subjects/NestedOverlay";
import NestedPopup from "./components/Subjects/NestedPopup";
import NestedPopupMounted from "./components/Subjects/NestedPopupMounted";
import Scrolling from "./components/Subjects/Scrolling";
import settings from "./utils/globalSettings";
import PopupNoFocusableItems from "./components/Subjects/PopupNoFocusableItems";
import MultipleMenuButtons from "./components/Subjects/MultipleMenuButtons";
import MultipleMenuButtonsCSS from "./components/Subjects/MultipleMenuButtonsCSS";
import Modal from "./components/Subjects/Modal";
import Tabbing from "./components/Subjects/Tabbing";
import "./web-components/Button";
import "./web-components/Nested";
import Modal2 from "./components/Subjects/Modal2";
import { isSafari } from "@solid-primitives/platform";
import { Portal } from "solid-js/web";
import CustomStuff from "./components/CustomStuff/CustomStuff";
import MultipleMenuButtonsCSSSignal from "./components/Subjects/MultipleMenuButtonsCSSSignal";
import ThirdpartyPopupsOnBody from "./components/Subjects/ThirdpartyPopupsOnBody";
import ModalOverflowOnBody from "./components/Subjects/ModalOverflowOnBody";
import Combobox from "./components/Subjects/Combobox";
import SafariBlur from "./components/SafariBlur";

const FireFocusOrder = () => {
  let tabbableContainer1!: HTMLDivElement;
  let tabbableContainer2!: HTMLDivElement;
  let containerEl3!: HTMLDivElement;
  let containerEl4!: HTMLDivElement;
  let button0!: HTMLButtonElement;
  let button1!: HTMLButtonElement;
  let button2!: HTMLButtonElement;
  let button3!: HTMLButtonElement;
  let innerButton1!: HTMLButtonElement;
  let innerButton2!: HTMLButtonElement;
  let buttonEl3!: HTMLButtonElement;
  let buttonEl4!: HTMLButtonElement;

  onMount(() => {
    addEvents(tabbableContainer1, "tabbable-container-1");
    addEvents(tabbableContainer2, "tabbable-container-2");
    addEvents(button0, "button-0");
    addEvents(button1, "button-1");
    addEvents(button2, "button-2");
    addEvents(button3, "button-3");
    addEvents(innerButton1, "inner-button-1");
    addEvents(innerButton2, "inner-button-2");
    document.addEventListener("click", (e) => {
      console.log("document click", {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
  });

  const getDataNameFromElement = (_el: any) => {
    const el = _el as HTMLElement;
    if (!el) return el;
    const name = el.dataset.name;
    if (name) return name;
    return el;
  };

  const addEvents = (el: HTMLElement, name: string) => {
    el.addEventListener("mousedown", (e) => {
      if (el.tagName.toLowerCase() === "button") {
        requestAnimationFrame(() => {
          el.focus();
        });
      }
      console.log(`mousedown: ${name}`, {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
    // el.addEventListener("pointerdown", (e) => {
    //   if (el.tagName.toLowerCase() === "button") {
    //     requestAnimationFrame(() => {
    //       el.focus();
    //     });
    //   }
    // });

    // on Safari, since button can't receive focus, even "forced" focused button when reclicked the button will blur. Even on  "reclick", where pointerdown/mousedown/click forces focus, blur will still fire
    el.addEventListener("click", (e) => {
      console.log(`click: ${name}`, {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
    el.addEventListener("focus", (e) => {
      console.log(`focus: ${name}`, {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
    el.addEventListener("blur", (e) => {
      console.log(`blur: ${name}`, {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
    el.addEventListener("focusin", (e) => {
      console.log(`focusin: ${name}`, {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
    el.addEventListener("focusout", (e) => {
      console.log(`focusout: ${name}`, {
        relatedTarget: getDataNameFromElement(e.relatedTarget),
        activeElement: getDataNameFromElement(document.activeElement),
      });
    });
  };

  return (
    <div style="padding: 12px;">
      <div style="margin: 12px 0;">
        <button data-name={"button-0"} ref={button0}>
          button-0
        </button>
      </div>

      <button data-name={"button-1"} ref={button1}>
        button-1
      </button>
      <div
        data-name={"tabbable-container-1"}
        style="padding: 15px; background: #eee; margin: 12px 0;"
        tabindex="0"
        ref={tabbableContainer1}
      >
        <p style="font-size: 14px;">tabbable-container-1</p>
      </div>
      <div style="height: 20px;" />
      <button data-name={"button-2"} ref={button2}>
        button-2
      </button>
      <div
        data-name={"tabbable-container-2"}
        style="padding: 15px; background: #eee; margin: 12px 0;"
        tabindex="0"
        ref={tabbableContainer2}
      >
        <p style="font-size: 14px;">tabbable-container-2</p>

        <div style="display: grid; gap: 12px; width: fit-content;">
          <button data-name={"inner-button-1"} ref={innerButton1}>
            inner-button-1
          </button>

          <button data-name={"inner-button-2"} ref={innerButton2}>
            inner-button-2
          </button>
        </div>
      </div>
      <div style="margin: 12px 0;">
        <button data-name={"button-3"} ref={button3}>
          button-3
        </button>
      </div>
    </div>
  );
};

const App: Component = () => {
  const [render, setRender] = createSignal(true);

  createEffect(
    on(
      [() => settings.animation.enable, () => settings.closeMenuBtnReclick],
      () => {
        setRender(false);
        setTimeout(() => {
          setRender(true);
        });
      },
      { defer: true }
    )
  );

  return (
    <>
      <Header></Header>
      <main class="main">
        {/* <FireFocusOrder /> */}
        <p style=" font-size: 14px; ">
          Note: Dismiss animation props are reactive, but "enable animation"
          checkbox refreshes page to update components for testing purpose
        </p>
        <SafariBlur />
        <CustomStuff />
        <Show when={render()}>
          <Basic />
          <PopupNoFocusableItems />
          <NestedPopupMounted />
          <NestedPopup />
          <NestedOverlay />
          <Programmatic />
          <MultipleMenuButtons />
          <MultipleMenuButtonsCSS />
          <MultipleMenuButtonsCSSSignal />
          <Scrolling />
          <Modal />
          <Modal2 />
          <ModalOverflowOnBody />
          <Tabbing />
          <Combobox />
          <IFramesWithBodyClickListener />
          <IFrames />
          <FocusElementOnClose />
          <Mixed />
          <ThirdpartyPopupsOnBody />
        </Show>
      </main>
    </>
  );
};

export default App;
