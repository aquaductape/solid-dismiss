import { Component, lazy, onMount } from "solid-js";

import "./App.scss";
import "./codeTheme.scss";
import "./bootstrap.scss";
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
import MultipleButtons from "./components/ExamplesSection/MultipleButtons";
import Caveat from "./components/Docs/Caveat";
import Popper from "./components/ExamplesSection/Popper";
import { H2Anchor, H3Anchor } from "./components/HeaderAnchor/HeaderAnchor";

const App: Component = () => {
  onMount(() => {
    if (location.href) {
      setTimeout(() => {
        window.scrollBy(0, -80);
      });
    }
  });
  return (
    <>
      <Navbar></Navbar>
      <main class="main">
        <Hero />
        <section>
          <H2Anchor>Examples</H2Anchor>
          <Popup></Popup>
          <BasicDropdown></BasicDropdown>
          <DropdownMounted></DropdownMounted>
          <DropdownOverlay></DropdownOverlay>
          <Modal></Modal>
          <Animation></Animation>
          <NavbarEx></NavbarEx>
          <Popper></Popper>
          <MultipleButtons></MultipleButtons>
          <Nested></Nested>
        </section>
        <section>
          <H2Anchor>Docs</H2Anchor>
          <Caveat></Caveat>
          <H3Anchor>Types</H3Anchor>
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
