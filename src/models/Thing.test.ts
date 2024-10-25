import { Model } from "../lib/Model";
import { thing } from "./Thing";

describe("Thing", () => {
  it("should initialise correctly", () => {
    expect(thing).toBeInstanceOf(Model);
  });
});
