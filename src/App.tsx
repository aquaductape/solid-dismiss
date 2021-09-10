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
import Mixed from "./components/Examples/Mixed";

const App: Component = () => {
  return (
    <>
      <Navbar></Navbar>
      <main class="main">
        <Hero />
        <BasicDropdown></BasicDropdown>
        {/* <NestedDropdown></NestedDropdown> */}
        <Select></Select>
        <NestedDropdown focusOnLeave={true} overlay="block"></NestedDropdown>
        <NestedDropdown focusOnLeave={true} overlay="clipped"></NestedDropdown>
        <NestedDropdown focusOnLeave={true}></NestedDropdown>
        <DropdownWithCloseButtons></DropdownWithCloseButtons>
        <Mixed />
      </main>
      {/* <IOSDebugger /> */}
    </>
  );
};

export default App;
