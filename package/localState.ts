import { Accessor } from "solid-js";
import { TDismiss } from ".";

export type TLocalState = Omit<
  TDismiss,
  "id" | "ref" | "animation" | "onOpen" | "class" | "classList"
> & {
  uniqueId: string;
  id: string;
  hasFocusSentinels: boolean;
  menuPopupEl?: HTMLElement | null;
  menuBtnEl?: HTMLElement;
  focusSentinelFirstEl?: HTMLDivElement;
  focusSentinelLastEl?: HTMLDivElement;
  containerEl?: HTMLDivElement;
  overlayEl?: HTMLDivElement;
  menuPopupAdded: boolean;
  menuBtnId: string;
  addedFocusOutAppEvents: boolean;
  menuBtnKeyupTabFired: boolean;
  prevFocusedEl?: HTMLElement | null;
  stopComponentEventPropagation?: boolean;
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
  onMouseDownMenuButtonRef: () => void;
  setOpen: (v: boolean) => void;
  open: Accessor<boolean>;
  upperStackRemovedByFocusOut: boolean;
  closeByDismissEvent: boolean;
};
