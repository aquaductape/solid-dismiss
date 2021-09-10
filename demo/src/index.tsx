import { render } from "solid-js/web";

import "simplebar";
import "simplebar/dist/simplebar.css";
import "focus-visible";
import "./index.css";
import App from "./App";

render(() => <App />, document.getElementById("root")!);
