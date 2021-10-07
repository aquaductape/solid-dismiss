import { createEffect, createSignal, on, Show } from "solid-js";
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
        <p style=" font-size: 14px; ">
          Note: Dismiss animation props are reactive, but "enable animation"
          checkbox refreshes page to update components for testing purpose
        </p>
        <Show when={render()}>
          <Basic></Basic>
          <PopupNoFocusableItems></PopupNoFocusableItems>
          <NestedPopupMounted></NestedPopupMounted>
          <NestedPopup></NestedPopup>
          <NestedOverlay></NestedOverlay>
          <Programmatic></Programmatic>
          <Scrolling></Scrolling>
          <IFramesWithBodyClickListener></IFramesWithBodyClickListener>
          <IFrames></IFrames>
          <FocusElementOnClose></FocusElementOnClose>
          <Mixed></Mixed>
        </Show>
      </main>
    </>
  );
};

export default App;
