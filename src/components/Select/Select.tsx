import Dismiss from "../../../package/index";
import {
  For,
  Component,
  createEffect,
  createUniqueId,
  createMemo,
  createSignal,
  JSX,
  Accessor,
} from "solid-js";
import { createStore } from "solid-js/store";
import c from "./Select.module.scss";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";

const classM = scopeModuleClasses(c);
// https://codepen.io/chriscoyier/pen/zYYZaGP

// data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E

type TList = {
  id?: string;
  content: string;
  /**
   * if omitted value will be same as content
   */
  value?: string;
  disabled?: boolean;
  selected?: boolean;
};

const Select: Component<{
  selectedTemplate?: (props: Omit<TList, "id">) => JSX.Element;
  itemTemplate?: (
    props: Omit<TList, "id">,
    idx: Accessor<number>
  ) => JSX.Element;
  list: TList[];
  /**
   * Default: `false`
   * creates hidden native html select, in order for it's attributes to be used for a form library such as Felt
   */
  offscreenNative?: boolean;
  /**
   * Default: `false`
   * uses native dropdown
   */
  native?: boolean;
  onInput?: (value: string) => void;
}> = (props) => {
  const { itemTemplate, selectedTemplate } = props;
  let btnEl!: HTMLButtonElement;
  // const [[toggle, setToggle, focus], { onFOBlur, onFOFocus, onFOClick }] =
  //   createFocusOut({
  //     btnEl: () => btnEl,
  //   });
  const [toggle, setToggle] = createSignal(false);
  const [focus, setFocus] = createSignal(false);
  const titleId = "real-" + createUniqueId();
  const btnId = "real-" + createUniqueId();
  const listId = "real-" + createUniqueId();
  let listEl!: HTMLUListElement;
  let searchWord = "";
  let debouncedSearchWordActive = false;
  let debouncedFirstCharActive = false;
  let timeoutSearchWord = () =>
    window.setTimeout(() => {
      debouncedSearchWordActive = false;
    }, 500);
  let timeoutFirstChar = () =>
    window.setTimeout(() => {
      if (debouncedFirstCharActive) return;
      searchWord = "";
    }, 500);
  let firstCharTimeoutId: number | null = null;
  let searchWordTimeoutId: number | null = null;

  const [cpList, setCpList] = createStore<TList[]>(
    props.list.map((item, idx) => ({ ...item, index: idx }))
  );

  const selected = createMemo(() => {
    let idx = cpList.findIndex((item) => item.selected);
    if (idx < 0) {
      idx = 0;
    }
    const item = cpList[idx];

    return { item, idx };
  });

  const onKeyDown = (e: KeyboardEvent) => {
    const ARROW_DOWN = "ArrowDown";
    const ARROW_UP = "ArrowUp";
    const ARROW_LEFT = "ArrowLeft";
    const ARROW_RIGHT = "ArrowRight";
    const HOME = "Home";
    const END = "End";
    const ENTER = "Enter";
    const SPACE = "";
    const ESCAPE = "Escape";

    if (e.key === ENTER) {
      if (toggle()) {
        btnEl.focus();
        setTimeout(() => setToggle(false));
      }
      return;
    }

    if (e.key.match(/\s/)) {
      if (toggle()) {
        e.preventDefault();
      } else {
        return;
      }
    }

    if (
      [ARROW_DOWN, ARROW_UP, ARROW_LEFT, ARROW_RIGHT, HOME, END].includes(e.key)
    ) {
      e.preventDefault();
    }

    const maxIndex = cpList.length - 1;
    const { idx } = selected();
    const prevIndex = idx;
    let newIndex = idx;

    const navigate = () => {
      if ([ARROW_LEFT, ARROW_RIGHT].includes(e.key) && toggle()) return;

      switch (e.key) {
        case ARROW_DOWN:
          newIndex++;
          break;
        case ARROW_UP:
          newIndex--;
          break;
        case ARROW_RIGHT:
          newIndex++;
          break;
        case ARROW_LEFT:
          newIndex--;
          break;
        case END:
          newIndex = maxIndex;
          break;
        case HOME:
          newIndex = 0;
          break;
      }
    };

    const searchByFirstChar = () => {
      const key = e.key.toLowerCase();
      const length = cpList.length;

      if (
        !debouncedSearchWordActive &&
        (!searchWord || searchWord[0] === key)
      ) {
        searchWord = "";
      } else {
        debouncedSearchWordActive = true;
        window.clearTimeout(searchWordTimeoutId!);
        searchWordTimeoutId = timeoutSearchWord();
      }

      window.clearTimeout(firstCharTimeoutId!);
      firstCharTimeoutId = timeoutFirstChar();

      searchWord += key;

      const matchWord = (content: string) => {
        content = content.toLowerCase();

        const searchWordLength = searchWord.length;
        if (searchWordLength <= 1) {
          return content[0] === key;
        }

        for (let i = 0; i < searchWordLength; i++) {
          if (content[i] !== searchWord[i].toLowerCase()) {
            return false;
          }
        }
        return true;
      };
      // start from prev
      for (let i = prevIndex + 1; i < length; i++) {
        const item = cpList[i];
        if (matchWord(item.content)) {
          newIndex = i;
          return;
        }
      }
      // wrap around, start from first then end with prev
      for (let i = 0; i < prevIndex; i++) {
        const item = cpList[i];
        if (matchWord(item.content)) {
          newIndex = i;
          return;
        }
      }
    };

    if (e.key.length === 1 || debouncedSearchWordActive) {
      searchByFirstChar();
    } else {
      navigate();
    }

    if (newIndex > maxIndex) newIndex = maxIndex;
    if (newIndex < 0) newIndex = 0;

    if (prevIndex !== newIndex) {
      setCpList(prevIndex, "selected", false);
    }
    setCpList(newIndex, "selected", true);
  };

  const onClickListItem = (e: MouseEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const dataValue = currentTarget.dataset.value;
    const newIndex = cpList.findIndex(
      (item) => dataValue === (item.value || item.content)
    );
    const { idx: prevIndex } = selected();

    if (prevIndex === newIndex) return;

    setCpList(prevIndex, "selected", false);
    setCpList(newIndex, "selected", true);
    setToggle(false);
  };

  const onInputNative = (
    e: InputEvent & {
      currentTarget: HTMLSelectElement;
      target: Element;
    }
  ) => {
    const value = e.currentTarget.value;

    const newIndex = cpList.findIndex(
      (item) => value === (item.value || item.content)
    );
    const { idx: prevIndex } = selected();

    if (prevIndex === newIndex) return;

    setCpList(prevIndex, "selected", false);
    setCpList(newIndex, "selected", true);
    setToggle(false);
  };

  const renderSelectedTemplate = () => {
    const item = selected().item;
    if (selectedTemplate) return selectedTemplate({ ...item });
    return item.content;
  };

  const renderListTemplate = (listItem: TList, idx: Accessor<number>) => {
    if (itemTemplate) return itemTemplate({ ...listItem }, idx);

    return listItem.content;
  };

  createEffect(() => {
    const { item: selectedItem } = selected();

    if (props.onInput) {
      props.onInput!(selectedItem.value || selectedItem.content);
    }

    const itemEl = listEl.querySelector(
      `[data-value="${selectedItem.value || selectedItem.content}"]`
    ) as HTMLElement;

    listEl.setAttribute("aria-activedescendant", itemEl.id);
  });

  createEffect(() => {
    if (focus()) {
      document.addEventListener("keydown", onKeyDown);
      return;
    }
    document.removeEventListener("keydown", onKeyDown);
  });

  createEffect(() => {
    if (toggle()) {
      btnEl.setAttribute("tabindex", "-1");
      listEl.focus();
      return;
    }

    btnEl.setAttribute("tabindex", "0");
  });

  return (
    <>
      <div class={c["select-btn"]}>
        <button
          id={btnId}
          class={classM("btn", toggle() && "active")}
          aria-labelledby={`${titleId} ${btnId}`}
          aria-haspopup="listbox"
          ref={btnEl}
        >
          {renderSelectedTemplate()}
        </button>
        <select class={c["native-select"]} onInput={onInputNative}>
          <For each={cpList}>
            {(item) => {
              const value = item.value || item.content;
              return (
                <option
                  value={value}
                  selected={item.content === selected().item.content}
                >
                  {item.content}
                </option>
              );
            }}
          </For>
        </select>
      </div>

      <Dismiss
        class={c["container"]}
        menuButton={btnEl}
        toggle={toggle}
        setToggle={setToggle}
        setFocus={setFocus}
        overlay={"shallow"}
        focusOnLeave={btnEl}
      >
        <ul
          class={classM("list", toggle() && "active")}
          id={listId}
          aria-labelledby={btnId}
          tabindex="-1"
          ref={listEl}
        >
          <div class={classM("list-inner")}>
            <For each={cpList}>
              {(item, idx) => {
                const id = createUniqueId();
                return (
                  <li
                    id={id}
                    class={classM(
                      "list-item",
                      item.content === selected().item.content && "active"
                    )}
                    role="option"
                    data-value={item.value || item.content}
                    aria-selected={item.selected}
                    aria-disabled={item.disabled}
                    onClick={onClickListItem}
                  >
                    {renderListTemplate(item, idx)}
                  </li>
                );
              }}
            </For>
          </div>
        </ul>
      </Dismiss>
    </>
  );
};

export default Select;
