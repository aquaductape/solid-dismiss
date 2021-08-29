import type { Component } from "solid-js";

import "./App.scss";
import "./codeTheme.scss";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import BasicDropdown from "./components/ExamplesSection/BasicDropdown";
import NestedDropdown from "./components/ExamplesSection/NestedDropdown";
import IOSDebugger from "./components/iOSDebugger";
import DropdownWithCloseButtons from "./components/ExamplesSection/DropdownWithCloseButtons";
import Select from "./components/ExamplesSection/Select";

const App: Component = () => {
  return (
    <>
      <Navbar></Navbar>
      <main class="main">
        <Hero />
        <BasicDropdown></BasicDropdown>
        <NestedDropdown></NestedDropdown>
        <Select></Select>
        <NestedDropdown focusOnLeave={true}></NestedDropdown>
        <DropdownWithCloseButtons></DropdownWithCloseButtons>
        {/* <NestedDropdown></NestedDropdown>
        <DropdownWidget></DropdownWidget> */}
      </main>
      {/* <IOSDebugger /> */}

      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="solid-dismiss-svg-a" clipPathUnits="objectBoundingBox">
            <rect
              x="0"
              y="0"
              width="200"
              height="57"
              ry="8"
              fill="#fff"
              stroke-linecap="round"
              stroke-width="2.854"
            />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default App;
