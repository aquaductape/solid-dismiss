import { t } from "testcafe";
import { exists, loopStacks, pressSequentialKeys } from "./utils";

fixture`Multiple Menu Buttons CSS`.page`../dist/index.html`;

const id = "#multiple-menu-buttons-css";
const idClass = ".multiple-menu-buttons-css";

const initThreeStacks = () =>
  loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });

test("open 3 levels with keyboard", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.wait(100);
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await t.expect(exists(`${id}-1-level-2-popup`)).ok();
  await t.wait(100);
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();
});

test("open 3 levels with keyboard, with menu buttons that switch after 2 seconds", async (t) => {
  await t.click(`${id} h2`);
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");

  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await pressSequentialKeys(t, "tab", 3);
  await t.wait(2200);
  await t.pressKey("enter");

  await t.expect(exists(`${id}-2-level-2-popup`)).ok();
  await pressSequentialKeys(t, "tab", 3);
  await t.wait(2200);
  await t.pressKey("enter");

  await t.expect(exists(`${id}-2-level-3-popup`)).ok();
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

test("close all 3 stacks when tabbing from last nested tabbable items", async (t) => {
  await t.click(`${idClass}-1-level-1-container button`);
  await loopStacks(t, [2, 3], async (t, num) => {
    await t.click(
      `div${idClass}-1-level-${num}-container:nth-of-type(3) button`
    );
  });
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await pressSequentialKeys(t, "tab", 6);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
  });
  await t.pressKey("enter");
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
});
