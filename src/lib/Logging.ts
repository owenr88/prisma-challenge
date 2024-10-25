import { ZodError } from "zod";

/**
 * Handle logging data to the console
 */
export class Logging {
  /**
   * Log data to the console
   * @param data The data to log
   */
  static logToConsole(data: unknown[]) {
    console.table(data);
  }

  /**
   * Handle an unknown error in various formats
   * @param error The error to handle
   */
  static handleUnknownError(error: unknown | unknown[]) {
    if (error instanceof ZodError) {
      error.issues.forEach((issue) => {
        const paths = issue.path.join(".");
        Logging.logErrorToConsole(
          new Error(`Error on ${paths}: ${issue.message}`)
        );
      });
    } else if (Array.isArray(error)) {
      error.forEach((err) => {
        Logging.handleUnknownError(err);
      });
    } else {
      if (error instanceof Error) {
        Logging.logErrorToConsole(error);
      } else {
        Logging.logErrorToConsole(new Error("An unknown error occurred"));
      }
    }
  }

  /**
   * Log an error to the console
   * @param error The error to log
   */
  static logErrorToConsole(error: Error) {
    console.error(error);
  }
}
