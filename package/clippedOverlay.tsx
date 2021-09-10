import { dismissStack, TDismissStack } from "./dismissStack";
import { parseValToNum } from "./utils";

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let generalTimeoutId: number | null = null;
let scrollTimeoutId: number | null = null;
let transitionendTimeoutId: number | null = null;
let animationendTimeoutId: number | null = null;
let addedScrollEvent = false;
let addedResizeEvent = false;
const timeoutAmount = 75;
// browsers on smartphones tend to have hide/show navbars that change viewport size
const resizeTimeoutAmount = 400;

const overlaySize = { height: 0, width: 0 };

const isTopStackOverlayBlock = () =>
  dismissStack[dismissStack.length - 1].overlay === "block";

const getTopClippedOverlayStack = () => {
  for (let i = dismissStack.length - 1; i >= 0; i--) {
    const stack = dismissStack[i];
    if (stack.isOverlayClipped) {
      return stack;
    }
  }
  return null;
};

const createClippedPoints = (checkMenuButtonIsObscured?: boolean) => {
  const { menuBtnEl, menuPopupEl, detectIfMenuButtonObscured } =
    getTopClippedOverlayStack()!;
  const bcrs = [
    menuBtnEl.getBoundingClientRect(),
    menuPopupEl.getBoundingClientRect(),
  ];
  const [menuBtnBCR, menuPopupBCR] = bcrs;
  const [menuBtnStyle, menuPopupStyle] = [
    window.getComputedStyle(menuBtnEl),
    window.getComputedStyle(menuPopupEl),
  ];
  const navBarBCR = getNavBarIfCoversMenuButton();
  const bgCoverPath = `M 0,0 H ${overlaySize.width} V ${overlaySize.height} H 0 Z`;

  function getNavBarIfCoversMenuButton() {
    if (!detectIfMenuButtonObscured) return null;

    let element = document.elementFromPoint(
      menuBtnBCR.x + menuBtnBCR.width / 2,
      Math.sign(menuBtnBCR.y) === -1 ? 2 : menuBtnBCR.y + 2
    );
    if (!element) return null;
    let navBarElResult = null;
    let divElResult = null;
    if (menuBtnEl.contains(element)) return null;
    console.log({ element });

    while (element) {
      if (element.tagName === "HEADER" || element.tagName === "NAV") {
        navBarElResult = element;
      }

      if (element.tagName === "DIV" && !divElResult) {
        divElResult = element;
      }

      element = element?.parentElement!;
    }

    if (!navBarElResult) {
      if (!divElResult) return null;
      return divElResult.getBoundingClientRect();
    }

    // @ts-ignore
    return navBarElResult.getBoundingClientRect()!;
  }

  const parseRadius = (radiusInput: string, bcr: DOMRect) => {
    const maxXRadius = bcr.width;
    const maxYRadius = bcr.height;
    let splitRadiusStr = radiusInput.split(" ");
    if (splitRadiusStr.length === 1) {
      splitRadiusStr.push(splitRadiusStr[0]);
    }

    const radii = splitRadiusStr.map((radius, idx) => {
      const isPercent = (radius as string).match("%");
      const isX = idx === 0;
      let value = parseValToNum(radius);

      if (isPercent) {
        if (isX) {
          value = (value / 100) * bcr.width;
        } else {
          value = (value / 100) * bcr.height;
        }
      }

      if (isX && value > maxXRadius) {
        value = maxXRadius;
      }

      if (!isX && value > maxYRadius) {
        value = maxYRadius;
      }

      return value;
    });

    return { x: radii[0], y: radii[1] };
  };

  const createPath = (bcr: DOMRect, style: CSSStyleDeclaration) => {
    const bTopLeftRadius = parseRadius(style.borderTopLeftRadius, bcr);
    const bTopRightRadius = parseRadius(style.borderTopRightRadius, bcr);
    const bBottomRightRadius = parseRadius(style.borderBottomRightRadius, bcr);
    const bBottomLeftRadius = parseRadius(style.borderBottomLeftRadius, bcr);

    const topRightArc = bTopRightRadius
      ? `A ${bTopRightRadius.x} ${bTopRightRadius.y} 0 0 1 ${bcr.right} ${
          bcr.top + bTopRightRadius.y
        }`
      : "";
    const bottomRightArc = bBottomRightRadius
      ? `A ${bBottomRightRadius.x} ${bBottomRightRadius.y} 0 0 1 ${
          -bBottomRightRadius.x + bcr.right
        } ${bcr.bottom}`
      : "";
    const bottomLeftArc = bBottomLeftRadius
      ? `A ${bBottomLeftRadius.x} ${bBottomLeftRadius.y} 0 0 1 ${bcr.left} ${
          -bBottomLeftRadius.y + bcr.bottom
        }`
      : "";
    const topLeftArc = bTopLeftRadius
      ? `A ${bTopLeftRadius.x} ${bTopLeftRadius.y} 0 0 1 ${
          bTopLeftRadius.x + bcr.left
        } ${bcr.top}`
      : "";

    const topCommand = `${bcr.right - bTopRightRadius.x}`;
    const rightCommand = `${bcr.bottom - bBottomRightRadius.y}`;
    const bottomCommand = `${bcr.left + bBottomLeftRadius.x}`;
    const leftCommand = `${bcr.top + bTopLeftRadius.y}`;

    return [
      `M ${bcr.x + bTopLeftRadius.x}, ${bcr.y} H ${
        bcr.right - bTopRightRadius.x
      } ${topRightArc} V ${
        bcr.bottom - bBottomRightRadius.y
      } ${bottomRightArc} H ${
        bcr.left + bBottomLeftRadius.x
      } ${bottomLeftArc} V ${bcr.top + bTopLeftRadius.y} ${topLeftArc} z `,
      `M 0, 0 H ${overlaySize.width} V ${overlaySize.height} H ${
        bcr.left + bBottomRightRadius.x
      } V ${
        bcr.bottom
      } ${bottomLeftArc} V ${leftCommand} ${topLeftArc} H ${topCommand} ${topRightArc} V ${rightCommand} ${bottomRightArc} H ${bottomCommand} V ${
        overlaySize.height
      } H 0 z`,
    ];
  };

  const createNavBarPath = () => {
    if (!navBarBCR) return null;

    return `M 0, 0 h ${overlaySize.width} v ${navBarBCR.height} H 0 z`;
  };

  const [menuButtonPath, menuButtonClipPath] = createPath(
    menuBtnBCR,
    menuBtnStyle
  );
  const [menuPopupPath, menuPopupClipPath] = createPath(
    menuPopupBCR,
    menuPopupStyle
  );

  return {
    bgCoverPath,
    navBarPath: createNavBarPath(),
    menuButtonClipPath,
    menuPopupClipPath,
    menuButtonPath,
    menuPopupPath,
  };
};

