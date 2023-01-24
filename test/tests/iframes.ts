import { test } from "testcafe";
import {
  clientScrollIntoView,
  exists,
  loopStacks,
  pressSequentialKeys,
} from "./utils";

fixture`iframes`.page`../dist/index.html`;
const id = "#iframes-bcl";
const idClass = ".iframes-bcl";

// AUTHOR MUST MANUALLY TEST since main page focusout bubbles when iframe is focused, when it doesn't on non-test browsers.

test("open 3 levels with keyboard", async (t) => {
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.wait(100); // to solve Firefox iframe rendering issue
  await pressSequentialKeys(t, "tab", 8).pressKey("enter");
  await t.expect(exists(`${id}-1-level-2-popup`)).ok();
  await t.wait(100); // to solve Firefox iframe rendering issue
  await pressSequentialKeys(t, "tab", 8).pressKey("enter");
  await t.expect(exists(`${id}-1-level-3-popup`)).ok();
  await t.click(`${id} h2`);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
  });
});

test("dont close when clicking menuPopup's iframe", async (t) => {
  await t.wait(100); // to solve Firefox iframe rendering issue
  await t.click(`${idClass}-1-level-1-container button`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await clientScrollIntoView(`${id}-1-level-1-popup`);
  await t
    .switchToIframe(`${id}-1-level-1-popup [data-test-iframe]`)
    .click("button[data-visible-button]");
  await t.switchToMainWindow();
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
});

test("close when clicking outside iframe", async (t) => {
  await t.wait(100); // to solve Firefox iframe rendering issue
  await t.click(`${idClass}-1-level-1-container button`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.click(`${id} .lone-iframe`);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});

test("close when clicking menuPopup iframe, then clicking outside iframe", async (t) => {
  const id = "#iframes-bcl";
  const idClass = ".iframes-bcl";

  await t.click(`${idClass}-1-level-1-container button`);
  await t.wait(100); // to solve Firefox iframe rendering issue
  await t.click(`${id}-1-level-1-popup [data-test-iframe]`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.click(`${id} .lone-iframe`);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});

test("open 2 stacks, click topmost iframe, then click outside, all stacks should close", async (t) => {
  const id = "#iframes-bcl";
  const idClass = ".iframes-bcl";

  await t.click(`${idClass}-1-level-1-container button`);
  await t.click(`${idClass}-1-level-2-container button`);
  await t.wait(100); // to solve Firefox iframe rendering issue
  await t.click(`${id}-1-level-2-popup [data-test-iframe]`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t.expect(exists(`${id}-1-level-2-popup`)).ok();
  await t.click(`${id}`);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
  await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
});

test("open 3 stacks, click topmost iframe, close all stacks by clicking one at a time by clicking decending iframes", async (t) => {
  const id = "#iframes-bcl";
  const idClass = ".iframes-bcl";

  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await t.wait(100); // to solve Firefox iframe rendering issue
  await t.click(`${id}-1-level-3-popup [data-test-iframe]`);
  // uses polling to detect iframe context, which is why we're waiting
  await t.wait(400);
  await t.click(`${id}-1-level-2-popup [data-test-iframe]`);
  await t.wait(400);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await t.click(`${id}-1-level-1-popup [data-test-iframe]`);
  await t.wait(400);
  await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
  await t.click(`${id}`);
  await t.wait(400);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
});

test("open 2 stacks, click topmost iframe, then click neighbor iframe, then click menuButton to open 3rd stack", async (t) => {
  const id = "#iframes-bcl";
  const idClass = ".iframes-bcl";

  await loopStacks(t, [1, 2], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await t.wait(100); // to solve Firefox iframe rendering issue
  // uses polling to detect iframe context, which is why we're waiting
  await t.click(`${id}-1-level-2-popup [data-test-iframe].f-1`);
  await t.wait(400);
  await t.click(`${id}-1-level-2-popup [data-test-iframe].f-2`);
  await t.wait(400);
  await t.expect(exists(`${id}-1-level-2-popup`)).ok();
  await t.click(`${idClass}-1-level-3-container button`);
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await t.click(`${id}`);
});

test("open 3 stacks, click topmost iframe, then click  stack2 menuButton close 3rd stack", async (t) => {
  const id = "#iframes-bcl";
  const idClass = ".iframes-bcl";

  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await t.wait(100); // to solve Firefox iframe rendering issue
  // uses polling to detect iframe context, which is why we're waiting
  await t.click(`${id}-1-level-3-popup [data-test-iframe].f-1`);
  await t.wait(400);
  await t.click(`${idClass}-1-level-3-container button`);
  await t.wait(400);
  await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
  });
  await t.click(`${id}`);
});
