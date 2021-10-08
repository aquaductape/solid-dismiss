import { createEffect, createSignal } from "solid-js";
import { Component, onMount, Show } from "solid-js";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import c from "./CodeEditor.module.scss";

const s = scopeModuleClasses(c);

const CodeEditor: Component<{ contentJSX: string; contentCSS?: string }> = ({
  contentJSX,
  contentCSS,
}) => {
  let codeEl!: HTMLDivElement;
  const [language, setLanguage] = createSignal("jsx");

  // onMount(() => {
  //   codeEl.innerHTML = contentJSX;
  // });

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest("button") as HTMLElement;
    if (!button) return;
    const datatype = button.dataset.type;
    setLanguage(datatype!);
  };

  createEffect(() => {
    const value = language();
    if (value === "jsx") {
      const el = codeEl.querySelector(".simplebar-content") || codeEl;
      el.innerHTML = contentJSX;
    }
    if (value === "css") {
      const el = codeEl.querySelector(".simplebar-content") || codeEl;
      el.innerHTML = contentCSS!;
    }
  });

  return (
    <div>
      <div class={s("tabs")} onClick={onClick}>
        <button
          class={s("tab-button")}
          classList={{ [s("active")]: language() === "jsx" }}
          tabindex={contentCSS ? "0" : "-1"}
          data-type="jsx"
          style={contentCSS ? "" : "pointer-events: none;"}
        >
          JSX
        </button>
        <Show when={contentCSS}>
          <button
            class={s("tab-button")}
            classList={{ [s("active")]: language() === "css" }}
            data-type="css"
          >
            CSS
          </button>
        </Show>
      </div>
      <div
        class={s("code-editor")}
        data-simplebar
        data-simplebar-auto-hide="false"
        ref={codeEl}
      ></div>
    </div>
  );
};

export default CodeEditor;