const generalOverlay = () => {
  window.clearTimeout(generalTimeoutId!);

  generalTimeoutId = window.setTimeout(() => {
    if (!dismissStack.length || isTopStackOverlayBlock()) return;

    const stack = getTopClippedOverlayStack()!;
    const { toggle, containerEl } = stack;

    if (!containerEl.isConnected) return;
    if (!toggle()) return;

    updateSVG(stack);
  }, timeoutAmount);
};

const onViewportResizeOverlay = () => {
  window.clearTimeout(generalTimeoutId!);

  generalTimeoutId = window.setTimeout(() => {
    if (!dismissStack.length || isTopStackOverlayBlock()) return;

    const stack = getTopClippedOverlayStack()!;
    const { toggle, containerEl } = stack;

    if (!containerEl.isConnected) return;
    if (!toggle()) return;

    updateSVG(stack);
  }, resizeTimeoutAmount);
};

const onAnimationendOverlay = (e: Event) => {
  window.clearTimeout(animationendTimeoutId!);

  animationendTimeoutId = window.setTimeout(() => {
    if (!dismissStack.length || isTopStackOverlayBlock()) return;

    const stack = getTopClippedOverlayStack()!;
    const { toggle, containerEl, menuPopupEl, menuBtnEl } = stack;

    if (!toggle()) return;

    const target = e.target as HTMLElement;
    if (
      !(
        target === containerEl ||
        target === menuPopupEl ||
        target === menuBtnEl
      )
    )
      return;

    updateSVG(stack);
  }, timeoutAmount);
};

