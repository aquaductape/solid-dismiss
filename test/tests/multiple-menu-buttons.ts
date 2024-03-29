import { t } from "testcafe";
import { exists, loopStacks, pressSequentialKeys } from "./utils";

fixture`Multiple Menu Buttons`.page`../dist/index.html`;

const id = "#multiple-menu-buttons";
const idClass = ".multiple-menu-buttons";

const initThreeStacks = () =>
  loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });

test("open 1 level with click, close button again to close, then open with enter key", async (t) => {
  await t.click(`${idClass}-1-level-1-container button`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.wait(100);
  await t.click(`${idClass}-1-level-1-container button`);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
  await t.wait(100);
  await t.pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
});

test("open 1 level with click, click menuPopup item, then focus must remain on that active item even after button switches", async (t) => {
  await t.click(`${idClass}-2-level-1-container button`);
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await t.wait(100);
  await t.click(`${id}-2-level-1-popup .input-test`);
  await t.wait(2200);
  await t
    .wait(100)
    .expect(await t.eval(() => document.activeElement?.className))
    .eql("input-test");
});

test("open 1 level with click, click outside, menuPopup should close and other switching button shouldn't be focused. Then repeat steps except don't click outside. menuPopup should remain open", async (t) => {
  await t.click(`${idClass}-2-level-1-container button`);
  await t.wait(2200);
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await t.click(`${idClass}-2-level-1-container button`, { offsetY: -100 });
  await t.expect(exists(`${id}-2-level-1-popup`)).notOk();
  await t.wait(2200);
  await t
    .expect(
      await t.eval(() => {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement === document.body) return true;
        return activeElement.nodeName !== "button";
      })
    )
    .ok();
  await t.click(`${idClass}-2-level-1-container button`);
  await t.wait(2200);
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
});

test("open 1 level with click, click outside, menuPopup should close and other switching button shouldn't be focused", async (t) => {
  await t.click(`${idClass}-2-level-1-container button`);
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await t.click(`${idClass}-2-level-1-container button`, { offsetY: -100 });
  await t.expect(exists(`${id}-2-level-1-popup`)).notOk();
  await t.wait(2200);
  await t
    .expect(
      await t.eval(() => {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement === document.body) return true;
        return activeElement.nodeName !== "button";
      })
    )
    .ok();
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

test("open with keyboard, close with pressing escape, then open again with pressing enter", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.wait(100);
  await t.pressKey("esc");
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
  await t.pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
});

test("open 3 levels. reclick level 3 menuButton to close 3rd level", async (t) => {
  await initThreeStacks();
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();
  await t.wait(1500);

  await t.click(`${idClass}-1-level-3-container button`);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
});

test("open 3 levels. On second stack, click neighbor menuButton which will close 3rd stack, then open 3rd stack based from menuButton", async (t) => {
  await initThreeStacks();
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();

  await t.expect(exists(`${idClass}-1-level-4-container`)).ok();
  await t.click(`div${idClass}-1-level-3-container:nth-of-type(2) button`);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
});

test("close all stacks when clicked outside", async (t) => {
  await initThreeStacks();
  await t.click(id);
  await t.wait(100);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
  });
});

test("close all stacks when clicked outside sibling menuButton", async (t) => {
  await initThreeStacks();
  await t.click(`${idClass}-2-level-1-container button`); // close
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk;
  });
  await t.wait(100);
  await t.expect(exists(`${id}-2-level-1-popup`)).ok(); // outside sibling
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
