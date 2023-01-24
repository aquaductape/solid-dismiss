import { t } from "testcafe";
import {
  exists,
  loopStacks,
  pressSequentialKeys,
  clientScrollIntoView as clientScrollIntoView,
} from "./utils";

fixture`Modal`.page`../dist/index.html`;

const id = "#modal";
const idClass = ".modal";

const initThreeStacks = () =>
  loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });

test("open 1 level, focus should be on first child in menuPopup", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();

  await t
    .expect(
      await t.eval(() => (document.activeElement! as HTMLElement).dataset.test)
    )
    .eql("first-tabbable-item");
});

test("open 1 level, press tab 6 times to wrap focus around to the first item", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();

  await t
    .expect(
      await t.eval(() => (document.activeElement! as HTMLElement).dataset.test)
    )
    .eql("first-tabbable-item");

  await pressSequentialKeys(t, "tab", 6);

  await t
    .expect(
      await t.eval(() => (document.activeElement! as HTMLElement).dataset.test)
    )
    .eql("first-tabbable-item");
});

test("open 1 level, shift tab 1 time to wrap focus around to last item", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.pressKey("shift+tab");
  const activeElementDataAttr = (await t.eval(
    () => (document.activeElement! as HTMLElement).dataset.test
  )) as string;

  await t.expect(activeElementDataAttr).eql("close-btn");
});

test("open 1 level, click modal, then press shift tab 1 time to wrap focus around to last item", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  // scrollBy fix in Firefox, Testcafe clicks by scrolling into target automatically then click, but Firefox fails to scroll into view to modal automatically so click fails
  if (t.browser.name.toLowerCase() === "firefox") {
    await clientScrollIntoView(`${id}-1-level-1-popup`);
  }
  await t.click(`${id}-1-level-1-popup`);

  await t
    .expect(
      await t.eval(() => (document.activeElement! as HTMLElement).dataset.test)
    )
    .eql("menu-popup");

  await t.pressKey("shift+tab");

  const activeElementDataAttr = (await t.eval(
    () => (document.activeElement! as HTMLElement).dataset.test
  )) as string;

  await t.expect(activeElementDataAttr).eql("close-btn");
});

test("open 1 level, click modal overlay, since overlay click is disabled the modal shouldn't close and menuPopup should receive focus", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.pressKey("tab");
  await t.click(`.overlay[role="presentation"]`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();

  await t
    .expect(
      await t.eval(() => (document.activeElement! as HTMLElement).dataset.test)
    )
    .eql("menu-popup");
});
