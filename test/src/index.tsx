import { render } from "solid-js/web";

//@ts-ignore
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

import "./index.css";
import App from "./App";

render(() => <App />, document.getElementById("root")!);
