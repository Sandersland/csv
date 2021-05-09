jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue("name,age\nSteffen Andersland,29"),
  readFile: jest.fn().mockResolvedValue(() => {
    return Promise.resolve("first,last,age,email\nSteffen,Andersland,29,steffen@andersland.dev")
  })
}));

import CSVReader from '../csv/Reader';

describe("csv reader", () => {
  const reader = new CSVReader();
  
  test("Read and serializes csv data asynchronously", () => {
    const expected = [
      {
        first: "Steffen",
        last: "Andersland",
        age: "29",
        email: "steffen@andersland.dev"
      }
    ]
    reader.readFile("./test.csv").then(res => {
      expect(res).toEqual(expected);
    });
  });

  test("Read and serialized csv data synchronosly", () => {
    const expected = [
      {
        name: "Steffen Andersland",
        age: "29"
      }
    ]
    const results = reader.readFileSync("./test.csv");
    expect(results).toEqual(expected);
  });
});
