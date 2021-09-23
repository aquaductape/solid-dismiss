import { Selector, ClientFunction, t } from "testcafe";

fixture`Getting Started`.page`../dist/index.html`;

const exists = (selector: string) => Selector(selector).exists;
const loopStacks = (
  t: TestController,
  items: number[],
  cb: (t: TestController, number: number) => Promise<any>
) => {
  for (const num of items) {
    cb(t, num);
  }
};

const pressSequentialKeys = (
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

// test("Basic Dropdown: open on click menuButton", async (browser) => {
//   await browser.click("#basic-1-btn");
//
//   await browser.expect(exists("#basic-1-popup")).ok();
// });
//
// test("Basic Dropdown: close on click outside", async (browser) => {
//   await browser.click("#basic");
//   await browser.expect(exists("#basic-1-popup")).notOk();
// });
//
// test("Basic Dropdown: open menuButton1, then open menuButton-2, menuPopup-1 should be closed and menuPopup2 should be open", async (browser) => {
//   await browser.click("#basic-1-btn");
//   await browser.expect(exists("#basic-1-popup")).ok();
//   await browser.click("#basic-2-btn");
//   await browser.expect(exists("#basic-1-popup")).notOk();
//   await browser.expect(exists("#basic-2-popup")).ok();
// });
//
// test("Basic Dropdown: open on keyboard menuButton", async (browser) => {
//   await browser.click("#basic h2").pressKey("tab").pressKey("enter");
//   await browser.expect(exists("#basic-1-popup")).ok();
//   await browser.click("#basic h2"); // close
// });
//
// test("Basic Dropdown: remains open when tabbing inside menuPopup", async (browser) => {
//   await browser
//     .click("#basic h2")
//     .pressKey("tab")
//     .pressKey("enter") // opened menu
//     .pressKey("tab")
//     .pressKey("tab")
//     .pressKey("tab")
//     .pressKey("tab") // last item
//     .pressKey("shift+tab")
//     .pressKey("shift+tab")
//     .pressKey("shift+tab")
//     .pressKey("shift+tab") // reach last item which is menuButton(default setting for revistTabbing menuButton doesn't close menuPopup)
//     .pressKey("tab");
//   await browser.expect(exists("#basic-1-popup")).ok();
// });
//
// test("Basic Dropdown: closes when tabbing outside menuPopup", async (browser) => {
//   await browser.click("#basic-1-popup a").pressKey("tab");
//   await browser.expect(exists("#basic-1-popup")).notOk();
// });

// test("Nested Mounted Popup: open 3 levels with keyboard", async (t) => {
//   await t.click("#nested-mounted h2");
//   await t.pressKey("tab").pressKey("enter");
//   await t.expect(exists(`#nested-mounted-1-level-1-popup`)).ok();
//   await pressSequentialKeys(t, "tab", 3).pressKey("enter");
//   await t.expect(exists(`#nested-mounted-1-level-2-popup`)).ok();
//   await pressSequentialKeys(t, "tab", 3).pressKey("enter");
//   await t.expect(exists(`#nested-mounted-1-level-3-popup`)).ok();
//   await t.click("#nested-mounted h2");
// });
// //
// test("Nested Mounted Popup: 3 levels. reclick level 3 menuButton to close 3rd level", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await t.expect(exists("#nested-mounted-1-level-3-popup")).ok();
//
//   await t.click(".nested-mounted-1-level-3-container button");
//   await t.expect(exists("#nested-mounted-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok();
//   });
// });
// //
// test("Nested Mounted Popup: press escape to close 3rd level", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await t.expect(exists("#nested-mounted-1-level-3-popup")).ok();
//   await t.pressKey("esc");
//   await t.expect(exists("#nested-mounted-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok();
//   });
// });
// test("Nested Mounted Popup: close all stacks when clicked outside", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await t.click("#nested-mounted");
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).notOk();
//   });
// });
//
// test("Nested Mounted Popup: close all stacks when clicked outside sibling menuButton", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await t.click(".nested-mounted-2-level-1-container button"); // close
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).notOk;
//   });
//   await t.expect(exists("#nested-mounted-2-level-1-popup")).ok(); // outside sibling
// });
//
// test("Nested Mounted Popup: close stacks as tabbing forwards outside all 3 stacks", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await pressSequentialKeys(t, "tab", 6);
//   await t.expect(exists("#nested-mounted-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok;
//   });
//   await pressSequentialKeys(t, "tab", 2);
//   await t.expect(exists("#nested-mounted-1-level-2-popup")).notOk();
//   await t.expect(exists("#nested-mounted-1-level-1-popup")).ok();
//   await pressSequentialKeys(t, "tab", 2);
//   await t.expect(exists("#nested-mounted-1-level-1-popup")).notOk();
// });