const onTransitionendOverlay = (e: Event) => {
  window.clearTimeout(transitionendTimeoutId!);

  transitionendTimeoutId = window.setTimeout(() => {
    if (!dismissStack.length || isTopStackOverlayBlock()) return;

    const stack = getTopClippedOverlayStack()!;
    const { toggle, containerEl, menuPopupEl, menuBtnEl } = stack;

    if (!toggle()) return;

    const target = e.target as HTMLElement;
    if (
      !(
        target === containerEl ||
        target === menuPopupEl ||
        target === menuBtnEl
      )
    )
      return;

    updateSVG(stack);
  }, timeoutAmount);
};

const onScrollOverlay = (e: Event) => {
  window.clearTimeout(scrollTimeoutId!);

  scrollTimeoutId = window.setTimeout(() => {
    if (!dismissStack.length || isTopStackOverlayBlock()) return;

    const stack = getTopClippedOverlayStack()!;
    const { menuBtnEl, containerEl, toggle } = stack;
    if (!toggle()) return;

    const target = e.target as HTMLElement;
    if (!(target.contains(menuBtnEl) || target.contains(containerEl))) return;

    updateSVG(stack);
  }, timeoutAmount);
};

export const addOverlayEvents = () => {
  const { containerEl, menuPopupEl } = dismissStack[dismissStack.length - 1];

  if (!addedScrollEvent) {
    addedScrollEvent = true;
    window.addEventListener("scroll", onScrollOverlay, {
      capture: true,
      passive: true,
    });
  }

  addResizeEvent();
  addMutationObserver();

  containerEl.addEventListener("transitionend", onTransitionendOverlay);
  // menuBtnEl.addEventListener("transitionend", onTransitionendOverlay);
  menuPopupEl.addEventListener("transitionend", onTransitionendOverlay);
  containerEl.addEventListener("animationend", onAnimationendOverlay);
  // menuBtnEl.addEventListener("animationend", onAnimationendOverlay);
  menuPopupEl.addEventListener("animationend", onAnimationendOverlay);
};

export const removeOverlayEvents = (stack: TDismissStack | undefined) => {
  if (!stack) return;
  const { containerEl, menuBtnEl, menuPopupEl } = stack;

  if (!dismissStack.filter((stack) => stack.isOverlayClipped).length) {
    console.log("remove ResizeEvent MutationObserver Scroll");

    addedScrollEvent = false;
    window.removeEventListener("scroll", onScrollOverlay, { capture: true });
    removeResizeEvent();
    removeMutationObserver();
  }

  console.log("remove transitionend animationend");
  containerEl.removeEventListener("transitionend", onTransitionendOverlay);
  menuBtnEl.removeEventListener("transitionend", onTransitionendOverlay);
  menuPopupEl.removeEventListener("transitionend", onTransitionendOverlay);
  containerEl.removeEventListener("animationend", onAnimationendOverlay);
  menuBtnEl.removeEventListener("animationend", onAnimationendOverlay);
  menuPopupEl.removeEventListener("animationend", onAnimationendOverlay);
};

const addResizeEvent = () => {
  const { containerEl, menuBtnEl, menuPopupEl } = getTopClippedOverlayStack()!;

  if ("ResizeObserver" in window) {
    let init = true;
    resizeObserver = new ResizeObserver(() => {
      if (init) {
        init = false;
        return;
      }
      console.log("resize!!");
      generalOverlay();
    });
    resizeObserver.observe(document.body);
    resizeObserver.observe(menuBtnEl);
    resizeObserver.observe(containerEl);
    resizeObserver.observe(menuPopupEl!);
  }

  if (!addedResizeEvent) {
    addedResizeEvent = true;
    window.addEventListener("resize", onViewportResizeOverlay, {
      passive: true,
    });
  }
};

const removeResizeEvent = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  addedScrollEvent = false;
  window.removeEventListener("resize", onViewportResizeOverlay);
};

const addMutationObserver = () => {
  const { containerEl, menuBtnEl, menuPopupEl } = getTopClippedOverlayStack()!;
  let init = true;
  const config = { attributes: true };
  mutationObserver = new MutationObserver(() => {
    if (init) {
      init = false;
      return;
    }
    generalOverlay();
  });
  mutationObserver.observe(menuBtnEl, config);
  mutationObserver.observe(containerEl, config);
  mutationObserver.observe(menuPopupEl!, config);
};

