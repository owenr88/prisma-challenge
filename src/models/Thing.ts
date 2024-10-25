import { z } from "zod";
import { Model } from "../lib/Model";

export const ThingSchema = z.object({
  id: z.coerce.number(), // Convert the ID string to a number
  name: z.string(),
  description: z.string(),
});

export type Thing = z.infer<typeof ThingSchema>;
export type Things = Thing[];

export const thing = new Model<Thing>(ThingSchema);
