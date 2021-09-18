import type { Component } from "solid-js";

import "./App.scss";
import Basic from "./components/Subjects/Basic";
import IFramesWithBodyClickListener from "./components/Subjects/IFramesWithBodyClickListener";
import NestedPopup from "./components/Subjects/NestedPopup";
import NestedPopupMounted from "./components/Subjects/NestedPopupMounted";
import Scrolling from "./components/Subjects/Scrolling";

const App: Component = () => {
  return (
    <>
      <main class="main">
        {/* <Basic></Basic>
        <Scrolling></Scrolling> */}
        <NestedPopupMounted></NestedPopupMounted>
        {/* <NestedPopup></NestedPopup> */}
        {/* <IFramesWithBodyClickListener></IFramesWithBodyClickListener> */}
      </main>
    </>
  );
};

export default App;
