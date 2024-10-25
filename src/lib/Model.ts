import { z, ZodSchema } from "zod";

// Comparison operators for filters
type Op = "gt" | "gte" | "lt" | "lte" | "eq";

// Arguments for the findMany method
type FindManyArgs<Fields extends object> = {
  // Define a where object to filter the data by. Leave it undefined to select all fields.
  where?: {
    [key in keyof Fields]?: {
      [op in Op]?: Fields[key];
    };
  };
  // Define a select object that takes a subset of the Fields object. Leave it undefined to select all fields.
  select?: {
    [key in keyof Fields]?: true;
  };
  // Define a take value to limit the number of results returned. Defaults to 100.
  take?: number;
  // Define a skip value to skip a number of results. Defaults
  skip?: number;
};

// Set a default take value
const DEFAULT_TAKE = 100;

/**
 * A generic model class to handle data validation and storage
 */
export class Model<Fields extends object> {
  private Schema: ZodSchema<Fields>;
  private data: Fields[] = [];

  /**
   * @param Schema The schema to validate the data against
   */
  constructor(Schema: typeof this.Schema) {
    this.Schema = Schema;
  }

  /**
   * Validate an array of data against the model schema and return type-safe data
   * @param data The data to validate
   * @returns The validated data
   * @throws If the data does not match the schema
   */
  public validate(data: unknown[]): Fields[] {
    return z.array(this.Schema).parse(data);
  }

  /**
   * Save the data to memory. We're validating this again to ensure the data is always valid.
   * @param data Any array of data to be validated and inserted
   * @returns The validated data
   */
  public insertMany(data: Fields[]) {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array");
    }
    if (!data.length) return;
    this.data = this.validate(data);
  }

  /**
   * Find multiple items in the dataset
   * @param args The arguments to filter and projcet the data
   * @returns The filtered and projected data
   */
  public findMany<Result extends FindManyArgs<Fields>>(args?: Result) {
    // Set some core variables and defaults
    let filteredItems = [...this.data];
    const { where, select } = args ?? {};
    const skip = args?.skip ?? 0;
    const take = skip + (args?.take ?? DEFAULT_TAKE);

    // Filter data if a where is defined
    if (where) {
      // Get the keys of the where object (field names)
      const whereKeys = Object.keys(where) as (keyof Fields)[];
      if (whereKeys.length) {
        filteredItems = filteredItems.filter((item) => {
          // Make sure we're filtering by every where clause passed
          return whereKeys.every((key) => {
            const operatorKeys = Object.keys(where[key] ?? {}) as Op[];
            // Make sure we're filtering by every operator passed for this field
            return operatorKeys.every((op) => {
              const value = where[key]?.[op];
              if (!value) return;
              if (op === "gt") {
                return item[key] > value;
              } else if (op === "gte") {
                return item[key] >= value;
              } else if (op === "lt") {
                return item[key] < value;
              } else if (op === "lte") {
                return item[key] <= value;
              } else if (op === "eq") {
                return item[key] === value;
              }
            });
          });
        });
      }
    }

    if (select) {
      // Define a new variable here so we have type-safety on the return value
      const results: Pick<Fields, keyof NonNullable<Result["select"]>>[] = [];
      filteredItems.forEach((item) => {
        const newItem = {} as Fields;
        const selectKeys = Object.keys(select ?? {}) as (keyof Fields)[];
        // For each item, only project the fields we're selecting
        selectKeys.forEach((key) => {
          if (select?.[key]) {
            newItem[key] = item[key];
          }
        });
        results.push(newItem);
      });
      return results.slice(skip, take);
    }

    // Finally return the filtered data if we're not projecting
    return filteredItems.slice(skip, take);
  }
}
