type smoothScrollToProps = {
  destination: number | HTMLElement;
  container?: Window | HTMLElement;
  duration?: number;
  padding?: number;
  currentPosition?: number;
  onEnd?: Function;
  native?: boolean;
  locked?: { release?: number; forever?: boolean } | boolean;
  easing?:
    | "linear"
    | "easeInQuad"
    | "easeOutQuad"
    | "easeInOutQuad"
    | "easeInCubic"
    | "easeOutCubic"
    | "easeInOutCubic"
    | "easeInQuart"
    | "easeOutQuart"
    | "easeInOutQuart"
    | "easeInQuint"
    | "easeOutQuint"
    | "easeInOutQuint";
};

let instances = 0;

const smoothScrollTo = ({
  container = window,
  duration = 400,
  padding = 0,
  destination,
  currentPosition,
  locked: lockedProp = false,
  easing = "linear",
  native = true,
  onEnd,
}: smoothScrollToProps) => {
  if (currentPosition == null) {
    currentPosition =
      (container as Window).scrollY != null
        ? (container as Window).scrollY
        : (container as HTMLElement).scrollTop;
  }
  const locked = { x: currentPosition };

  const scrollTo = (x: number) => {
    if (container.scrollTo)
      return container.scrollTo({ top: x, behavior: "auto" });
    return ((container as HTMLElement).scrollTop! = x);
  };

  const onLockScroll = () => scrollTo(locked.x);
  const setDestination = () => {
    if (typeof destination === "number") {
      destination += padding;
      return;
    }
    // TODO if parent is element, use element.scrollTop instead of window.scrollY, it broke in a particular UI scroll component
    destination =
      destination.getBoundingClientRect().top + window.scrollY + padding;
  };

  const animateScroll = () => {
    let stop = false;

    const startx = currentPosition;
    const destx = destination as number;
    let start: number | null = null;
    let end = null;
    let x = null as unknown as number;

    const animate = (timeStamp: number) => {
      start = timeStamp;
      end = start + duration;
      draw(timeStamp);
    };

    const onStop = () => {
      locked.x = destination as number;
      scrollTo(destination as number);

      requestAnimationFrame(() => {
        onEnd && onEnd();
      });

      instances--;

      if (!lockedProp) return;

      if (typeof lockedProp === "boolean") {
        container.removeEventListener("scroll", onLockScroll);
      } else {
        const { forever, release } = lockedProp;

        if (forever) {
          return;
        }

        if (release) {
          setTimeout(() => {
            container.removeEventListener("scroll", onLockScroll);
          }, release);
        } else {
          container.removeEventListener("scroll", onLockScroll);
        }
      }
      return;
    };

    const draw = (now: number) => {
      if (instances > 1) {
        instances--;
        return;
      }

      if (now - start! > duration) {
        onStop();

        return;
      }

      const p = (now - start!) / duration;
      const val = easingFunctions[easing](p);
      x = startx! + (destx - startx!) * val;

      locked.x = x;
      scrollTo(x);

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(animate);
  };

  setDestination();

  if (!!container.scrollTo && supportsSmoothScrolling() && native) {
    nativeSmoothScrollTo({
      destination: destination as number,
      container,
    }).then(() => {
      onEnd && onEnd();
    });
    return;
  }

  if (lockedProp) {
    container.addEventListener("scroll", onLockScroll);
  }

  instances++;
  animateScroll();

  if (typeof lockedProp === "boolean") return;
  return onLockScroll;
};

type nativeSmoothScrollToProps = {
  destination: number;
  container?: Window | HTMLElement;
  onEnd?: Function;
};

function nativeSmoothScrollTo({
  destination,
  container = window,
  onEnd,
}: nativeSmoothScrollToProps) {
  return new Promise<boolean>((resolve, reject) => {
    let same = 0; // a counter
    const elem = document.scrollingElement!;

    // last known scroll positions
    let lastPos_top = elem.scrollTop;

    // pass the user defined options along with our default
    const scrollOptions = {
      behavior: "smooth" as ScrollBehavior,
      top: destination,
    };

    // expected final position
    const maxScroll_top = elem.scrollHeight - elem.clientHeight;
    // const maxScroll_left = elem.scrollWidth - elem.clientWidth;
    const targetPos_top = Math.max(
      0,
      Math.min(maxScroll_top, scrollOptions.top)
    );
    // const targetPos_left = Math.max(
    //   0,
    //   Math.min(maxScroll_left, scrollOptions.left)
    // );

    container.scrollTo(scrollOptions);
    requestAnimationFrame(check);

    // this function will be called every painting frame
    // for the duration of the smooth scroll operation
    function check() {
      // check our current position
      const newPos_top = elem.scrollTop;
      // const newPos_left = elem.scrollLeft;
      // we add a 1px margin to be safe
      // (can happen with floating values + when reaching one end)
      const at_destination = Math.abs(newPos_top - targetPos_top) <= 1;
      // && Math.abs(newPos_left - targetPos_left) <= 1;
      // same as previous
      if (
        newPos_top === lastPos_top
        // && newPos_left === lastPos_left
      ) {
        if (same++ > 2) {
          // if it's more than two frames
          if (at_destination) {
            return resolve(true);
          }
          return reject();
        }
      } else {
        same = 0; // reset our counter
        // remember our current position
        lastPos_top = newPos_top;
        // lastPos_left = newPos_left;
      }
      // check again next painting frame
      requestAnimationFrame(check);
    }
  });
}

function supportsSmoothScrolling() {
  return "scrollBehavior" in document.documentElement.style;
}

const easingFunctions = {
  // no easing, no acceleration
  linear: (t: number) => t,
  // accelerating from zero velocity
  easeInQuad: (t: number) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t: number) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t: number) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t: number) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t: number) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t: number) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

export default smoothScrollTo;
