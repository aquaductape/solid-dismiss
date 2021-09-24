import { Component, Match, Switch } from "solid-js";

import "./App.scss";
import Header from "./components/Header/Header";
import Basic from "./components/Subjects/Basic";
import FocusElementOnClose from "./components/Subjects/FocusElementOnClose";
import IFrames from "./components/Subjects/IFrames";
import IFramesWithBodyClickListener from "./components/Subjects/IFramesWithBodyClickListener";
import Mixed from "./components/Subjects/Mixed";
import NestedOverlay from "./components/Subjects/NestedOverlay";
import NestedPopup from "./components/Subjects/NestedPopup";
import NestedPopupMounted from "./components/Subjects/NestedPopupMounted";
import Scrolling from "./components/Subjects/Scrolling";
import settings from "./utils/globalSettings";

const Content = () => {
  return (
    <>
      <Basic></Basic>
      <NestedPopupMounted></NestedPopupMounted>
      <NestedPopup></NestedPopup>
      <NestedOverlay></NestedOverlay>
      <Scrolling></Scrolling>
      <IFramesWithBodyClickListener></IFramesWithBodyClickListener>
      <IFrames></IFrames>
      <FocusElementOnClose></FocusElementOnClose>
      <Mixed></Mixed>
    </>
  );
};
const App: Component = () => {
  // document.documentElement.setAttribute("iframe-src", "true");
  return (
    <>
      <Header></Header>
      <main class="main">
        <p style=" font-size: 14px; margin-bottom: -15vh;">
          Note: Dismiss animation props are reactive, but "enable animation"
          checkbox refreshes page to update components for testing purpose
        </p>
        <Switch>
          <Match when={settings.animation.enable}>
            <Content></Content>
          </Match>
          <Match when={!settings.animation.enable}>
            <Content></Content>
          </Match>
        </Switch>
      </main>
    </>
  );
};

export default App;
