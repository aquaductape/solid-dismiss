import { TDismiss } from "..";

export type TLocalState = Omit<
  TDismiss,
  "id" | "ref" | "animation" | "onOpen" | "class" | "classList"
> & {
  uniqueId: string;
  id: string;
  hasFocusSentinels: boolean;
  menuPopupEl?: HTMLElement | null;
  menuBtnEls?: HTMLElement[];
  focusedMenuBtn: { el: HTMLElement | null };
  focusSentinelBeforeEl?: HTMLDivElement;
  focusSentinelAfterEl?: HTMLDivElement;
  containerEl?: HTMLDivElement;
  overlayEl?: HTMLDivElement;
  menuPopupAdded: boolean;
  menuBtnId: string;
  addedFocusOutAppEvents: boolean;
  menuBtnKeyupTabFired: boolean;
  menuBtnMouseDownFired?: boolean;
  prevFocusedEl?: HTMLElement | null;
  stopComponentEventPropagation?: boolean;
  timeouts: {
    containerFocusTimeoutId: number | null;
    menuButtonBlurTimeoutId: number | null;
  };
  refContainerCb: (el: HTMLElement) => void;
  refOverlayCb: (el: HTMLElement) => void;
  onClickOverlayRef: (e: Event) => void;
  onClickOutsideMenuButtonRef: () => void;
  onFocusInContainerRef: (e: FocusEvent) => void;
  onFocusOutContainerRef: (e: FocusEvent) => void;
  onFocusFromOutsideAppOrTabRef: (e: FocusEvent) => void;
  onKeydownMenuButtonRef: (e: KeyboardEvent) => void;
  onClickMenuButtonRef: (e: Event) => void;
  onBlurMenuButtonRef: (e: FocusEvent) => void;
  onFocusMenuButtonRef: (e: Event) => void;
  onMouseDownMenuButtonRef: (e: MouseEvent) => void;
  upperStackRemovedByFocusOut: boolean;
  closeByDismissEvent: boolean;
};
