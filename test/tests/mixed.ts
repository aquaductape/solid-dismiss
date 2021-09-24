import { t } from "testcafe";
import { clickOverlay, exists, loopStacks, pressSequentialKeys } from "./utils";

fixture`Mixed: regular, mounted, overlay, overlay-disabled`
  .page`../dist/index.html`;

const id = "#mixed";
const idClass = ".mixed";

test("open each type: regular > mounted > overlay > overlay-disabled, with click", async (t) => {
  await t.click(`${id} h2`);
  await t.click(`${id} .btn-regular`);
  await t.click(`${idClass}-level-1-popup .btn-mounted`);
  await t.click(`${idClass}-level-2-popup .btn-overlay`);
  await t.click(`${idClass}-level-3-popup .btn-overlay-d`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay-d`)).ok();
});

test("open each type: mounted > regular > overlay > overlay-disabled, with click", async (t) => {
  await t.click(`${id} h2`);
  await t.click(`${id} .btn-mounted`);
  await t.click(`${idClass}-level-1-popup .btn-regular`);
  await t.click(`${idClass}-level-2-popup .btn-overlay`);
  await t.click(`${idClass}-level-3-popup .btn-overlay-d`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay-d`)).ok();
});

test("open each type: overlay > mounted > regular > overlay-disabled, with click", async (t) => {
  await t.click(`${id} h2`);
  await t.click(`${id} .btn-overlay`);
  await t.click(`${idClass}-level-1-popup .btn-mounted`);
  await t.click(`${idClass}-level-2-popup .btn-regular`);
  await t.click(`${idClass}-level-3-popup .btn-overlay-d`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay-d`)).ok();
});

test("open each type: regular > mounted > overlay > overlay-disabled, with keyboard", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await pressSequentialKeys(t, "tab", 4).pressKey("enter");
  await pressSequentialKeys(t, "tab", 5).pressKey("enter");

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay-d`)).ok();
});
test("open each type: mounted > regular > overlay > overlay-disabled, with keyboard", async (t) => {
  await t.click(`${id} h2`);
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");
  await pressSequentialKeys(t, "tab", 4).pressKey("enter");
  await pressSequentialKeys(t, "tab", 5).pressKey("enter");

  await t.expect(exists(`${idClass}-level-1-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay-d`)).ok();
});

test("open each type: overlay > mounted > regular > overlay-disabled, with keyboard", async (t) => {
  await t.click(`${id} h2`);
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await pressSequentialKeys(t, "tab", 3).pressKey("enter");
  await pressSequentialKeys(t, "tab", 2).pressKey("enter");
  await pressSequentialKeys(t, "tab", 5).pressKey("enter");

  await t.expect(exists(`${idClass}-level-1-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay-d`)).ok();
});

test("open overlay > regular > regular, then close all by clicking overlay once", async (t) => {
  await t.click(`${id} .btn-overlay`);
  await t.click(`${idClass}-level-1-popup .btn-regular`);
  await t.click(`${idClass}-level-2-popup .btn-regular`);
  await clickOverlay(t);

  await loopStacks(t, [1, 2], async (t, lvl) => {
    await t
      .expect(
        exists(
          `${idClass}-level-${lvl}-popup${lvl === 1 ? ".popup-overlay" : ""}`
        )
      )
      .notOk();
  });
});

test("open regular > overlay > regular > overlay, then close all by clicking outside(of all stacks) twice", async (t) => {
  await t.click(`${id} .btn-regular`);
  await t.click(`${idClass}-level-1-popup .btn-overlay`);
  await t.click(`${idClass}-level-2-popup .btn-regular`);
  await t.click(`${idClass}-level-3-popup .btn-overlay`);

  await clickOverlay(t);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-overlay`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-4-popup.popup-overlay`)).notOk();

  await clickOverlay(t);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-overlay`)).notOk();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).notOk();

  await clickOverlay(t);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).notOk();
});

test("open regular > regular > overlay-d, click disabled overlay, no stacks should close", async (t) => {
  await t.click(`${id} .btn-regular`);
  await t.click(`${idClass}-level-1-popup .btn-regular`);
  await t.click(`${idClass}-level-2-popup .btn-overlay-d`);

  await clickOverlay(t);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-overlay-d`)).ok();
});
test("open regular > regular > regular, click every close button, all stacks should be closed", async (t) => {
  await t.click(`${id} .btn-regular`);
  await t.click(`${idClass}-level-1-popup .btn-regular`);
  await t.click(`${idClass}-level-2-popup .btn-regular`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();

  await t.click(`${idClass}-level-3-popup .close`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).notOk();

  await t.click(`${idClass}-level-2-popup .close`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).notOk();

  await t.click(`${idClass}-level-1-popup .close`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).notOk();
});
test("open regular > regular > regular, click top close button, top stack should close. Then click 1st stack, 2nd stack should close", async (t) => {
  await t.click(`${id} .btn-regular`);
  await t.click(`${idClass}-level-1-popup .btn-regular`);
  await t.click(`${idClass}-level-2-popup .btn-regular`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();

  await t.click(`${idClass}-level-3-popup .close`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).notOk();

  await t.click(`${idClass}-level-1-popup`, { offsetX: 10, offsetY: 10 });

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).notOk();
});
test("open regular > regular > mounted. on 2nd stack click regular. This should close stack opened from mounted, but open new stack from 2nd stack regular button", async (t) => {
  await t.click(`${id} .btn-regular`);
  await t.click(`${idClass}-level-1-popup .btn-regular`);
  await t.click(`${idClass}-level-2-popup .btn-mounted`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-mounted`)).ok();

  await t.click(`${idClass}-level-2-popup .btn-regular`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-regular`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-mounted`)).notOk();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();
});
test("open mounted > mounted > regular. on 2nd stack click mounted. This should close stack opened from regular, but open new stack from 2nd stack mounted button", async (t) => {
  await t.click(`${id} .btn-mounted`);
  await t.click(`${idClass}-level-1-popup .btn-mounted`);
  await t.click(`${idClass}-level-2-popup .btn-regular`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).ok();

  await t.click(`${idClass}-level-2-popup .btn-mounted`);

  await t.expect(exists(`${idClass}-level-1-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-2-popup.popup-mounted`)).ok();
  await t.expect(exists(`${idClass}-level-3-popup.popup-regular`)).notOk();
  await t.expect(exists(`${idClass}-level-3-popup.popup-mounted`)).ok();
});
