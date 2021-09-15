import { JSX, Accessor } from "solid-js";
import { TFocusElementOnClose } from ".";
import { TDismissStack } from "./dismissStack";

export type TLocalState = {
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
  children: JSX.Element;
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
  removeScrollbar:
    | boolean
    | ((open: boolean, dismissStack: TDismissStack[]) => void);
  useAriaExpanded: boolean;
  mountedElseWhere: boolean;
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
  containerFocusTimeoutId: number | null;
  menuButtonBlurTimeoutId: number | null;
  refContainerCb: (el: HTMLElement) => void;
  refOverlayCb: (el: HTMLElement) => void;
  onClickOverlayRef: (e: Event) => void;
  onFocusInContainerRef: (e: Event) => void;
  onFocusOutContainerRef: (e: FocusEvent) => void;
  onFocusFromOutsideAppOrTabRef: (e: FocusEvent) => void;
  onClickDocumentRef: (e: MouseEvent) => void;
  onKeydownMenuButtonRef: (e: KeyboardEvent) => void;
  onClickMenuButtonRef: (e: Event) => void;
  onBlurMenuButtonRef: (e: FocusEvent) => void;
  onFocusMenuButtonRef: (e: Event) => void;
  onClickCloseButtonsRef: (e: Event) => void;
  setOpen: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
  open: Accessor<boolean>;
};
