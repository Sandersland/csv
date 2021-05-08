import CSV from '../csv';

test("csv constructor supports array of objects", () => {
  const data = [
    {name: "Steffen"}
  ];
  const csv = new CSV(data);
  expect(csv).toBeInstanceOf(CSV);
  expect(csv.length).toBe(1);
  expect(csv.columns).toEqual(["name"]);
});
