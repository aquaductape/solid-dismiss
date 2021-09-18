import { createSignal, onMount } from "solid-js";
import Dismiss from "../../../../package/index";
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
        <Popup />
        <Popup />
      </div>
    </section>
  );
};

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div style="display: inline-block; position: relative;">
      <Button open={open()} ref={btnEl} />
      <Dismiss menuButton={btnEl} open={open} setOpen={setOpen}>
        <ul class="dropdown">
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
      </Dismiss>
    </div>
  );
};

export default Basic;
