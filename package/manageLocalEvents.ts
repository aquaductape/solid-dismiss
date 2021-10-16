import { TLocalState } from "./localState";
import { removeMenuButtonEvents } from "./menuButton";

export const removeLocalEvents = (
  state: TLocalState,
  { onCleanup = false }: { onCleanup?: boolean } = {}
) => {
  document.removeEventListener("click", state.onClickDocumentRef);

  removeMenuButtonEvents(state, onCleanup);
};
