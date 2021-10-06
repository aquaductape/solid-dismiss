import { t } from "testcafe";
import { exists, loopStacks, pressSequentialKeys } from "./utils";

fixture`Nested Regular`.page`../dist/index.html`;

const id = "#nested-regular";
const idClass = ".nested-regular";
const initThreeStacks = () =>
  loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });

test("open 3 levels with keyboard", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await t.expect(exists(`${id}-1-level-2-popup`)).ok();
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();
  await t.click(`${id} h2`);
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

test("close all stacks when clicked outside", async (t) => {
  await initThreeStacks();
  await t.click(`${id}`);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
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
