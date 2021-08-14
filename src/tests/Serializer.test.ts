import CSVSerializer from '../csv/Serializer';

describe("serializer methods", () => {
    test("serialize method returns a correctly serialized array of objects", () => {
        const csvString = "name,age\nSteffen Andersland,29\n";
        const results = CSVSerializer.serialize(csvString);
        const expected = [
            {
                name: "Steffen Andersland",
                age: "29"
            }
        ]
        expect(results).toEqual(expected);
    });

    test ("serialze method properly serializes strings that include quotes", () => {
        const csvString = `name,age,quote\nSteffen Andersland,29,"Make thing do"\n`;
        const results = CSVSerializer.serialize(csvString);
        const expected = [
            {
                name: "Steffen Andersland",
                age: "29",
                quote: `"\"Make thing do\""`
            }
        ]
        expect(results).toEqual(expected);
    });

    test("deserialize returns a correctly formated csv string", () => {
        const data = [{
            name: "Steffen Andersland",
            age: 29
        }];

        const results = CSVSerializer.deserialize(data);
        expect(results).toBe("name,age\n\"Steffen Andersland\",29\n");
    });
});
