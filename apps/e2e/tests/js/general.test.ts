import { it } from "../helpers";
import { scaffoldProject } from "./js-helpers";

it("should scaffold the project", async ({ expect }) => {
  const { project } = await scaffoldProject();
  expect(project).toMatchInlineSnapshot();
});
