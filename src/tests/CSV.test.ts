jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue("name,age\nSteffen Andersland,29"),
  readFile: jest.fn().mockResolvedValue(() => {
    return Promise.resolve("first,last,age,email\nSteffen,Andersland,29,steffen@andersland.dev")
  })
}));

import CSV from '../csv';

describe("constructors", () => {
  test("csv constructor supports array of objects", () => {
    const data = [
      {name: "Steffen"},
      {name: "Christine"}
    ];
    const csv = new CSV(data);
    expect(csv).toBeInstanceOf(CSV);
    expect(csv.length).toBe(2);
    expect(csv.columns).toEqual(["name"]);
    expect(csv.indexOf(1).value.name).toEqual("Christine");
  });

  test("static csv.fromString supports a csvString", () => {
    const csvString = "name,email\nSteffen Andersland, steffen@andersland.dev";
    const csv = CSV.fromString(csvString);
    expect(csv).toBeInstanceOf(CSV);
    expect(csv.length).toBe(1);
    expect(csv.columns).toEqual(["name", "email"]);
  });
  
  test("csv.readFileSync supports reading csv files synchronously", () => {
    const csv = CSV.readFileSync("./test.csv");
    expect(csv).toBeInstanceOf(CSV);
    expect(csv.length).toBe(1);
    expect(csv.columns).toEqual(["name", "age"]);
    expect(csv.indexOf(0).value.name).toEqual("Steffen Andersland")
  });

  test("csv.readFile supports reading csv files asynchronously", () => {
    CSV.readFile("./test.csv").then(csv => {
      expect(csv).toBeInstanceOf(CSV);
      expect(csv.length).toBe(1);
      expect(csv.columns).toEqual(["first", "last", "age", "email"]);
      expect(csv.indexOf(0).value.first).toEqual("Steffen");
    });
  })
})

describe("accessors", () => {
  const data = [
    {name: "Steffen Andersland"},
    {name: "Christine Vogel", age: 30}
  ]
  const csv = new CSV(data);

  test("csv indexOf has value", () => {
    expect(csv.indexOf(0).value.name).toBe("Steffen Andersland");
    expect(csv.indexOf(1).value.name).toBe("Christine Vogel");
  });

  test("csv", () => {
    const filtered = csv.valueOf("age", 30);
    expect(filtered).toBeInstanceOf(CSV);
    expect(filtered.length).toBe(1);
    expect(filtered.indexOf(0).value.name).toBe("Christine Vogel");
  });
  
})