import { Show, For } from "solid-js";
import { createStore, produce } from "solid-js/store";

const [store, setStore] = createStore<{ [key: string]: any }>({});
export const updateStore = (key: string, value: string) => {
  // console.log(newStore);
  setStore(
    produce((s) => {
      // @ts-ignore
      s[key] = value;
    })
  );
};
export const removeKeyFromStore = (key: string) => {
  // const newStore = JSON.parse(JSON.stringify(store));
  // delete newStore[key];
  // console.log(newStore);
  setStore(
    produce((s) => {
      // @ts-ignore
      delete s[key];
    })
  );
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
