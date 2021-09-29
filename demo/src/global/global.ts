import { createStore, produce } from "solid-js/store";

type TGlobal = {
  nav: TNav;
};

type TNav = {
  logoActive: boolean;
};

const [context, _setContext] = createStore<TGlobal>({
  nav: {
    logoActive: false,
  },
});

export default context;
export const setContext = (cb: (s: TGlobal) => void) =>
  _setContext(produce<TGlobal>(cb));
