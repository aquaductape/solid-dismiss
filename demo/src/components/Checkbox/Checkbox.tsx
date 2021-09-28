import { Component } from "solid-js";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import c from "./Checkbox.module.scss";

const s = scopeModuleClasses(c);

const Checkbox: Component<{
  onChange: (value: boolean) => void;
  checked: boolean;
}> = (props) => {
  const { onChange } = props;

  return (
    <label class={s("checkbox")}>
      <span class={s("checkbox__input")}>
        <input
          type="checkbox"
          name="checkbox"
          checked={props.checked}
          onChange={(e) => onChange(e.currentTarget.checked)}
        />
        <span class={s("checkbox__control")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            // @ts-ignore
            focusable="false"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              d="M1.73 12.91l6.37 6.37L22.79 4.59"
            />
          </svg>
        </span>
      </span>
      <span>{props.children}</span>
    </label>
  );
};

export default Checkbox;
