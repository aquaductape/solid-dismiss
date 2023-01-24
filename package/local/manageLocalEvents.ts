import { TLocalState } from "./localState";
import { removeMenuButtonEvents } from "./menuButton";

export const removeLocalEvents = (
  state: TLocalState,
  { isCleanup = false }: { isCleanup?: boolean } = {}
) => {
  removeMenuButtonEvents(state, isCleanup);
};
