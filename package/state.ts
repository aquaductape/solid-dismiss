import { JSX } from "solid-js";
import { TFocusElementOnClose } from ".";

export type TState = {
  uniqueId: string;
  id: string;
  menuButton: JSX.Element | (() => JSX.Element);
  menuPopup: string | JSX.Element | (() => JSX.Element);
  focusElementOnOpen: "menuPopup" | string | JSX.Element | (() => JSX.Element);
  focusElementOnClose: TFocusElementOnClose;
  closeButtons:
    | string
    | JSX.Element
    | (string | JSX.Element)[]
    | (() => JSX.Element)
    | (() => (string | JSX.Element)[]);
  children: boolean;
  cursorKeys: boolean;
  closeWhenMenuButtonIsTabbed: boolean;
  closeWhenMenuButtonIsClicked: boolean;
  closeWhenScrolling: boolean;
  closeWhenDocumentBlurs: boolean;
  closeWhenClickedOutside: boolean;
  closeWhenEscapeKeyIsPressed: boolean;
  overlay:
    | boolean
    | {
        ref?: (el: HTMLElement) => void;
        className?: string;
        classList?: { [key: string]: boolean };
      };
  trapFocus: boolean;
  removeScrollbar: boolean;
  useAriaExpanded: boolean;
  mountedElseWhere: boolean;
  hasFocusSentinels: string;
  closeBtn: HTMLElement[];
  menuPopupEl: HTMLElement | null;
  menuBtnEl: HTMLElement;
  focusSentinelFirstEl: HTMLDivElement;
  focusSentinelLastEl: HTMLDivElement;
  containerEl: HTMLDivElement;
  overlayEl: HTMLDivElement;
  closeBtnsAdded: boolean;
  menuPopupAdded: boolean;
  menuBtnId: string;
  addedFocusOutAppEvents: boolean;
  menuBtnKeyupTabFired: boolean;
  prevFocusedEl: HTMLElement | null;
  containerFocusTimeoutId: number | null;
  menuButtonBlurTimeoutId: number | null;
  initOpenEffectDefer: boolean;
  refContainerCb: (el: HTMLElement) => void;
  refOverlayCb: (el: HTMLElement) => void;
  onClickOverlay: () => void;
  onFocusInContainer: () => void;
  onFocusOutContainer: () => void;
  onFocusSentinel: (e: FocusEvent) => void;
};
