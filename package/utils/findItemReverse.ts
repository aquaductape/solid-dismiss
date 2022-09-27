export const findItemReverse = <T extends unknown>(
  arr: T[],
  cb: (item: T) => any
): [T | null, number] => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i];
    const foundItem = cb(item);
    if (foundItem) {
      return [item, i];
    }
  }

  return [null, -1];
};
