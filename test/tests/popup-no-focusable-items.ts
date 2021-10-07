import { exists } from "./utils";

fixture`Popup no focusable items`.page`../dist/index.html`;

const id = "#popup-no-focusable-items";
const idClass = ".popup-no-focusable-items";

test("Tab to second menuButton, open popup, tab forwards. Will close popup and focus on element next to menuButton, which is the third menuButton", async (t) => {
  const thirdMenuButtonClassName = await t.eval(() => {
    const idClass = ".popup-no-focusable-items";
    return document.querySelector(`${idClass}-3-level-1-container button`)
      ?.parentElement?.className;
  });
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await t.pressKey("tab");
  await t.expect(exists(`${id}-2-level-1-popup`)).notOk();

  const activeElementClassName = (await t.eval(
    () => document.activeElement!.parentElement!.className
  )) as string;
  await t.expect(activeElementClassName).eql(thirdMenuButtonClassName);
});

test("Tab to second menuButton, open popup, tab backwards. Will close popup and focus on element previous to menuButton, which is the 1st menuButton", async (t) => {
  const thirdMenuButtonClassName = await t.eval(() => {
    const idClass = ".popup-no-focusable-items";
    return document.querySelector(`${idClass}-1-level-1-container button`)
      ?.parentElement?.className;
  });
  await t.click(`${id} h2`);
  await t.pressKey("tab").pressKey("tab").pressKey("enter");
  await t.expect(exists(`${id}-2-level-1-popup`)).ok();
  await t.pressKey("shift+tab");
  await t.expect(exists(`${id}-2-level-1-popup`)).notOk();

  const activeElementClassName = (await t.eval(
    () => document.activeElement!.parentElement!.className
  )) as string;
  await t.expect(activeElementClassName).eql(thirdMenuButtonClassName);
});
