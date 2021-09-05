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

const getTopClippedOverlayAndNormalElements = () => {
  const elements: HTMLElement[] = [];
  for (let i = dismissStack.length - 1; i >= 0; i--) {
    const stack = dismissStack[i];
    if (stack.isOverlayClipped) {
      elements.push(stack.menuBtnEl, stack.menuDropdownEl);
      return elements;
    }

    elements.push(stack.menuDropdownEl);
  }

  return elements;
};

const createClippedPoints = () => {
  const elements = getTopClippedOverlayAndNormalElements();
  const [menuBtnEl, menuDropdownEl] = elements;
  const bcrs = elements.map((element) => element.getBoundingClientRect());
  const [menuBtnBCR, menuDrodownBCR] = bcrs;

  const [menuBtnStyle, menuDropdownStyle] = [
    window.getComputedStyle(menuBtnEl),
    window.getComputedStyle(menuDropdownEl),
  ];
  const bgCover = `M 0,0 H ${overlaySize.width} V ${overlaySize.height} H 0 Z`;

  const createOverlappedGroups = (input: DOMRect[]) => {
    const bcrs: { bcr: DOMRect; id: number | null }[] = input.map((item) => ({
      bcr: item,
      id: null,
    }));
    const groups: DOMRect[][] = [];
    let index = 0;

    for (let i = 0; i < bcrs.length; i++) {
      const itemI = bcrs[i];
      for (let j = 0; j < bcrs.length; j++) {
        if (i === j) continue;
        const itemJ = bcrs[j];

        if (doesOverlap(itemI.bcr, itemJ.bcr)) {
          const idI = itemI.id;
          const idJ = itemJ.id;

          if (idI == null && idJ == null) {
            itemI.id = index;
            itemJ.id = index;
            index++;
            groups.push([itemI.bcr, itemJ.bcr]);
            continue;
          }

          if (idI != null && idJ == null) {
            groups[idI].push(itemJ.bcr);
            itemJ.id = idI;
            continue;
          }

          if (idJ != null && idI == null) {
            groups[idJ].push(itemI.bcr);
            itemI.id = idJ;
            continue;
          }
        }
      }
    }
    const leftover = bcrs
      .filter((item) => item.id == null)
      .map((item) => item.bcr);
    if (leftover) {
      groups.push(leftover);
    }

    return groups;
  };

  const doesOverlap = (bcr1: DOMRect, bcr2: DOMRect) => {
    return (
      bcr1.top + bcr1.height > bcr2.top &&
      bcr1.left + bcr1.width > bcr2.left &&
      bcr1.bottom - bcr1.height < bcr2.bottom &&
      bcr1.right - bcr1.width < bcr2.right
    );
  };

  const doesCover = (bcr1: DOMRect, bcr2: DOMRect) => {
    if (
      bcr1.top <= bcr2.top &&
      bcr1.left <= bcr2.left &&
      bcr1.bottom >= bcr2.bottom &&
      bcr1.right >= bcr2.right
    ) {
      return { which: "menuButton" };
    }
    if (
      bcr2.top <= bcr1.top &&
      bcr2.left <= bcr1.left &&
      bcr2.bottom >= bcr1.bottom &&
      bcr2.right >= bcr1.right
    ) {
      return { which: "menuDropdown" };
    }

    return null;
  };

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
      ? `a ${bTopRightRadius.x} ${bTopRightRadius.y} 0 0 1 ${bTopRightRadius.x} ${bTopRightRadius.y}`
      : "";
    const bottomRightArc = bBottomRightRadius
      ? `a ${bBottomRightRadius.x} ${
          bBottomRightRadius.y
        } 0 0 1 ${-bBottomRightRadius.x} ${bBottomRightRadius.y}`
      : "";
    const bottomLeftArc = bBottomLeftRadius
      ? `a ${bBottomLeftRadius.x} ${
          bBottomLeftRadius.y
        } 0 0 1 ${-bBottomLeftRadius.x} ${-bBottomLeftRadius.y}`
      : "";
    const topLeftArc = bTopLeftRadius
      ? `a ${bTopLeftRadius.x} ${bTopLeftRadius.y} 0 0 1 ${
          bTopLeftRadius.x
        } ${-bTopLeftRadius.y}`
      : "";

    return `M ${bcr.x + bTopLeftRadius.x}, ${bcr.y} h ${
      bcr.width - bTopRightRadius.x - bTopLeftRadius.x
    } ${topRightArc} v ${
      bcr.height - bBottomRightRadius.y - bTopRightRadius.y
    } ${bottomRightArc} h ${
      -bcr.width + bBottomLeftRadius.x + bBottomRightRadius.x
    } ${bottomLeftArc} v ${
      -bcr.height + bTopLeftRadius.y + bBottomLeftRadius.y
    } ${topLeftArc} z `;
  };

  // make sure to split overlapped shapes into groups if some "overlapped" shapes don't intersect others
  const createOutlineShape = (bcrs: DOMRect[]) => {
    // all shapes must overlap
    if (bcrs.length === 1) return createRectangle(bcrs[0]);

    bcrs.sort((a, b) => {
      return a.y - b.y;
    });
    const root = bcrs[0];
    let path = `M ${root.left}, ${root.top}`;
    let currentDirection: "down" | "up" | "left" | "right" = "right";
    let currentBCR: DOMRect = root;

    let counter = 0;

    const findIntersectedBCR = (
      type: "max" | "min",
      rectType: "left" | "right" | "top" | "bottom",
      bcrs: DOMRect[],
      cb: (bcrItem: DOMRect) => boolean
    ) => {
      bcrs.sort((a, b) => {
        let prop = rectType;
        if (a[prop] === b[prop]) {
          if (rectType === "top") {
            return b.right - a.right;
          }

          if (rectType === "left") {
            return a.top - b.top;
          }

          if (rectType === "right") {
            return b.bottom - a.bottom;
          }

          if (rectType === "bottom") {
            return a.left - b.left;
          }
        }
        return type === "max"
          ? b[rectType] - a[rectType]
          : a[rectType] - b[rectType];
      });

      return bcrs.find(cb);
    };

    const buildOutline = () => {
      // if (!currentBCR) return;
      counter++;
      if (counter >= 1000) {
        console.warn("infinte!!!");
        return;
      }

      let result!: DOMRect;
      let resultValue = 0;
      let resultPath = "";

      const run = () => {
        if (currentDirection === "down") {
          const foundBCR = findIntersectedBCR(
            "min",
            "top",
            bcrs,
            (bcr) =>
              bcr.top >= currentBCR.top &&
              bcr.left <= currentBCR.right &&
              bcr.right >= currentBCR.right &&
              bcr !== currentBCR
          );

          result = currentBCR;
          resultValue = result.bottom;
          resultPath = ` V ${resultValue}`;
          currentDirection = "left";

          if (foundBCR) {
            result = foundBCR;
            resultValue = result.top;
            currentBCR = foundBCR;
            currentDirection = "right";
            resultPath = ` V ${resultValue}`;
          }

          return;
        }

        if (currentDirection === "right") {
          const foundBCR = findIntersectedBCR(
            "min",
            "left",
            bcrs,
            (bcr) =>
              bcr.left >= currentBCR.left &&
              bcr.left <= currentBCR.right &&
              bcr.top <= currentBCR.top &&
              bcr !== currentBCR
          );

          result = currentBCR;
          resultValue = result.right;
          resultPath = ` H ${resultValue}`;
          currentDirection = "down";

          if (foundBCR) {
            result = foundBCR;
            resultValue = result.left;
            currentBCR = foundBCR;
            currentDirection = "up";
            resultPath = ` H ${resultValue}`;
          }
          return;
        }

        if (currentDirection === "left") {
          const foundBCR = findIntersectedBCR(
            "max",
            "right",
            bcrs,
            (bcr) =>
              bcr.right <= currentBCR.right &&
              bcr.top <= currentBCR.bottom &&
              bcr.bottom >= currentBCR.bottom &&
              bcr !== currentBCR
          );
          result = currentBCR;
          resultValue = result.left;
          resultPath = ` H ${resultValue}`;
          currentDirection = "up";

          if (foundBCR) {
            result = foundBCR;
            resultValue = result.right;
            currentBCR = foundBCR;
            currentDirection = "down";
            resultPath = ` H ${resultValue}`;
          }
          return;
        }

        if (currentDirection === "up") {
          const foundBCR = findIntersectedBCR(
            "max",
            "bottom",
            bcrs,
            (bcr) =>
              bcr.bottom <= currentBCR.bottom &&
              bcr.right >= currentBCR.left &&
              bcr.left <= currentBCR.left &&
              bcr !== currentBCR
          );

          result = currentBCR;
          resultValue = result.top;
          resultPath = ` V ${resultValue}`;
          currentDirection = "right";
          if (foundBCR) {
            result = foundBCR;
            resultValue = result.bottom;
            currentBCR = foundBCR;
            currentDirection = "left";
            resultPath = ` V ${resultValue}`;
          }
          return;
        }
      };

      run();

      path += resultPath;

      if (resultValue === root.top && currentDirection === "right") return;

      buildOutline();
    };

    buildOutline();
    console.log(path);

    return path + " z";
  };

  const createRectangle = (bcr: DOMRect) => {
    return ` M ${bcr.x}, ${bcr.y} H ${bcr.right} V ${bcr.bottom} H ${bcr.x} z`;
  };

  const createOverlappedShape = (bcr1: DOMRect, bcr2: DOMRect) => {
    const x = Math.max(bcr1.x, bcr2.x);
    const y = Math.max(bcr1.y, bcr2.y);
    const xx = Math.min(bcr1.x + bcr1.width, bcr2.x + bcr2.width) - x;
    const yy = Math.min(bcr1.y + bcr1.height, bcr2.y + bcr2.height) - y;

    return `
    ${createRectangle(bcr1)}
        ${createRectangle(bcr2)}
    M ${x}, ${y} h ${xx} v ${yy} h -${xx} z
  `;
  };

  //   const isCover = doesCover(menuBtnBCR, menuDrodownBCR);
  //
  //   if (isCover) {
  //     if (isCover.which === "menuButton") {
  //       return `${bgCover} ${createPath(menuBtnBCR, menuBtnStyle)}`;
  //     }
  //     if (isCover.which === "menuDropdown") {
  //       return `${bgCover} ${createPath(menuDrodownBCR, menuDropdownStyle)}`;
  //     }
  //   }
  if (elements.length > 2) {
    const groups = createOverlappedGroups(bcrs);
    debugger;
    let path = "";
    groups.forEach((group) => {
      path += " " + createOutlineShape(group);
    });

    return `${bgCover} ${path}`;
  }

  if (doesOverlap(menuBtnBCR, menuDrodownBCR)) {
    return `${bgCover} ${createOverlappedShape(menuBtnBCR, menuDrodownBCR)}`;
  }

  return `${bgCover} ${createPath(menuBtnBCR, menuBtnStyle)} ${createPath(
    menuDrodownBCR,
    menuDropdownStyle
  )}`;
};

