import { exists } from "./utils";

fixture`Basic Dropdown`.page`../dist/index.html`;

const id = "#basic";
const idClass = ".basic";

test("open on click menuButton", async (t) => {
  await t.click(`${idClass}-1-container button`);
  await t.expect(exists(`${id}-1-popup`)).ok();
});

test("close on click outside", async (t) => {
  await t.click(`${idClass}-1-container button`);
  await t.click(id);
  await t.expect(exists(`${id}-popup`)).notOk();
});

test("open menuButton1, then open menuButton-2, menuPopup-1 should be closed and menuPopup2 should be open", async (t) => {
  await t.click(`${idClass}-1-container button`);
  await t.expect(exists(`${id}-1-popup`)).ok();
  await t.click(`${idClass}-2-container button`);
  await t.expect(exists(`${id}-1-popup`)).notOk();
  await t.expect(exists(`${id}-2-popup`)).ok();
});

test("Basic Dropdown: open on keyboard menuButton", async (t) => {
  await t.click(`${id} h2`).pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-1-popup`)).ok();
  await t.click(`${id} h2`); // close
});

test("Basic Dropdown: remains open when tabbing around inside menuPopup", async (t) => {
  await t
    .click(`${id} h2`)
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
  await t.expect(exists(`${id}-1-popup`)).ok();
});

test("closes when tabbing outside menuPopup", async (t) => {
  await t.click(`${idClass}-1-container button`);
  await t.click(`${id}-1-popup input`).pressKey("tab");
  await t.expect(exists(`${id}-1-popup`)).notOk();
});
