import Table from '../csv/Table';

describe("table methods", () => {
  const data = [
    {name: "Steffen"},
    {name: "Christine"}
  ]

  const table = new Table(data);

  test("merge", () => {
    const data = [
      {name: "Steffen", age: 29}
    ]
    const table2 = new Table(data);
    const merged = table.merge(table2, "name");
    expect(merged.indexOf(0).value.age).toBe(29);
    expect(merged.indexOf(1).value.age).toBe(undefined);
  });

  test("rename", () => {
    const renamed = table.rename({name: "_name"});
    expect(renamed.columns).toEqual(["_name"]);
    expect(renamed.indexOf(0).value.name).toBe(undefined);
    expect(renamed.indexOf(0).value._name).toBe("Steffen");
  });

  test("concat", () => {
    const data = [{name: "Missy", nickname: "Bunny"}];
    const table2 = new Table(data);
    const combined = table.concat(table2);
    expect(combined.length).toBe(3);
    expect(combined.columns).toEqual(["name", "nickname"]);
    expect(combined.indexOf(2).value.name).toBe("Missy");
    expect(combined.indexOf(1).value.name).toBe("Christine");
  });

});
