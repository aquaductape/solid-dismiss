import { dismissStack, TDismissStack } from "./dismissStack";
import { parseValToNum } from "./utils";

// downside is when smartphone dynamic navbar(iOS: bottom bar )
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let generalTimeoutId: number | null = null;
let scrollTimeoutId: number | null = null;
let transitionendTimeoutId: number | null = null;
let animationendTimeoutId: number | null = null;
let addedScrollEvent = false;
let addedResizeEvent = false;
const timeoutAmount = 155;
// browsers on smartphones tend to have hide/show navbars that change viewport size
const resizeTimeoutAmount = 250;

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

const createClippedPoints = () => {
  const { menuBtnEl, menuDropdownEl } = getTopClippedOverlayStack()!;
  const bcrs = [
    menuBtnEl.getBoundingClientRect(),
    menuDropdownEl.getBoundingClientRect(),
  ];
  const [menuBtnBCR, menuDropdownBCR] = bcrs;
  const [menuBtnStyle, menuDropdownStyle] = [
    window.getComputedStyle(menuBtnEl),
    window.getComputedStyle(menuDropdownEl),
  ];
  const bgCover = `M 0,0 H ${overlaySize.width} V ${overlaySize.height} H 0 Z`;

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
      `${bgCover} M ${bcr.x + bTopLeftRadius.x}, ${bcr.y} H ${
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

  const [menuButtonPath, menuButtonClipPath] = createPath(
    menuBtnBCR,
    menuBtnStyle
  );
  const [menuDropdownPath, menuDropdownClipPath] = createPath(
    menuDropdownBCR,
    menuDropdownStyle
  );

  return {
    menuButtonClipPath,
    menuDropdownClipPath,
    menuButtonPath,
    menuDropdownPath,
  };
};

const generalOverlay = (e?: Event) => {
  window.clearTimeout(generalTimeoutId!);

  generalTimeoutId = window.setTimeout(() => {
    if (!dismissStack.length || isTopStackOverlayBlock()) return;

    const stack = getTopClippedOverlayStack()!;
    const { toggle, containerEl } = stack;

    if (!containerEl.isConnected) return;
    if (!toggle()) return;

    console.log("resize ", e && e.type);

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
    const { toggle, containerEl, menuDropdownEl, menuBtnEl } = stack;

    if (!toggle()) return;

    const target = e.target as HTMLElement;
    if (
      !(
        target === containerEl ||
        target === menuDropdownEl ||
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
    const { toggle, containerEl, menuDropdownEl, menuBtnEl } = stack;

    if (!toggle()) return;

    const target = e.target as HTMLElement;
    if (
      !(
        target === containerEl ||
        target === menuDropdownEl ||
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
  const { containerEl, menuBtnEl, menuDropdownEl } =
    dismissStack[dismissStack.length - 1];

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
  menuDropdownEl.addEventListener("transitionend", onTransitionendOverlay);
  containerEl.addEventListener("animationend", onAnimationendOverlay);
  // menuBtnEl.addEventListener("animationend", onAnimationendOverlay);
  menuDropdownEl.addEventListener("animationend", onAnimationendOverlay);
};

export const removeOverlayEvents = (stack: TDismissStack | undefined) => {
  if (!stack) return;
  const { containerEl, menuBtnEl, menuDropdownEl } = stack;

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
  menuDropdownEl.removeEventListener("transitionend", onTransitionendOverlay);
  containerEl.removeEventListener("animationend", onAnimationendOverlay);
  menuBtnEl.removeEventListener("animationend", onAnimationendOverlay);
  menuDropdownEl.removeEventListener("animationend", onAnimationendOverlay);
};

const addResizeEvent = () => {
  const { containerEl, menuBtnEl, menuDropdownEl } =
    getTopClippedOverlayStack()!;

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
    resizeObserver.observe(menuDropdownEl!);
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
  const { containerEl, menuBtnEl, menuDropdownEl } =
    getTopClippedOverlayStack()!;
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
  mutationObserver.observe(menuDropdownEl!, config);
};

const removeMutationObserver = () => {
  if (!mutationObserver) return;
  mutationObserver.disconnect();
  mutationObserver = null;
};

export const updateSVG = (stack?: TDismissStack) => {
  const { menuDropdownEl, overlayEl, containerEl } =
    stack || getTopClippedOverlayStack()!;

  if (!overlayEl || !menuDropdownEl || !containerEl) return;
  const {
    menuButtonPath,
    menuDropdownPath,
    menuButtonClipPath,
    menuDropdownClipPath,
  } = createClippedPoints();
  const svgEl = overlayEl.firstElementChild!;
  const pathEl = svgEl.querySelectorAll("path") as NodeListOf<SVGPathElement>;

  overlaySize.width = overlayEl.clientWidth;
  overlaySize.height = overlayEl.clientHeight;

  svgEl.setAttribute(
    "viewBox",
    `0 0 ${overlaySize.width} ${overlaySize.height}`
  );

  pathEl[0].setAttribute("d", menuDropdownClipPath);
  pathEl[1].setAttribute("d", menuButtonClipPath);
  pathEl[2].setAttribute("d", menuButtonPath);
  pathEl[3].setAttribute("d", menuDropdownPath);
};

export const mountOverlayClipped = () => {
  const { overlayEl, id } = dismissStack[dismissStack.length - 1];
  overlaySize.width = overlayEl!.clientWidth;
  overlaySize.height = overlayEl!.clientHeight;

  const {
    menuButtonPath,
    menuDropdownPath,
    menuButtonClipPath,
    menuDropdownClipPath,
  } = createClippedPoints();
  const style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
    999 + dismissStack.length
  }; pointer-events:none;`;

  const clipPathId = `${id}--overlay--clipped`;
  const clipPathMenuButtonId = `${clipPathId}--menu--button`;
  const clipPathMenuDropdownId = `${clipPathId}--menu-dropdown`;

  addOverlayEvents();

  const child = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${overlaySize.width} ${overlaySize.height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMaxYMax slice"
      version="1.1"
    >
      <defs>
        <clipPath id={clipPathMenuButtonId} clip-rule="evenodd">
          <path d={menuDropdownClipPath} />
        </clipPath>
        <clipPath id={clipPathMenuDropdownId} clip-rule="evenodd">
          <path d={menuButtonClipPath} />
        </clipPath>
      </defs>
      <path
        clip-path={`url(#${clipPathMenuButtonId})`}
        fill-rule="evenodd"
        d={menuButtonPath}
        style="pointer-events: all;"
      />
      <path
        clip-path={`url(#${clipPathMenuDropdownId})`}
        fill-rule="evenodd"
        d={menuDropdownPath}
      />
    </svg>
  );
  overlayEl!.style.cssText = style;
  overlayEl!.appendChild(child as HTMLElement);

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
      console.log("polling");
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
