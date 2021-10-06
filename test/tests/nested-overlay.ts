import { t } from "testcafe";
import { clickOverlay, exists, loopStacks } from "./utils";

fixture`Nested Overlay`.page`../dist/index.html`;

const id = "#nested-overlay";
const idClass = ".nested-overlay";
const initThreeStacks = () =>
  loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });

test("Nested Overlay Popup: open 3 stacks, close one stack by clicking overlay", async (t) => {
  await initThreeStacks();
  await clickOverlay(t);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
});

test("Nested Overlay Popup: open 3 stacks, click items in top stack, all 3 stacks should remain open", async (t) => {
  await initThreeStacks();
  await t.click(`${id}-1-level-3-popup`, {
    offsetX: 10,
    offsetY: 10,
  });
  await t.click(`${id}-1-level-3-popup input`);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
});

test("Nested Overlay Popup: open 3 stacks, close all stacks, one at a time by clicking overlays", async (t) => {
  await initThreeStacks();
  await clickOverlay(t);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await clickOverlay(t);
  await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await clickOverlay(t);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});
