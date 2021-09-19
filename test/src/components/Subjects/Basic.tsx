import {
  Component,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { Portal } from "solid-js/web";
import Dismiss from "../../../../package/index";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";

const Basic = () => {
  return (
    <section class="basic">
      <h2>Basic Popup</h2>
      <p>No overlay, page is interactable</p>
      <p>Open menuPopup, then close it by:</p>
      <ul>
        <li>clicking menuButton</li>
        <li>
          pressing <code>Escape</code> key
        </li>
        <li>Tabbing outside menuPop via Forwards or Backwards</li>
        <li>clicking outside of menuPopup</li>
      </ul>
      <div class="grid">
        <Popup />
        {/* <Popup />
        <Popup /> */}
      </div>
    </section>
  );
};

const Content: Component = (props) => {
  onMount(() => {
    console.log("mount!!");
  });
  return (
    <ul
      class="dropdown"
      onClick={(e) => {
        console.log(e.target.tagName);
      }}
    >
      <li>
        <a class="item" href="javascript:void(0)">
          cat
        </a>
      </li>
      <li>
        <a class="item" href="javascript:void(0)">
          dog
        </a>
      </li>
      <li>
        <a class="item" href="javascript:void(0)">
          fish
        </a>
      </li>
    </ul>
  );
};

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  const [className, setClassName] = createSignal("popup");

  setTimeout(() => {
    setClassName("foo");
  }, 5000);

  return (
    <div
      style="display: inline-block; position: relative;"
      onClick={() => {
        console.log("container clicked!");
      }}
    >
      <Button
        open={open()}
        // onClick={() => setOpen((prev) => !prev)}
        ref={btnEl}
      />
      <p>{className()}</p>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount="body"
        animation={{ name: className() }}
      >
        <Content></Content>
      </Dismiss>
    </div>
  );
};

export default Basic;
