import { Component, createEffect, createSignal } from "solid-js";
import Dismiss from "../../../../package/index";
import { getLeft, toggleAnimation } from "../../utils";
import settings from "../../utils/globalSettings";
import Button from "../Button/Button";
import HiddenTabbableItems from "../HiddenTabbableItems";

const id = "combobox";
const basicPopupId = "basic-popup";
const Combobox = () => {
  return (
    <section id={id}>
      <h2 tabindex="0">Combobox</h2>
      <p>
        Select item by using Tab, then press Enter to update input value based
        on selected item and closes dropdown box.
      </p>
      <p>
        Most events, users would have to implement to create combox behavior,
        {/* otherwise this library get's bloated */}
        such as onClick to items to update input value and close dropdownbox,
        and onKeyDown on input triggers dropdown to open
      </p>
      <div class="grid">
        <Popup id={basicPopupId + "-1"} />
        <HiddenTabbableItems />
        <ComboboxPopup id={id} />
        <HiddenTabbableItems type="emptyNested" />
        <Popup id={basicPopupId + "-2"} />
      </div>
      <p>ignoreMenuPopupWhenTabbing=true</p>
      <p>useDismissCursorKeys=true</p>
      <p>
        Select item by using arrow keys, then press Enter to update input value
        based on selected item and closes dropdown box.
      </p>
      <div class="grid">
        <Popup id={basicPopupId + "-1"} />
        <HiddenTabbableItems />
        <ComboboxPopup
          id={id}
          ignoreMenuPopupWhenTabbing
          useDismissCursorKeys
        />
        <HiddenTabbableItems type="emptyNested" />
        <Popup id={basicPopupId + "-2"} />
      </div>

      <p>
        Select item by using Tab, then press Enter to update input value based
        on selected item and closes dropdown box.
      </p>
      <p>Is mounted</p>
      <div class="grid">
        <Popup id={basicPopupId + "-1"} />
        <HiddenTabbableItems />
        <ComboboxPopup id={id} mounted />
        <HiddenTabbableItems type="emptyNested" />
        <Popup id={basicPopupId + "-2"} />
      </div>
      <p>ignoreMenuPopupWhenTabbing=true</p>
      <p>useDismissCursorKeys=true</p>
      <p>Is mounted</p>
      <p>
        Select item by using arrow keys, then press Enter to update input value
        based on selected item and closes dropdown box.
      </p>
      <div class="grid">
        <Popup id={basicPopupId + "-1"} />
        <HiddenTabbableItems />
        <ComboboxPopup
          id={id}
          mounted
          ignoreMenuPopupWhenTabbing
          useDismissCursorKeys
        />
        <HiddenTabbableItems type="emptyNested" />
        <Popup id={basicPopupId + "-2"} />
      </div>
    </section>
  );
};

const ComboboxPopup: Component<{
  ignoreMenuPopupWhenTabbing?: boolean;
  useDismissCursorKeys?: boolean;
  mounted?: boolean;
  id: string;
  idx?: number;
}> = (props) => {
  const {
    ignoreMenuPopupWhenTabbing = false,
    useDismissCursorKeys,
    mounted,
  } = props;
  const [toggle, setToggle] = createSignal(false);
  const [inputValue, setInputValue] = createSignal("");
  const idx = props.idx || 1;
  const id = `${props.id}-level-${idx}`;
  let inputEl!: HTMLInputElement;
  let dropdownEl!: HTMLDivElement;
  let currentSelectedText = "";

  createEffect(() => {
    if (!mounted || !toggle()) return;
    const inputBCR = inputEl.getBoundingClientRect();

    dropdownEl.style.position = "absolute";

    dropdownEl.style.top = inputBCR.bottom + window.scrollY + "px";
    dropdownEl.style.left = inputBCR.left + "px";
    dropdownEl.style.width = inputBCR.width + "px";
  });

  return (
    <div
      class={`${id + "-container"}`}
      style="position: relative; display: inline-block; padding-right: 16px; padding-left: 8px;"
    >
      <input
        type="text"
        role="combobox"
        aria-haspopup="true"
        aria-autocomplete="list"
        placeholder="Combobox Search ...."
        value={inputValue()}
        ref={inputEl}
        onInput={(e) => {
          const value = e.currentTarget.value;
          setInputValue(value);
          setToggle(!!value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setInputValue(currentSelectedText);
            setToggle(false);
          }
          // if (!(e.key === "ArrowDown" || e.key === "ArrowUp")) return;
          // e.preventDefault();
          // console.log(e.key);
          //           // Rowving algorithm start
          //           const el = getNextTabbableElement({
          //             from: prevActiveItem,
          //             direction: "forwards",
          //             stopAtRootElement: ".hero-dropdown-content",
          //             wrap: true,
          //           });
          //
          //           prevActiveItem?.style.background = "none";
          //           el?.style.background = "red";
          //           // prevActiveItem?.setAttribute('tabindex', '-1')
          //           // el?.setAttribute('tabindex', '0')
          //
          //           // el?.focus();
          //           // Rowving algorithm end
        }}
      />

      <Dismiss
        class="list-box-container"
        menuButton={inputEl}
        open={toggle}
        setOpen={setToggle}
        closeWhenMenuButtonIsClicked={false}
        deadMenuButton
        cursorKeys={
          useDismissCursorKeys
            ? {
                wrap: true,
                onKeyDown: ({ currentEl, prevEl }) => {
                  currentEl!.style.background = "red";
                  if (prevEl) {
                    prevEl.style.background = "none";
                  }
                  currentSelectedText = currentEl!.textContent || "";
                },
              }
            : undefined
        }
        ignoreMenuPopupWhenTabbing={ignoreMenuPopupWhenTabbing}
        mount={mounted ? "body" : undefined}
        ref={dropdownEl}
      >
        <ul
          id={id + "-popup"}
          class="list-box"
          role="listbox"
          onKeyDown={(e) => {
            console.log(e.key);
            if (ignoreMenuPopupWhenTabbing) {
              return;
            }

            if (e.key === "Enter") {
              setInputValue(document.activeElement!.textContent!);
              inputEl.focus();
            }
          }}
          onClick={(e) => {
            const li = e.target.closest('li[tabindex="0"]');
            if (!li) return;
            setInputValue(li.textContent || "");
            setToggle(false);
          }}
        >
          <li tabindex="0">Hi world</li>
          <li tabindex="0">Smaug</li>
          <li tabindex="0">storybook</li>
          <li tabindex="0">catfish</li>
        </ul>
      </Dismiss>
    </div>
  );
};

const Popup: Component<{ id: string }> = ({ id }) => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;

  return (
    <div
      class={`${id + "-container"}`}
      style="display: inline-block; position: relative;"
    >
      <Button open={open()} ref={btnEl}>
        mBtn
      </Button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        closeWhenMenuButtonIsClicked={settings.closeMenuBtnReclick}
        {...toggleAnimation()}
      >
        <ul
          id={id + "-popup"}
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
          <input type="text" placeholder="text input..." class="input-test" />
        </ul>
      </Dismiss>
    </div>
  );
};

export default Combobox;
