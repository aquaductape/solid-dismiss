import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { createEffect, createSignal } from "solid-js";
import { Component, onMount, Show } from "solid-js";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import c from "./CodeEditor.module.scss";

const s = scopeModuleClasses(c);

const CodeEditor: Component<{ contentJSX: string; contentCSS?: string }> = ({
  contentJSX,
  contentCSS,
}) => {
  let codeContainerEl!: HTMLDivElement;
  let codeEl!: HTMLDivElement;
  const [language, setLanguage] = createSignal("jsx");
  const [showEditor, setShowEditor] = createSignal(false);

  onMount(() => {
    createIntersectionObserver([codeContainerEl], (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowEditor(true);
          observer.unobserve(codeContainerEl);
        }
      });
    });
  });

  createEffect(() => {
    const value = language();

    if (!showEditor()) return;
    const el = codeEl.querySelector(".simplebar-content") || codeEl;

    if (value === "jsx") {
      el.innerHTML = contentJSX;
    }
    if (value === "css") {
      el.innerHTML = contentCSS!;
    }
  });

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest("button") as HTMLElement;
    if (!button) return;
    const datatype = button.dataset.type;
    setLanguage(datatype!);
  };

  return (
    <div class={s("code-editor-container")} ref={codeContainerEl}>
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