// test("Nested Mounted Popup: close stacks as tabbing backwards outside all 3 stacks", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-2-level-${num}-container button`);
//   });
//   await t.pressKey("shift+tab");
//   await t.expect(exists("#nested-mounted-2-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-2-level-${num}-popup`)).ok;
//   });
//   await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
//   await t.expect(exists("#nested-mounted-2-level-2-popup")).notOk();
//   await t.expect(exists("#nested-mounted-2-level-1-popup")).ok();
//   await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
//   await t.expect(exists("#nested-mounted-2-level-1-popup")).notOk();
//   // shift tab to correct previous tabblable item
//   await t.pressKey("enter");
//
//   await t.expect(exists("#nested-mounted-1-level-1-popup")).ok();
// });

// test("Nested Mounted Popup: close all 3 stacks when tabbing from last nested tabbable items", async (t) => {
//   await t.click(`.nested-mounted-1-level-1-container button`);
//   await loopStacks(t, [2, 3], async (t, num) => {
//     await t.click(
//       `.nested-mounted-1-level-${num}-container:nth-child(3) button`
//     );
//   });
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok();
//   });
//   await pressSequentialKeys(t, "tab", 6);
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).notOk();
//   });
//   await t.pressKey("enter");
//   await t.expect(exists(`#nested-mounted-2-level-1-popup`)).ok();
//   await t.click("#nested-mounted h2");
// });

// test("Nested Regular Popup: open 3 levels with keyboard", async (t) => {
//   await t.click("#nested-regular h2");
//   await t.pressKey("tab").pressKey("enter");
//   await t.expect(exists(`#nested-regular-1-level-1-popup`)).ok();
//   await pressSequentialKeys(t, "tab", 3).pressKey("enter");
//   await t.expect(exists(`#nested-regular-1-level-2-popup`)).ok();
//   await pressSequentialKeys(t, "tab", 3).pressKey("enter");
//   await t.expect(exists(`#nested-regular-1-level-3-popup`)).ok();
//   await t.click("#nested-regular h2");
// });
//
// test("Nested Regular Popup: 3 levels. reclick level 3 menuButton to close 3rd level", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-regular-1-level-${num}-container button`);
//   });
//   await t.expect(exists("#nested-regular-1-level-3-popup")).ok();
//
//   await t.click(".nested-regular-1-level-3-container button");
//   await t.expect(exists("#nested-regular-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).ok();
//   });
//   await t.click("#nested-regular");
// });
//
// test("Nested Regular Popup: press escape to close 3rd level", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-regular-1-level-${num}-container button`);
//   });
//   await t.expect(exists("#nested-regular-1-level-3-popup")).ok();
//   await t.pressKey("esc");
//   await t.expect(exists("#nested-regular-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).ok();
//   });
// });
//
// test("Nested Regular Popup: close all stacks when clicked outside", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-regular-1-level-${num}-container button`);
//   });
//   await t.click("#nested-regular");
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).notOk();
//   });
// });
//
// test("Nested Regular Popup: close all stacks when clicked outside sibling menuButton", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-regular-1-level-${num}-container button`);
//   });
//   await t.click(".nested-regular-2-level-1-container button"); // close
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).notOk;
//   });
//   await t.expect(exists("#nested-regular-2-level-1-popup")).ok(); // outside sibling
// });
//
// test("Nested Regular Popup: close all 3 stacks when tabbing from last nested tabbable items", async (t) => {
//   await t.click(`.nested-regular-1-level-1-container button`);
//   await loopStacks(t, [2, 3], async (t, num) => {
//     await t.click(
//       `.nested-regular-1-level-${num}-container:nth-child(3) button`
//     );
//   });
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).ok();
//   });
//   await pressSequentialKeys(t, "tab", 6);
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).notOk();
//   });
//
//   // correct next tabbable sibling
//   await t.pressKey("enter");
//   await t.expect(exists(`#nested-regular-2-level-1-popup`)).ok();
//   await t.click("#nested-regular h2");
// });

