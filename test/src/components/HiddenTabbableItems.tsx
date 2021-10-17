import { Component, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import IFrame from "./IFrame";

const HiddenRoot = () => {
  return (
    <div style="display: none">
      <div>
        {" "}
        <button>Hidden Button</button>
      </div>
      <div>
        {" "}
        <button>Hidden Button</button>
      </div>
      <div>
        {" "}
        <button>Hidden Button</button>
      </div>
    </div>
  );
};

const EmptyNested = () => {
  return (
    <div style="position: absolute;">
      <div>
        <div>
          <button style="display: none;">Hidden Button</button>
        </div>
      </div>
      <div style="display: none;">
        <div>
          <IFrame></IFrame>
        </div>
      </div>
      <div>
        <div style="display: none;">
          <button>Hidden Button</button>
        </div>
      </div>
    </div>
  );
};

const types: { [key in Types]: () => JSX.Element } = {
  hiddenRoot: HiddenRoot,
  emptyNested: EmptyNested,
};

type Types = "hiddenRoot" | "emptyNested";

const HiddenTabbableItems: Component<{ type?: Types }> = ({
  type = "hiddenRoot",
}) => {
  return <Dynamic component={types[type]}></Dynamic>;
};

export default HiddenTabbableItems;
