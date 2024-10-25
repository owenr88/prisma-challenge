import { z, ZodError } from "zod";
import { Model } from "./Model";

const Schema = z.object({
  id: z.number(),
  name: z.string(),
});

type Field = z.infer<typeof Schema>;

describe("Model", () => {
  const validData: Field[] = [
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
  ];
  const invalidData = [
    { id: 1 },
    { name: "test" },
    { id: "1", name: "test" },
    { id: 1, name: 1 },
  ];

  it("can initialise as a new model", () => {
    expect(() => new Model<Field>(Schema)).not.toThrow();
  });

  it("can validate data", () => {
    const model = new Model<Field>(Schema);
    expect(model.validate(validData)).toStrictEqual(validData);
    expect(() => model.validate(invalidData)).toThrow(ZodError);
  });

  it("can insert valid data into the model", () => {
    const model = new Model<Field>(Schema);
    model.insertMany(validData);
    // @ts-expect-error private method being accessed for testing
    expect(model.data).toStrictEqual(validData);
  });

  describe("findMany", () => {
    const model = new Model<Field>(Schema);
    beforeAll(() => {
      // Insert data to query
      model.insertMany(validData);
    });

    it("should return all data unconditionally", () => {
      expect(model.findMany()).toStrictEqual(validData);
    });
    it("should return data with all operators", () => {
      expect(
        model.findMany({
          where: {
            id: {
              eq: 1,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id === 1));
      expect(
        model.findMany({
          where: {
            id: {
              gt: 1,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id > 1));
      expect(
        model.findMany({
          where: {
            id: {
              lt: 2,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id < 2));
      expect(
        model.findMany({
          where: {
            id: {
              gte: 2,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id >= 2));
      expect(
        model.findMany({
          where: {
            id: {
              lte: 2,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id <= 2));
      expect(
        model.findMany({
          where: {
            id: {
              lte: 2,
              gte: 2,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id == 2));
      expect(
        model.findMany({
          where: {
            id: {
              gte: 10,
            },
          },
        })
      ).toStrictEqual([]);
    });
    it("should return data with string operators", () => {
      expect(
        model.findMany({
          where: {
            name: {
              eq: "test2",
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.name === "test2"));
    });
    it("should return data with number operators", () => {
      expect(
        model.findMany({
          where: {
            id: {
              eq: 1,
            },
          },
        })
      ).toStrictEqual(validData.filter((d) => d.id === 1));
    });
    it("should project data fields", () => {
      expect(
        model.findMany({
          select: {
            id: true,
          },
        })
      ).toStrictEqual(validData.map((d) => ({ id: d.id })));
    });
    it("should limit the number of results", () => {
      expect(
        model.findMany({
          take: 1,
        })
      ).toStrictEqual([validData[0]]);
    });
    it("should offset a number of results", () => {
      expect(
        model.findMany({
          skip: 1,
        })
      ).toStrictEqual([validData[1], validData[2]]);
    });
    it("should limit and offset a number of results", () => {
      expect(
        model.findMany({
          take: 1,
          skip: 1,
        })
      ).toStrictEqual([validData[1]]);
    });
    it("should use all args in tandem", () => {
      expect(
        model.findMany({
          select: {
            name: true,
          },
          where: {
            id: {
              gt: 1,
            },
          },
          take: 1,
          skip: 1,
        })
      ).toStrictEqual([{ name: "test3" }]);
    });
  });
});
