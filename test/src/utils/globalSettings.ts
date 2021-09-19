import { createStore, produce } from "solid-js/store";

type TSettings = {
  animation: TAnimation;
};

type TAnimation = {
  enable: boolean;
  duration: number;
};
const [settings, _setSettings] = createStore<TSettings>({
  animation: {
    enable: false,
    duration: 300,
  },
});

export default settings;
export const setSettings = (cb: (s: TSettings) => void) =>
  _setSettings(produce<TSettings>(cb));
