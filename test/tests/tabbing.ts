import { t } from "testcafe";
import { exists, loopStacks, pressSequentialKeys } from "./utils";

fixture`Tabbing Elements`.page`../dist/index.html`;

const id = "#tabbing-els";
const idClass = ".tabbing-els";

test("open 1 level with click, tab outside of mounted popup, activeElement is web-component button", async (t) => {
  await t.click(`${idClass}-1-level-1-container button`);
  await pressSequentialKeys(t, "tab", 6);
  const webComponentButtonClassName = "web-component-button";
  const webComponentButtonTagName = "WEB-COMPONENT-BUTTON";
  const activeElementClassName = (await t.eval(
    () => document.activeElement!.shadowRoot?.activeElement?.className
  )) as string;
  await t.expect(activeElementClassName).eql(webComponentButtonClassName);
});
