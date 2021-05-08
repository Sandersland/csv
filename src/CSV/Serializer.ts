class CSVSerializer {
    private static csvSafeDelim = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
    private static csvSafeString (column: any) {
        if (typeof column === "string" && /\s/.test(column)) return `"${column}"`;
        return column;
    }

    private static serializeRow(csvRow: string, columns: string[]) {
        const data = csvRow.split(this.csvSafeDelim);
        const row: {[key: string]: any} = {};
        for (let i = 0; i < data.length; i++) {
            row[columns[i]] = data[i].replace(/\"/g, '').trim();
        }
        return row;
    }

    static serialize(csvString: string) {
        const results = [];
        const rows = csvString.split('\n');
        const header = rows[0].split(',').map(s => s.trim());
        for (let j = 1; j < rows.length; j++) {
            const row = this.serializeRow(rows[j], header);
            results.push(row);
        }
        return results;
    }

    static deserialize(data: {[key: string]: any}[]) {
        if (!data[0]) return "";
        const head: string[] = [];
        const values = data.reduce((acc: any[], row: any, i: number) => {
            for (let name in row) {
                if (head.includes(name)) continue;
                head.push(name);
            }
            acc[i] = Object.values(row).map(this.csvSafeString);
            return acc;
        }, []);

        return [head, ...values].map(row => {
            let rowString = "";
            for (let i = 0; i < head.length; i++) {
                const value = row[i];
                if (i + 1 === head.length) {
                    rowString += value || "";
                    continue;
                } 
                rowString += value ? `${value},` : ',';
            }
            return rowString;
        }).join("\n") + "\n";
    }
}

export default CSVSerializer;
