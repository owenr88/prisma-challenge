import fs from "fs";
import path from "path";
import { Parse } from "./Parse";

describe("Parse", () => {
  const csv = "id,name\n1,thing1";
  const filePath = path.join(__dirname, "test.csv");

  beforeAll(() => {
    // Create a CSV file
    fs.writeFileSync(filePath, csv, "utf8");
  });

  afterAll(() => {
    // Delete the CSV file
    fs.unlinkSync(filePath);
  });

  it("should correctly import from CSV", () => {
    const data = Parse.importFromCSV(filePath);
    expect(data).toBeDefined();
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({ id: "1", name: "thing1" });
  });

  it("should correctly import from CSV assets", () => {
    // Create an assets file
    const assetsPath = path.join(__dirname, "..", "..", "assets", "test.csv");
    fs.writeFileSync(assetsPath, csv, "utf8");
    // Do the test
    const data = Parse.importFromCSVAssets("test.csv");
    expect(data).toBeDefined();
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({ id: "1", name: "thing1" });
    // Delete the assets file
    fs.unlinkSync(assetsPath);
  });

  it("should error if the file doesn't exist", () => {
    expect(() => Parse.importFromCSV("dummy.csv")).toThrow(Error);
  });

  it("should return no data if there is no data in the file", () => {
    // Empty the file
    fs.writeFileSync(filePath, "", "utf8");
    // Do the test
    const data = Parse.importFromCSV(filePath);
    expect(data).toHaveLength(0);
    // Restore the file
    fs.writeFileSync(filePath, csv, "utf8");
  });
});