const removeMutationObserver = () => {
  if (!mutationObserver) return;
  mutationObserver.disconnect();
  mutationObserver = null;
};

export const updateSVG = (
  stack?: TDismissStack | null,
  checkMenuButtonIsObscured?: boolean
) => {
  const { menuPopupEl, overlayEl, containerEl } =
    stack || getTopClippedOverlayStack()!;

  if (!overlayEl || !menuPopupEl || !containerEl) return;
  const svgEl = overlayEl.firstElementChild!;
  const paths = svgEl.querySelectorAll("path") as NodeListOf<SVGPathElement>;
  paths[5].style.pointerEvents = "none";
  paths[6].style.pointerEvents = "none";
  const {
    bgCoverPath,
    menuButtonPath,
    menuPopupPath,
    menuPopupClipPath,
    navBarPath,
  } = createClippedPoints(checkMenuButtonIsObscured);

  overlaySize.width = overlayEl.clientWidth;
  overlaySize.height = overlayEl.clientHeight;

  svgEl.setAttribute(
    "viewBox",
    `0 0 ${overlaySize.width} ${overlaySize.height}`
  );

  // paths in mask
  paths[0].setAttribute("d", bgCoverPath);
  paths[1].setAttribute("d", menuButtonPath);
  paths[2].setAttribute("d", navBarPath || "");
  paths[3].setAttribute("d", menuPopupPath);

  //paths in clipPath
  paths[4].setAttribute("d", menuPopupClipPath);

  //paths
  paths[5].setAttribute("d", bgCoverPath + menuButtonPath);
  paths[6].setAttribute("d", navBarPath || "");
  paths[7].setAttribute("d", bgCoverPath);

  paths[5].style.pointerEvents = "all";
  paths[6].style.pointerEvents = "all";
};

export const mountOverlayClipped = () => {
  const { overlayEl, id, uniqueId } = dismissStack[dismissStack.length - 1];
  overlaySize.width = overlayEl!.clientWidth;
  overlaySize.height = overlayEl!.clientHeight;

  const {
    bgCoverPath,
    menuButtonPath,
    menuPopupPath,
    menuPopupClipPath,
    navBarPath,
  } = createClippedPoints();
  const style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
    999 + dismissStack.length
  }; pointer-events:none;`;

  const clipPathId = `${uniqueId}--overlay--clipped`;
  const clipPathMenuPopupId = `${clipPathId}--menu-dropdown`;
  const maskId = `${clipPathId}--mask`;

  addOverlayEvents();

  const svgEl = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${overlaySize.width} ${overlaySize.height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMaxYMax slice"
      version="1.1"
    >
      <defs>
        <mask id={maskId}>
          <path d={bgCoverPath} fill="#fff" />
          <path d={menuButtonPath} fill="#000" />
          <path d={navBarPath || ""} fill="#fff" />
          <path d={menuPopupPath} fill="#000" />
        </mask>
        <clipPath id={clipPathMenuPopupId} clip-rule="evenodd">
          <path d={menuPopupClipPath} />
        </clipPath>
      </defs>
      <path
        clip-path={`url(#${clipPathMenuPopupId})`}
        fill-rule="evenodd"
        d={bgCoverPath + menuButtonPath}
        style="pointer-events: all;"
        fill="none"
      />
      <path
        clip-path={`url(#${clipPathMenuPopupId})`}
        d={navBarPath || ""}
        style="pointer-events: all"
        fill="none"
      />
      <path
        mask={`url(#${maskId})`}
        d={bgCoverPath}
        solid-dismiss-overlay-mask={id}
        fill="none"
        style="pointer-events: none"
      />
    </svg>
  ) as HTMLElement;
  overlayEl!.style.cssText = style;
  overlayEl!.appendChild(svgEl);

  pollOverlaySize(overlayEl!);
};

const pollOverlaySize = (overlayEl: HTMLElement) => {
  let maxPolling = 5;
  let counter = 0;

  if (overlaySize.height && overlaySize.width) return;

  const run = () => {
    setTimeout(() => {
      overlaySize.width = overlayEl!.clientWidth;
      overlaySize.height = overlayEl!.clientHeight;
      if (!overlaySize.height || !overlaySize.width) {
        if (counter >= maxPolling) return;
        counter++;
        return run();
      }
      updateSVG();
    });
  };

  run();
};
