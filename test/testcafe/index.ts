import { Selector } from "testcafe";

fixture`Getting Started`.page`../dist/index.html`;

const exists = (selector: string) => Selector(selector).exists;

test("Basic Dropdown: open on click menuButton", async (browser) => {
  await browser.click("#basic-1-button");

  await browser.expect(exists("#basic-1-popup")).ok();
});

test("Basic Dropdown: close on click outside", async (browser) => {
  await browser.click("#basic");
  await browser.expect(exists("#basic-1-popup")).notOk();
});

test("Basic Dropdown: open on keyboard menuButton", async (browser) => {
  await browser.click("#basic h2").pressKey("tab").pressKey("enter");
  await browser.expect(exists("#basic-1-popup")).ok();
  await browser.click("#basic h2"); // close
});

test("Basic Dropdown: remains open when tabbing inside menuPopup", async (browser) => {
  await browser
    .click("#basic h2")
    .pressKey("tab")
    .pressKey("enter") // opened menu
    .pressKey("tab")
    .pressKey("tab")
    .pressKey("tab")
    .pressKey("tab") // last item
    .pressKey("shift+tab")
    .pressKey("shift+tab")
    .pressKey("shift+tab")
    .pressKey("shift+tab") // reach last item which is menuButton(default setting for revistTabbing menuButton doesn't close menuPopup)
    .pressKey("tab");
  await browser.expect(exists("#basic-1-popup")).ok();
});

test("Basic Dropdown: closes when tabbing outside menuPopup", async (browser) => {
  await browser.click("#basic-1-popup a").pressKey("tab");
  await browser.expect(exists("#basic-1-popup")).notOk();
});
