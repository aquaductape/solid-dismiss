import { TLocalState } from "./localState";

export const removeLocalEvents = (
  state: TLocalState,
  { onCleanup = false }: { onCleanup?: boolean } = {}
) => {
  document.removeEventListener("click", state.onClickDocumentRef);
  state.menuBtnEl?.removeEventListener("blur", state.onBlurMenuButtonRef);
  if (onCleanup) {
    state.menuBtnEl!.removeEventListener("click", state.onClickMenuButtonRef);
    state.menuBtnEl?.removeEventListener("focus", state.onFocusMenuButtonRef);
  }
};
