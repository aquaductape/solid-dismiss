import { Component, lazy } from "solid-js";

import "./App.scss";
import "./codeTheme.scss";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import BasicDropdown from "./components/ExamplesSection/BasicDropdown";
import IOSDebugger from "./components/iOSDebugger";
import Modal from "./components/ExamplesSection/Modal";
import IFrame from "./components/Examples/IFrame";
const Docs = lazy(() => import("./components/Docs/Docs"));
import Popup from "./components/ExamplesSection/Popup";
import DropdownMounted from "./components/ExamplesSection/DropdownMounted";
import DropdownOverlay from "./components/ExamplesSection/DropdownOverlay";
import Nested from "./components/ExamplesSection/Nested";
import Animation from "./components/ExamplesSection/Animations";
import NavbarEx from "./components/ExamplesSection/Navbar";
import Caveat from "./components/Docs/Caveat";

const App: Component = () => {
  return (
    <>
      <Navbar></Navbar>
      <main class="main">
        <Hero />
        <section>
          <h2 id="examples" tabindex="-1">
            Examples
          </h2>
          <Popup></Popup>
          <BasicDropdown></BasicDropdown>
          <DropdownMounted></DropdownMounted>
          <DropdownOverlay></DropdownOverlay>
          <Modal></Modal>
          <Animation></Animation>
          <NavbarEx></NavbarEx>
          <Nested></Nested>
        </section>
        <section>
          <h2 id="docs" tabindex="-1">
            Docs
          </h2>
          <Caveat></Caveat>
          <h3>Types</h3>
          <Docs></Docs>
        </section>
      </main>
      <svg>
        <defs>
          <linearGradient
            id="dismiss-logo-a"
            x1="104.71"
            x2="94.151"
            y1="59.781"
            y2="77.909"
            gradientTransform="translate(-78.46 -53.379)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#142cb0" offset="0" />
            <stop stop-color="#00bcd4" offset="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* <IOSDebugger /> */}
    </>
  );
};

export default App;
