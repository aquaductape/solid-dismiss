import { TDismiss } from "..";
import { TLocalState } from "../local/localState";

export type TDismissStack = Pick<
  TDismiss,
  | "focusElementOnClose"
  | "overlayElement"
  | "open"
  | "setOpen"
  | "mountedPopupsSafeList"
> &
  Pick<
    TLocalState,
    | "timeouts"
    | "uniqueId"
    | "cursorKeys"
    | "closeWhenDocumentBlurs"
    | "closeWhenMenuButtonIsTabbed"
    | "closeWhenEscapeKeyIsPressed"
    | "upperStackRemovedByFocusOut"
    | "menuPopupEl"
    | "overlayEl"
    | "overlay"
    | "focusSentinelBeforeEl"
    | "focusSentinelAfterEl"
    | "ignoreMenuPopupWhenTabbing"
  > & {
    id: string;
    menuBtnEls: HTMLElement[];
    focusedMenuBtn: { el: HTMLElement | null };
    containerEl: HTMLElement;
    detectIfMenuButtonObscured: boolean;
    queueRemoval: boolean;
  };

export const dismissStack: TDismissStack[] = [];

export const addDismissStack = (props: TDismissStack) => {
  dismissStack.push(props!);
};

export const removeDismissStack = (id: string) => {
  const foundIdx = dismissStack.findIndex((item) => item.uniqueId === id);
  if (foundIdx === -1) return;

  const foundStack = dismissStack[foundIdx];
  dismissStack.splice(foundIdx, 1);

  return foundStack;
};
