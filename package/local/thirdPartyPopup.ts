import { dismissStack } from "../global/dismissStack";
import { globalState } from "../global/globalEvents";
import { checkThenClose } from "../utils/checkThenClose";
import isHiddenOrInvisbleShallow from "../utils/isHiddenOrInvisibleShallow";

export const getActiveMountedPopupFromSafeList = (safeList: string[]) => {
  if (globalState.thirdPartyPopupEl) {
    globalState.thirdPartyPopupEl = null;
    return null;
  }
  if (!document.hasFocus()) return null;

  const activeElement = globalState.clickTarget;
  const els = safeList.map(
    (selector) => document.querySelector(selector) as HTMLElement
  );

  const foundEl = els.find((el) => el && el.contains(activeElement)) || null;
  globalState.thirdPartyPopupEl = foundEl;
  return foundEl;
};

export const getFirstVisibleMountedPopupFromSafeList = (safeList: string[]) => {
  for (let selector of safeList) {
    const el = document.querySelector(selector) as HTMLElement;
    if (el && !isHiddenOrInvisbleShallow(el)) return el;
  }
  return null;
};

export const addEventsToActiveMountedPopup = () => {
  document.addEventListener("click", onClickDocument);
  document.addEventListener("keydown", onKeyDown, { capture: true });
};

export const removeEventsOnActiveMountedPopup = () => {
  document.removeEventListener("click", onClickDocument);
  document.removeEventListener("keydown", onKeyDown, { capture: true });
  globalState.thirdPartyPopupEl = null;
  globalState.thirdPartyPopupElPressedEscape = false;
};

const onClickDocument = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const { thirdPartyPopupEl } = globalState;
  if (thirdPartyPopupEl && thirdPartyPopupEl.contains(target)) {
    return;
  }

  checkThenClose(
    dismissStack,
    (item) => {
      const { containerEl } = item;
      if (containerEl.contains(target)) return { continue: false };
      return { item, continue: true };
    },
    (item) => {
      const { setOpen } = item;
      globalState.closedByEvents = true;
      setOpen(false);
      removeEventsOnActiveMountedPopup();
    }
  );
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key !== "Escape") return;
  globalState.thirdPartyPopupElPressedEscape = true;
};