const createClippedPath = () => {
  return (
    <path
      fill-rule="evenodd"
      d={createClippedPoints()}
      style="pointer-events: all;"
    />
  ) as SVGPathElement;
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
  menuBtnEl.addEventListener("transitionend", onTransitionendOverlay);
  menuDropdownEl.addEventListener("transitionend", onTransitionendOverlay);
  containerEl.addEventListener("animationend", onAnimationendOverlay);
  menuBtnEl.addEventListener("animationend", onAnimationendOverlay);
  menuDropdownEl.addEventListener("animationend", onAnimationendOverlay);
};

export const removeOverlayEvents = (stack: TDismissStack | undefined) => {
  if (!stack) return;
  const { containerEl, menuBtnEl, menuDropdownEl } = stack;

  if (dismissStack.every((stack) => !stack.isOverlayClipped)) {
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
  } else {
    if (!addedResizeEvent) {
      addedResizeEvent = true;
      window.addEventListener("resize", generalOverlay, { passive: true });
    }
  }
};

const removeResizeEvent = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  } else {
    if (dismissStack.every((stack) => !stack.isOverlayClipped)) {
      addedScrollEvent = false;
      window.removeEventListener("resize", generalOverlay);
    }
  }
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
  const svgEl = overlayEl.firstElementChild!;
  const pathEl = svgEl.querySelector("path")!;

  overlaySize.width = overlayEl.clientWidth;
  overlaySize.height = overlayEl.clientHeight;

  svgEl.setAttribute(
    "viewBox",
    `0 0 ${overlaySize.width} ${overlaySize.height}`
  );
  pathEl.setAttribute("d", createClippedPoints());
};

export const mountOverlayClipped = () => {
  const { overlayEl } = dismissStack[dismissStack.length - 1];
  const style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
    999 + dismissStack.length
  }; pointer-events:none;`;

  overlaySize.width = overlayEl!.clientWidth;
  overlaySize.height = overlayEl!.clientHeight;

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
      {createClippedPath()}
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
