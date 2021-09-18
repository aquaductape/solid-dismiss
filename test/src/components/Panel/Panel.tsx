import { createSignal, Component, JSX } from "solid-js";
const Panel: Component<{
  title: string;
  message: JSX.Element;
  demo: JSX.Element;
  class: string;
}> = ({ demo, message, title, class: className }) => {
  return (
    <div class={className}>
      <div>
        <h2>{title}</h2>
        {message}
      </div>
      <div>{demo}</div>
    </div>
  );
};

export default Panel;
