import { ZodError } from "zod";
import { Logging } from "./Logging";

describe("Logging", () => {
  console.table = jest.fn();
  console.error = jest.fn();

  it("should correctly log data to the console", () => {
    const data = [
      { id: "1", name: "thing1" },
      { id: "2", name: "thing2" },
    ];
    Logging.logToConsole(data);
    expect(console.table).toHaveBeenCalledWith(data);
  });

  it("should correctly log a known error to the console", () => {
    const err = new Error("Test error");
    Logging.logErrorToConsole(err);
    expect(console.error).toHaveBeenCalledWith(err);
  });

  describe("unknown errors", () => {
    it("should log an Error", () => {
      const err = new Error("Test error");
      Logging.handleUnknownError(err);
      expect(console.error).toHaveBeenCalledWith(err);
    });
    it("should log Errors", () => {
      const err = new Error("Test error");
      Logging.handleUnknownError([err]);
      expect(console.error).toHaveBeenCalledWith(err);
    });
    it("should log a ZodError", () => {
      const err = new ZodError([
        {
          message: "Invalid",
          code: "invalid_type",
          path: [0, "id"],
          expected: "string",
          received: "undefined",
        },
      ]);
      Logging.handleUnknownError(err);
      expect(console.error).toHaveBeenCalledWith(
        new Error(`Error on 0.id: Invalid`)
      );
    });
    it("should log an uncertain error", () => {
      class UncertainError {
        private name;
        private message;
        constructor(message: string) {
          this.name = "NewError";
          this.message = message;
        }
      }
      const err = new UncertainError("Uh-oh!");
      Logging.handleUnknownError(err);
      expect(console.error).toHaveBeenCalledWith(
        new Error(`An unknown error occurred`)
      );
    });
  });
});