// test("Nested Regular Popup: close stacks as tabbing forwards outside all 3 stacks", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-regular-1-level-${num}-container button`);
//   });
//   await pressSequentialKeys(t, "tab", 6);
//   await t.expect(exists("#nested-regular-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-regular-1-level-${num}-popup`)).ok;
//   });
//   await pressSequentialKeys(t, "tab", 2);
//   await t.expect(exists("#nested-regular-1-level-2-popup")).notOk();
//   await t.expect(exists("#nested-regular-1-level-1-popup")).ok();
//   await pressSequentialKeys(t, "tab", 2);
//   await t.expect(exists("#nested-regular-1-level-1-popup")).notOk();
// });
//
// test("Nested Regular Popup: close stacks as tabbing backwards outside all 3 stacks", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-regular-2-level-${num}-container button`);
//   });
//   await t.pressKey("shift+tab");
//   await t.expect(exists("#nested-regular-2-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-regular-2-level-${num}-popup`)).ok;
//   });
//   await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
//   await t.expect(exists("#nested-regular-2-level-2-popup")).notOk();
//   await t.expect(exists("#nested-regular-2-level-1-popup")).ok();
//   await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
//   await t.expect(exists("#nested-regular-2-level-1-popup")).notOk();
//   // shift tab to correct previous tabblable item
//   await t.pressKey("enter");
//   await t.expect(exists("#nested-regular-1-level-1-popup")).ok();
//   await t.click("#nested-regular h2");
// });
//

// test("Iframes With Body Click Listener: open 3 levels with keyboard", async (t) => {
//   const id = "#iframes-bcl";
//
//   await t.click(`${id} h2`);
//   await t.pressKey("tab").pressKey("enter");
//   await t.expect(exists(`${id}-1-level-1-popup`)).ok();
//   await pressSequentialKeys(t, "tab", 8).pressKey("enter");
//   await t.expect(exists(`${id}-1-level-2-popup`)).ok();
//   await pressSequentialKeys(t, "tab", 8).pressKey("enter");
//   await t.expect(exists(`${id}-1-level-3-popup`)).ok();
//   await t.click(`${id} h2`);
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`${id}-1-level-${num}-popup`)).notOk();
//   });
// });
// test("Iframes With Body Click Listener: close when clicking outside iframe", async (t) => {
//   const id = "#iframes-bcl";
//   const idClass = ".iframes-bcl";
//
//   await t.click(`${idClass}-1-level-1-container button`);
//   await t.expect(exists(`${id}-1-level-1-popup`)).ok();
//   await t.click(`${id} .lone-iframe`);
//   await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
// });

// test("Iframes With Body Click Listener: close when clicking menuPopup iframe, then clicking outside iframe", async (t) => {
//   const id = "#iframes-bcl";
//   const idClass = ".iframes-bcl";
//
//   await t.click(`${idClass}-1-level-1-container button`);
//   await t.click(`${id}-1-level-1-popup iframe`);
//   await t.expect(exists(`${id}-1-level-1-popup`)).ok();
//   await t.click(`${id} .lone-iframe`);
//   await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
// });

// test("Iframes With Body Click Listener: open 2 stacks, click topmost iframe, then click outside, all stacks should close", async (t) => {
//   const id = "#iframes-bcl";
//   const idClass = ".iframes-bcl";
//
//   await t.click(`${idClass}-1-level-1-container button`);
//   await t.click(`${idClass}-1-level-2-container button`);
//   await t.click(`${id}-1-level-2-popup iframe`);
//   await t.expect(exists(`${id}-1-level-1-popup`)).ok();
//   await t.expect(exists(`${id}-1-level-2-popup`)).ok();
//   await t.click(`${id}`);
//   await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
//   await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
// });

// test("Iframes With Body Click Listener: open 3 stacks, click topmost iframe, close all stacks by clicking one at a time by clicking decending iframes", async (t) => {
//   const id = "#iframes-bcl";
//   const idClass = ".iframes-bcl";
//
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`${idClass}-1-level-${num}-container button`);
//   });
//   // uses polling to detect iframe context, which is why we're waiting
//   await t.click(`${id}-1-level-3-popup iframe`);
//   await t.wait(400);
//   await t.click(`${id}-1-level-2-popup iframe`);
//   await t.wait(400);
//   await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
//   await t.click(`${id}-1-level-1-popup iframe`);
//   await t.wait(400);
//   await t.expect(exists(`${id}-1-level-2-popup`)).notOk();
//   await t.click(`${id}`);
//   await t.wait(400);
//   await t.expect(exists(`${id}-1-level-1-popup`)).notOk();
// });

// test("Iframes With Body Click Listener: open 2 stacks, click topmost iframe, then click neighbor iframe, then click menuButton to open 3rd stack", async (t) => {
//   const id = "#iframes-bcl";
//   const idClass = ".iframes-bcl";
//
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.click(`${idClass}-1-level-${num}-container button`);
//   });
//   // uses polling to detect iframe context, which is why we're waiting
//   await t.click(`${id}-1-level-2-popup iframe.f-1`);
//   await t.wait(400);
//   await t.click(`${id}-1-level-2-popup iframe.f-2`);
//   await t.wait(400);
//   await t.expect(exists(`${id}-1-level-2-popup`)).ok();
//   await t.click(`${idClass}-1-level-3-container button`);
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
//   });
//   await t.click(`${id}`);
// });

