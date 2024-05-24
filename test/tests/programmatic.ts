import { exists } from "./utils";

fixture`Programmatic`.page`../dist/index.html`;

const id = "#programmatic-modal";
const idClass = ".programmatic-modal";
test("Modal (overlay) closing, along with focusing outside page link, will close stack and keep focus", async (t) => {
  const linkId = await t.eval(
    () => document.getElementById("programmatic-some-link")!.id
  );
  await t.click(`${idClass}-1-level-1-container button`);
  await t.expect(exists(`${id}-1-level-1-popup`)).ok();
  await t
    .wait(100)
    .expect(await t.eval(() => document.activeElement?.textContent))
    .eql("Save");
  await t.wait(1500);
  await t.expect(exists(`${id}-1-level-1-popup`)).notOk();

  const activeElementId = (await t.eval(
    () => document.activeElement!.id
  )) as string;
  await t.expect(activeElementId).eql(linkId);
});

const idMounted = "#programmatic-mounted";
const idMountedClass = ".programmatic-mounted";
test("Mounted closing, along with focusing outside page link, will close stack and keep focus", async (t) => {
  const linkId = await t.eval(
    () => document.getElementById("programmatic-some-link")!.id
  );
  await t.click(`${idMountedClass}-2-level-1-container button`);
  await t.expect(exists(`${idMounted}-2-level-1-popup`)).ok();
  await t
    .wait(100)
    .expect(await t.eval(() => document.activeElement?.textContent))
    .eql("Save");
  await t.wait(1500);
  await t.expect(exists(`${idMounted}-2-level-1-popup`)).notOk();

  const activeElementId = (await t.eval(
    () => document.activeElement!.id
  )) as string;
  await t.expect(activeElementId).eql(linkId);
});
