import type { Component } from "solid-js";

import "./App.scss";
import "./codeTheme.scss";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import BasicDropdown from "./components/ExamplesSection/BasicDropdown";
import NestedDropdown from "./components/ExamplesSection/NestedDropdown";
import IOSDebugger from "./components/iOSDebugger";
import Modal from "./components/ExamplesSection/Modal";
import Mixed from "./components/Examples/Mixed";
import IFrames from "./components/Examples/IFrames";

const App: Component = () => {
  return (
    <>
      <Navbar></Navbar>
      <main class="main">
        <Hero />
        <BasicDropdown></BasicDropdown>
        {/* <NestedDropdown></NestedDropdown> */}
        {/* <NestedDropdown focusOnLeave={true} overlay></NestedDropdown> */}
        {/* <NestedDropdown focusOnLeave={true} overlay="clip"></NestedDropdown> */}
        {/* <NestedDropdown focusOnLeave={true}></NestedDropdown> */}
        <Modal></Modal>
        {/* <Mixed /> */}
      </main>
      {/* <IOSDebugger /> */}
    </>
  );
};

export default App;
