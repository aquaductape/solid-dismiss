import { customElement } from "solid-element";

customElement("web-component-nested", () => {
  return (
    <div>
      <ul>
        {/* @ts-ignore */}
        <web-component-nested-item />
        {/* @ts-ignore */}
        <web-component-nested-item />
        {/* @ts-ignore */}
        <web-component-nested-item />
      </ul>
    </div>
  );
});

customElement("web-component-nested-item", () => {
  return (
    <li>
      <div></div>
      {/* @ts-ignore */}
      <web-component-button />
    </li>
  );
});
