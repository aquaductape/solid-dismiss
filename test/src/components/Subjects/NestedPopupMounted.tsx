import {
  untrack,
  batch,
  Accessor,
  onMount,
  createEffect,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
  Show,
  createComputed,
  createSignal,
  children,
  mergeProps,
  createMemo,
  createRenderEffect,
} from "solid-js";
import { Transition } from "solid-transition-group";
import Dismiss from "../../../../package/index";
import Button from "../Button/Button";

const NestedPopupMounted = () => {
  return (
    <section class="nested">
      <h2>Nested mounted body menuPopup</h2>
      <p>No overlay, page is interactable</p>
      <p>menuPopups are mounted to the body of the document</p>
      <p>
        Since there is no overlay, and there's a stack of menuPops opened,
        wherever the click/focus target is, it checks through the
        stack(iterating backwards). If the target is contained withined
        menuPopup item, then any stack "above" it that did not contain it, will
        be dismissed.
      </p>

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
  let containerEl!: HTMLElement;
  let dropdownEl!: HTMLDivElement;

  createEffect(() => {
    if (!open()) return;

    const btnBCR = btnEl.getBoundingClientRect();
    containerEl.style.position = "absolute";
    // containerEl.style.width = btnBCR.width + "px";
    containerEl.style.top = btnBCR.bottom + window.scrollY + "px";
    containerEl.style.left = btnBCR.left + window.scrollX + "px";
  });

  return (
    <div
      style="display: inline-block; position: relative;"
      onClick={() => console.log("click container")}
    >
      <Button open={open()} ref={btnEl} />
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        mount={"body"}
        closeWhenMenuButtonIsTabbed
        // stopComponentEventPropagation
        animation={{
          name: "popup",
          appear: true,
        }}
        ref={containerEl}
      >
        <div class="dropdown" ref={dropdownEl}>
          <Popup></Popup>
          <br />
          <Popup></Popup>
          <br />
          <Popup></Popup>
        </div>
      </Dismiss>
    </div>
  );
};

export default NestedPopupMounted;
