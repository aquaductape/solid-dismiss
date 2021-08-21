import { Show, For } from "solid-js";
import { createStore } from "solid-js/store";

const [store, setStore] = createStore<{ [key: string]: any }>({});
export const updateStore = (key: string, value: string) => {
  setStore(JSON.parse(JSON.stringify({ ...store, key: value })));
};

const IOSDebugger = () => {
  return (
    <div id="debugger">
      <For each={Object.entries(store)}>
        {([key, value]) => {
          return (
            <div class="list">
              <strong>{key}</strong>: {value}
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default IOSDebugger;
