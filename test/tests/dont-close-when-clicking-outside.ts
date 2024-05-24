import { t } from "testcafe";
import { exists, loopStacks, pressSequentialKeys } from "./utils";

fixture`Don't close when clicking outside`.page`../dist/index.html`;

const id = "#dont-close-when-clicking-outside";
const idClass = ".dont-close-when-clicking-outside";
const initThreeStacks = () =>
  loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });

test("open 1 level with keyboard, click outside, popup must remain open", async (t) => {
  await t.click(`${id} h2`);
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");
  await t.click(`${id} h2`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
});

test("open 1 level with keyboard, click outside, popup must remain open, then press escape, finally popup must be closed", async (t) => {
  await t.click(`${id} h2`);
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");
  await t.click(`${id} h2`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.pressKey("esc");
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});

test("open 1 level with click, click menuButton again to close", async (t) => {
  await t.click(`${id} h2`);
  await loopStacks(t, [1], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await loopStacks(t, [1], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});

test("open 2 levels with keyboard, click outside, then tab on interactive element, popups must close", async (t) => {
  await t.click(`${id} h2`);
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.expect(exists(`${id}-1-level-2-popup`)).ok();
  await t.click(`${id} h2`);
  await t.pressKey("tab");
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
  await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
});

test("open 2 levels with clicks, click outside, then tab on interactive element, popups must close", async (t) => {
  await t.click(`${id} h2`);
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await t.click(`${id} h2`);
  await t.pressKey("tab");
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
  });
});

test("3 levels. reclick level 3 menuButton to close 3rd level", async (t) => {
  await initThreeStacks();
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();

  await t.click(`${idClass}-1-level-3-container button`);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await t.click(`${id}`);
});
test("press escape to close 3rd level", async (t) => {
  await initThreeStacks();
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();
  await t.pressKey("esc");
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
});

test("close all stacks when clicked outside sibling menuButton", async (t) => {
  await initThreeStacks();
  await t.click(`${idClass}-3-level-1-container button`); // close
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk;
  });
  await t.expect(exists(`${id}-3-level-1-popup`)).ok(); // outside sibling
});

// bottom 3 tests break during test run in Safari but user inputs works on actual Safari

test("close all 3 stacks when tabbing from last nested tabbable items", async (t) => {
  await t.click(`${idClass}-1-level-1-container button`);
  await loopStacks(t, [2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container:nth-child(3) button`);
  });
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await pressSequentialKeys(t, "tab", 6);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
  });

  // correct next tabbable sibling
  await t.pressKey("enter");
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await t.click(`${id} h2`);
});

test("close stacks as tabbing forwards outside all 3 stacks", async (t) => {
  await initThreeStacks();
  await pressSequentialKeys(t, "tab", 6);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok;
  });
  await pressSequentialKeys(t, "tab", 2);
  await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await pressSequentialKeys(t, "tab", 2);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});

test("close stacks as tabbing backwards outside all 3 stacks", async (t) => {
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-2-level-${num}-container button`);
  });
  await t.pressKey("shift+tab");
  await t.expect(exists(`${id}-2-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-2-level-${num}-popup`)).ok;
  });
  await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
  await t.expect(exists(`${id}-2-level-2-popup`)).notOk();
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
  await t.expect(exists(`${id}-2-level-1-popup`)).notOk();
  // shift tab to correct previous tabblable item
  await t.pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.click(`${id} h2`);
});
