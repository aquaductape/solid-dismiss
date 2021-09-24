import { Selector } from "testcafe";

export const exists = (selector: string) => Selector(selector).exists;

export const clickOverlay = async (t: TestController) => {
  const hasOverlay = await Selector(".overlay").exists;

  if (!hasOverlay) {
    return t.click("body");
  }

  // testcafe click on topmost nested overlays, will close all stacks, which shouldn't happen, instead it should close topmost overlay stack.
  // user manual testing clicks on the browser meets that expectation.
  // so instead we're using DOM Element.click method on topmost overlay element.
  return t.eval(() => {
    const overlays = document.querySelectorAll(".overlay");

    const overlay = overlays[overlays.length - 1] as HTMLElement;
    console.log("overlays.length", overlays.length);

    overlay.click();
  });
};

export const loopStacks = async (
  t: TestController,
  items: number[],
  cb: (t: TestController, number: number) => Promise<any>
) => {
  for (const num of items) {
    await cb(t, num);
  }
};

export const pressSequentialKeys = (
  t: TestController,
  keys: string,
  amount: number
) => {
  let count = 0;

  const run = (t: TestController): TestController => {
    if (count === amount) return t;
    count++;

    return run(t.pressKey(keys));
  };

  return run(t);
};