// test("Iframes With Body Click Listener: open 3 stacks, click topmost iframe, then click  stack2 menuButton close 3rd stack", async (t) => {
//   const id = "#iframes-bcl";
//   const idClass = ".iframes-bcl";
//
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`${idClass}-1-level-${num}-container button`);
//   });
//   // uses polling to detect iframe context, which is why we're waiting
//   await t.click(`${id}-1-level-3-popup iframe.f-1`);
//   await t.wait(400);
//   await t.click(`${idClass}-1-level-3-container button`);
//   await t.wait(400);
//   await t.expect(exists(`${id}-1-level-3-popup`)).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`${id}-1-level-${num}-popup`)).ok();
//   });
//   await t.click(`${id}`);
// });

// test("Nested Overlay Popup: open 3 stacks, close one stack by clicking overlay", async (t) => {
//   const id = "#nested-overlay";
//   const idClass = ".nested-overlay";
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`${idClass}-1-level-${num}-container button`);
//   });
//   await t.click(Selector(id, { timeout: 50 }));
//   await t.expect(exists(`#nested-mounted-1-level-3-popup`)).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok();
//   });
// });

test("Nested Overlay Popup: open 3 stacks, close one stack by clicking overlay", async (t) => {
  const id = "#nested-overlay";
  const idClass = ".nested-overlay";
  await loopStacks(t, [1, 2, 3], async (t, num) => {
    await t.click(`${idClass}-1-level-${num}-container button`);
  });
  await t.click(Selector(id, { timeout: 50 }));
  await t.expect(exists(`#nested-mounted-1-level-3-popup`)).notOk();
  await loopStacks(t, [1, 2], async (t, num) => {
    await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok();
  });
});
//
// test("Nested Mounted Popup: close all stacks when clicked outside sibling menuButton", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await t.click(".nested-mounted-2-level-1-container button"); // close
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).notOk;
//   });
//   await t.expect(exists("#nested-mounted-2-level-1-popup")).ok(); // outside sibling
// });
//
// test("Nested Mounted Popup: close stacks as tabbing forwards outside all 3 stacks", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-1-level-${num}-container button`);
//   });
//   await pressSequentialKeys(t, "tab", 6);
//   await t.expect(exists("#nested-mounted-1-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok;
//   });
//   await pressSequentialKeys(t, "tab", 2);
//   await t.expect(exists("#nested-mounted-1-level-2-popup")).notOk();
//   await t.expect(exists("#nested-mounted-1-level-1-popup")).ok();
//   await pressSequentialKeys(t, "tab", 2);
//   await t.expect(exists("#nested-mounted-1-level-1-popup")).notOk();
// });

// test("Nested Mounted Popup: close stacks as tabbing backwards outside all 3 stacks", async (t) => {
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.click(`.nested-mounted-2-level-${num}-container button`);
//   });
//   await t.pressKey("shift+tab");
//   await t.expect(exists("#nested-mounted-2-level-3-popup")).notOk();
//   await loopStacks(t, [1, 2], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-2-level-${num}-popup`)).ok;
//   });
//   await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
//   await t.expect(exists("#nested-mounted-2-level-2-popup")).notOk();
//   await t.expect(exists("#nested-mounted-2-level-1-popup")).ok();
//   await pressSequentialKeys(t, "shift+tab", 3); // including menuButton itself
//   await t.expect(exists("#nested-mounted-2-level-1-popup")).notOk();
//   // shift tab to correct previous tabblable item
//   await t.pressKey("enter");
//
//   await t.expect(exists("#nested-mounted-1-level-1-popup")).ok();
// });

// test("Nested Mounted Popup: close all 3 stacks when tabbing from last nested tabbable items", async (t) => {
//   await t.click(`.nested-mounted-1-level-1-container button`);
//   await loopStacks(t, [2, 3], async (t, num) => {
//     await t.click(
//       `.nested-mounted-1-level-${num}-container:nth-child(3) button`
//     );
//   });
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).ok();
//   });
//   await pressSequentialKeys(t, "tab", 6);
//   await loopStacks(t, [1, 2, 3], async (t, num) => {
//     await t.expect(exists(`#nested-mounted-1-level-${num}-popup`)).notOk();
//   });
//   await t.pressKey("enter");
//   await t.expect(exists(`#nested-mounted-2-level-1-popup`)).ok();
//   await t.click("#nested-mounted h2");
// });
