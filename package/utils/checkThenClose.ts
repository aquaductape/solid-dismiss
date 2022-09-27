/**
 *  Iterate stack backwards, checks item, pass it close callback. First falsy value breaks iteration.
 */
export const checkThenClose = <T extends unknown>(
  arr: T[],
  checkCb: (item: T) => T | null | undefined,
  destroyCb: (item: T) => void
) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = checkCb(arr[i]);

    if (item) {
      destroyCb(item);
      continue;
    }

    return;
  }
};
