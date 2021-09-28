import type { Component } from "solid-js";

import "./App.scss";
import "./codeTheme.scss";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import BasicDropdown from "./components/ExamplesSection/BasicDropdown";
import IOSDebugger from "./components/iOSDebugger";
import Modal from "./components/ExamplesSection/Modal";
import IFrame from "./components/Examples/IFrame";
import Docs from "./components/Docs/Docs";
import Popup from "./components/ExamplesSection/Popup";
import DropdownMounted from "./components/ExamplesSection/DropdownMounted";
import DropdownOverlay from "./components/ExamplesSection/DropdownOverlay";
import Nested from "./components/ExamplesSection/Nested";
import Animation from "./components/ExamplesSection/Animations";

const App: Component = () => {
  return (
    <>
      <Navbar></Navbar>
      <main class="main">
        <Hero />
        <section>
          <h2>Examples</h2>
          <Popup></Popup>
          <BasicDropdown></BasicDropdown>
          <DropdownMounted></DropdownMounted>
          <DropdownOverlay></DropdownOverlay>
          <Modal></Modal>
          <Animation></Animation>
          <Nested></Nested>
        </section>
        <section>
          <h2>Docs</h2>
          <Docs></Docs>
        </section>
      </main>
      {/* <IOSDebugger /> */}
    </>
  );
};

export default App;
