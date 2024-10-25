import { Logging } from "./lib/Logging";
import { Parse } from "./lib/Parse";
import { thing } from "./models/Thing";

const run = () => {
  try {
    // Parse the CSV file
    const data = Parse.importFromCSVAssets("things.csv");

    // Validate the data and store it
    const validatedData = thing.validate(data);
    thing.insertMany(validatedData);

    // Query the data
    const results = thing.findMany({
      where: {
        id: {
          lte: 2,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Log the data to the console
    Logging.logToConsole(results);
  } catch (error: unknown) {
    Logging.handleUnknownError(error);
  }
};

run();
