import fs from "fs";
import Papa from "papaparse";
import path from "path";

/**
 * Handle data parsing from CSV
 */
export class Parse {
  /**
   * Import data from a CSV file
   * @param filePth The path of the file to import
   * @returns The parsed CSV data
   */
  static importFromCSV = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }
    const csv = fs.readFileSync(filePath, "utf8");
    return Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
  };

  /**
   * Import data from a CSV file in the assets folder
   * @param fileName The name of the file to import
   * @returns The parsed CSV data
   */
  static importFromCSVAssets = (fileName: string) => {
    const filePath = path.join(process.cwd(), "assets", fileName);
    return Parse.importFromCSV(filePath);
  };
}
