/**
 *  Iterate stack backwards, checks item, pass it to close callback. Setting `continue` to `true` property in checkCb return object, will continue iteration
 */
export const checkThenClose = <T extends unknown>(
  arr: T[],
  checkCb: (item: T) => { item?: T; continue: boolean },
  destroyCb: (item: T) => void
) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const { item, continue: _continue } = checkCb(arr[i]);

    if (item) {
      destroyCb(item);
    }

    if (_continue) continue;

    return;
  }
};
