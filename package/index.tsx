import {
  Show,
  Accessor,
  onMount,
  createEffect,
  createSignal,
  onCleanup,
  Component,
  JSX,
  on,
  createUniqueId,
} from "solid-js";

const Dismiss: Component<{
  /**
   * sets id attribute for root component
   */
  id?: string;
  class?: string;
  classList?: { [key: string]: boolean };
  /**
   * css selector, queried from document, to get menu button element. Or pass JSX element
   */
  menuButton: string | JSX.Element;
  /**
   * Default: root component element queries the second child element
   * css selector, queried from document, to get menu dropdown element. Or pass JSX element
   */
  menuDropdown?: string | JSX.Element | { [key: string]: JSX.Element };
  /**
   * Default: `undefined`
   *
   * `string` is css selector
   * css selector, queried from container element, to get close button element(s). Or pass JSX element(s)
   */
  closeButton?:
    | string
    | JSX.Element
    | { [key: string]: string | JSX.Element }
    | (string | JSX.Element)[];
  /**
   * css selector, queried from document, to get modal element. Or pass JSX element
   */
  modal?: string | JSX.Element;

  /**
   * sets `focusTrap` to `true` and `delegateFocus` to menuButton element
   */
  useModal?: boolean;
  focusTrap?: boolean;
  /**
   * Default: focus remains on `menuButton`
   *
   * which element, via selector*, to recieve focus after dropdown opens.
   *
   * *selector: css string queried from document, or if string value is `"menuDropdown"` uses menuDropdown element (which is the second child of root component element ). If object, will only grab first value
   */
  focusOnActive?:
    | "menuDropdown"
    | string
    | JSX.Element
    | { [key: string]: JSX.Element };
  /**
   * Default: uses browser default when focusing to next element.
   *
   * which element, via selector*, to recieve focus after dropdown closes.
   *
   * *selector: css string queried from document, or if string value is `"menuButton"` uses menuButton element
   *
   * An example would be to emulate native <select> element behavior, set which sets focus to menu button after dismiss.
   */
  focusOnLeave?: "menuButton" | string | JSX.Element;
  toggle: Accessor<boolean>;
  setToggle: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
  /**
   * default: `true`
   */
  escapeKey?: boolean;
}> = (props) => {
  const {
    id,
    menuButton,
    menuDropdown,
    focusOnLeave,
    focusOnActive,
    escapeKey,
    closeButton,
    children,
  } = props;
  let closeBtn: HTMLElement[] = [];
  let menuDropdownEl: HTMLElement | null = null;
  let menuBtnEl!: HTMLElement;
  let focusTrapEl1!: HTMLDivElement;
  let focusTrapEl2!: HTMLDivElement;
  let containerEl!: HTMLDivElement;
  let maskEl!: HTMLDivElement;
  let closeBtnsAdded = false;
  let menuDropdownAdded = false;
  let menuBtnId = "";
  let addedFocusOutAppEvents = false;
  let menuBtnKeyupTabFired = false;
  let prevFocusedEl: HTMLElement | null = null;

  const [maskActive, setMaskActive] = createSignal(false);

  let timeoutId: number | null = 0;
  let init = false;

  const runFocusOnLeave = () => {
    if (focusOnLeave == null) return;

    const el = queryElement(focusOnLeave);
    if (el) {
      // console.log({ el });
      el.focus();
    }
  };

  const runFocusOnActive = () => {
    if (focusOnActive == null) return;

    const el = queryElement(focusOnActive);
    if (el) {
      el.focus();
    }
  };

  const expandToggle = (toggle: boolean) => {
    menuBtnEl.setAttribute("aria-expanded", `${toggle}`);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (escapeKey === false) return;
    if (e.key !== "Escape") return;
    // menuBtnEl.focus();
    // props.setToggle(false);
    const item = dismissStack.pop();
    console.log("escape", dismissStack);
    if (item) {
      item.menuBtnEl.focus();
      item.setToggle(false);
    }

    if (dismissStack.length < 1) {
      addedKeydownListener = false;
      document.removeEventListener("keydown", onKeyDown);
    }
  };

  const onClickMask = () => {
    // runDelegateFocus();
    props.setToggle(false);
  };

  const onClickCloseButton = () => {
    // runDelegateFocus();
    props.setToggle(false);
  };

  const onClickMenuButton = () => {
    clearTimeout(timeoutId!);
    menuBtnEl.focus();
    timeoutId = null;

    const toggleVal = props.toggle();

    props.setToggle(!toggleVal);
  };

  const onBlurMenuButton = (e: FocusEvent) => {
    if (!props.toggle()) return;
    if (menuBtnKeyupTabFired) {
      menuBtnKeyupTabFired = false;
      return;
    }

    if (!e.relatedTarget) {
      if (addedFocusOutAppEvents) return;
      addedFocusOutAppEvents = true;
      prevFocusedEl = e.target as HTMLElement;
      document.addEventListener("click", onClickDocument);
      return;
    }

    removeOutsideFocusEvents();
    if (containerEl.contains(e.relatedTarget as HTMLElement)) return;
    props.setToggle(false);
  };

  const onKeydownMenuButton = (e: KeyboardEvent) => {
    if (!props.toggle()) return;
    if (e.key === "Tab" && e.shiftKey) {
      props.setToggle(false);
      menuBtnKeyupTabFired = true;
      menuBtnEl.removeEventListener("keydown", onKeydownMenuButton);
      menuBtnEl.removeEventListener("blur", onBlurMenuButton);
      return;
    }
    if (e.key !== "Tab") return;
    menuBtnKeyupTabFired = true;
    e.preventDefault();
    const el = queryFocusableMenuDropdownElement();
    if (el) {
      el.focus();
    } else {
      containerEl.focus();
    }
    menuBtnEl.removeEventListener("keydown", onKeydownMenuButton);
    menuBtnEl.removeEventListener("blur", onBlurMenuButton);
  };

  const onClickDocument = (e: MouseEvent) => {
    if (containerEl.contains(e.target as HTMLElement)) return;
    if (prevFocusedEl) {
      prevFocusedEl.removeEventListener("focus", onFocusFromOutsideAppOrTab);
    }
    prevFocusedEl = null;
    props.setToggle(false);
    addedFocusOutAppEvents = false;
  };

  const onFocusFromOutsideAppOrTab = (e: FocusEvent) => {
    if (containerEl.contains(e.target as HTMLElement)) return;

    props.setToggle(false);
    prevFocusedEl = null;
    addedFocusOutAppEvents = false;
    document.removeEventListener("click", onClickDocument);
  };

  const removeOutsideFocusEvents = () => {
    if (!prevFocusedEl) return;
    prevFocusedEl.removeEventListener("focus", onFocusFromOutsideAppOrTab);
    document.removeEventListener("click", onClickDocument);
    prevFocusedEl = null;
  };

  const onFocusOutContainer = (e: FocusEvent) => {
    if (focusOnLeave) {
      e.stopImmediatePropagation();
    }

    if (!e.relatedTarget) {
      if (addedFocusOutAppEvents) return;
      addedFocusOutAppEvents = true;
      prevFocusedEl = e.target as HTMLElement;
      document.addEventListener("click", onClickDocument, {
        once: true,
      });
      prevFocusedEl.addEventListener("focus", onFocusFromOutsideAppOrTab, {
        once: true,
      });
      return;
    }

    const newTimeout = window.setTimeout(() => {
      console.log("focusout");
      props.setToggle(false);

      if (props.setFocus) {
        props.setFocus(false);
      }
    });
    timeoutId = newTimeout;
  };

  const onFocusInContainer = () => {
    clearTimeout(timeoutId!);
    timeoutId = null;

    if (props.setFocus) {
      props.setFocus(true);
    }
  };

  const setTabIndexOfFocusTraps = (tabindex: "0" | "-1") => {
    if (!focusOnLeave) return;
    if (typeof menuButton === "string" || menuButton == null) {
      menuBtnEl = containerEl.querySelector(
        menuButton ? menuButton : "button"
      )!;
    } else {
      menuBtnEl = menuButton as HTMLElement;
    }
    focusTrapEl1.setAttribute("tabindex", tabindex);
    focusTrapEl2.setAttribute("tabindex", tabindex);
  };

  const onFocusTraps = () => {
    props.setToggle(false);
    // runDelegateFocus();
    setTabIndexOfFocusTraps("-1");
  };

  const queryFocusableMenuDropdownElement = () => {
    return containerEl.querySelector(
      'button, [href], input, select, textarea, details, [contentEditable=true], [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
  };

  const queryElement = (
    inputElement: any,
    type?: "menuButton" | "menuDropdown" | "closeButton"
  ): HTMLElement => {
    if (inputElement === "menuButton") {
      return menuBtnEl;
    }
    if (inputElement === "menuDropdown") {
      return menuDropdownEl!;
    }
    if (inputElement == null && type === "menuDropdown") {
      if (!containerEl) return null as any;
      return menuDropdownEl || (containerEl.children[0] as HTMLElement);
    }
    if (typeof inputElement === "string" && type === "menuButton") {
      if (!containerEl) return null as any;
      return containerEl.querySelector(inputElement) as HTMLElement;
    }
    if (typeof inputElement === "string" && type === "closeButton") {
      if (!containerEl) return null as any;
      return containerEl.querySelector(inputElement) as HTMLElement;
    }
    if (typeof inputElement === "string") {
      return document.querySelector(inputElement) as HTMLElement;
    }
    if (inputElement instanceof Element) {
      return inputElement as HTMLElement;
    }

    for (const key in inputElement as { [key: string]: HTMLElement }) {
      const item = (inputElement as { [key: string]: HTMLElement })[key];
      return item;
    }
    return null as any;
  };

  const addCloseButtons = () => {
    if (!closeButton) return;
    if (closeBtnsAdded) return;

    const getCloseButton = (closeButton: string | JSX.Element) => {
      if (closeButton == null) return;

      const el = queryElement(closeBtn);

      if (!el) return;
      closeBtnsAdded = true;

      el.addEventListener("click", onClickCloseButton);
      closeBtn?.push(el);
    };

    if (!(typeof closeButton === "object")) {
      getCloseButton(closeButton as any);
    }

    for (const key in closeButton as { [key: string]: HTMLElement }) {
      const item = (closeButton as { [key: string]: HTMLElement })[key];
      getCloseButton(item);
    }
  };

  const removeCloseButtons = () => {
    if (!closeButton) return;
    if (!closeBtnsAdded) return;

    closeBtnsAdded = false;
    closeBtn.forEach((el) => {
      el.removeEventListener("click", onClickCloseButton);
    });
    closeBtn = [];
  };

  const addMenuDropdownEl = () => {
    if (menuDropdownAdded) return;

    menuDropdownEl = queryElement(menuDropdown, "menuDropdown");
    if (menuDropdownEl) {
      menuDropdownAdded = true;
      if (!menuDropdownEl.getAttribute("aria-labelledby")) {
        menuDropdownEl.setAttribute("aria-labelledby", menuBtnId);
      }
    }
  };

  const removeMenuDropdownEl = () => {
    if (!menuDropdownEl) return;
    if (!menuDropdownAdded) return;
    menuDropdownEl = null;
    menuDropdownAdded = false;
  };

  const onFocusMenuButton = () => {
    clearTimeout(timeoutId!);
    menuBtnEl.addEventListener("keydown", onKeydownMenuButton);
    menuBtnEl.addEventListener("blur", onBlurMenuButton);
  };

  onMount(() => {
    menuBtnEl = queryElement(menuButton, "menuButton");
    menuBtnEl.addEventListener("click", onClickMenuButton);
    menuBtnEl.addEventListener("focus", onFocusMenuButton);
    menuBtnId = menuBtnEl.id;
    menuBtnEl.setAttribute("type", "button");
    expandToggle(props.toggle());
    if (!menuBtnId) {
      menuBtnId = createUniqueId();
      menuBtnEl.id = menuBtnId;
    }

    addCloseButtons();
    addMenuDropdownEl();
  });

  createEffect(
    on(
      props.toggle,
      (toggle) => {
        if (focusOnLeave) {
          setMaskActive(toggle);
          if (toggle) {
            document.documentElement.style.pointerEvents = "none";
            containerEl.style.pointerEvents = "all";
          } else {
            runFocusOnLeave();
            if (dismissStack.length <= 1) {
              document.documentElement.style.pointerEvents = "";
            }
            containerEl.style.pointerEvents = "";
          }
        }

        expandToggle(toggle);

        if (toggle) {
          addCloseButtons();
          addMenuDropdownEl();
          runFocusOnActive();
          if (!addedKeydownListener) {
            addedKeydownListener = true;
            document.addEventListener("keydown", onKeyDown);
          }
          dismissStack.push({ setToggle: props.setToggle, menuBtnEl });
          setTabIndexOfFocusTraps("0");
        } else {
          removeOutsideFocusEvents();
          removeMenuDropdownEl();
          removeCloseButtons();
          setTabIndexOfFocusTraps("-1");
          if (dismissStack.find((item) => item.menuBtnEl === menuBtnEl)) {
            dismissStack.pop();
          }
          if (dismissStack.length < 1) {
            addedKeydownListener = false;
            document.removeEventListener("keydown", onKeyDown);
          }
        }
      },
      { defer: true }
    )
  );

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
    menuBtnEl.removeEventListener("click", onClickMenuButton);
    removeCloseButtons();
    removeMenuDropdownEl();
    removeOutsideFocusEvents();
  });

  return (
    <Show when={props.toggle()}>
      <div
        id={id}
        class={props.class}
        data-solid-dismiss-dropdown-container
        classList={props.classList || {}}
        onFocusIn={onFocusInContainer}
        onFocusOut={onFocusOutContainer}
        tabindex="-1"
        ref={containerEl}
      >
        {maskActive() && (
          <div
            style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: none; z-index: -1;"
            onClick={onClickMask}
            ref={maskEl}
          ></div>
        )}
        {children}
        {focusOnLeave && (
          <div
            tabindex="-1"
            onFocus={onFocusTraps}
            style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none;"
            aria-hidden="true"
            ref={focusTrapEl1}
          ></div>
        )}
        {focusOnLeave && (
          <div
            tabindex="-1"
            onFocus={onFocusTraps}
            style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none;"
            aria-hidden="true"
            ref={focusTrapEl2}
          ></div>
        )}
      </div>
    </Show>
  );
};

let addedKeydownListener = false;
const dismissStack: {
  setToggle: (v: boolean) => void;
  menuBtnEl: HTMLElement;
}[] = [];

export default Dismiss;
