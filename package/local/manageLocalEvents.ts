import { TLocalState } from "./localState";
import { removeMenuButtonEvents } from "./menuButton";

export const removeLocalEvents = (
  state: TLocalState,
  { isCleanup = false }: { isCleanup?: boolean } = {}
) => {
  document.removeEventListener("click", state.onClickDocumentRef);

  removeMenuButtonEvents(state, isCleanup);
};
