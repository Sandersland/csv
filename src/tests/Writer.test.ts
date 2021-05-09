jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  writeFile: jest.fn()
}));

import CSVWriter from '../csv/Writer'; 
import fs from 'fs';

describe("csv writer", () => {
  const writer = new CSVWriter();
  const data = [
    {
      name: "Steffen Andersland",
      nickname: "Shosh"
    },
    {
      name: "Christine Vogel"
    }
  ];
  
  const expected = 'name,nickname\n"Steffen Andersland",Shosh\n"Christine Vogel",\n';

  test("write files synchronously", () => {
    writer.writeFileSync("./test.csv", data);
    expect(fs.writeFileSync).toBeCalledWith("./test.csv", expected, {encoding: "utf8"});
  });

  test("write files asynchronously", () => {
    writer.writeFile("./test.csv", data).then((result) => {
      expect(fs.writeFile).toBeCalledWith("./test.csv", {encoding: "utf8"}, expected);
    });
  });
});
