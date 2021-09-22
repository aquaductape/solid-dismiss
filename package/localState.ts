import { JSX, Accessor } from "solid-js";
import { TDismiss } from ".";
import { TDismissStack } from "./dismissStack";

export type TLocalState = Omit<
  TDismiss,
  "id" | "ref" | "animation" | "onOpen" | "class" | "classList"
> & {
  uniqueId: string;
  id: string;
  hasFocusSentinels: boolean;
  closeBtns: HTMLElement[];
  menuPopupEl?: HTMLElement | null;
  menuBtnEl?: HTMLElement;
  focusSentinelFirstEl?: HTMLDivElement;
  focusSentinelLastEl?: HTMLDivElement;
  containerEl?: HTMLDivElement;
  overlayEl?: HTMLDivElement;
  closeBtnsAdded: boolean;
  menuPopupAdded: boolean;
  menuBtnId: string;
  addedFocusOutAppEvents: boolean;
  menuBtnKeyupTabFired: boolean;
  prevFocusedEl?: HTMLElement | null;
  timeouts: {
    containerFocusTimeoutId: number | null;
    menuButtonBlurTimeoutId: number | null;
  };
  refContainerCb: (el: HTMLElement) => void;
  refOverlayCb: (el: HTMLElement) => void;
  onClickOverlayRef: (e: Event) => void;
  onFocusInContainerRef: (e: FocusEvent) => void;
  onFocusOutContainerRef: (e: FocusEvent) => void;
  onFocusFromOutsideAppOrTabRef: (e: FocusEvent) => void;
  onClickDocumentRef: (e: MouseEvent) => void;
  onKeydownMenuButtonRef: (e: KeyboardEvent) => void;
  onClickMenuButtonRef: (e: Event) => void;
  onBlurMenuButtonRef: (e: FocusEvent) => void;
  onFocusMenuButtonRef: (e: Event) => void;
  onClickCloseButtonsRef: (e: Event) => void;
  onMouseDownMenuButtonRef: () => void;
  setOpen: (v: boolean) => void;
  open: Accessor<boolean>;
  upperStackRemovedByFocusOut: boolean;
};
