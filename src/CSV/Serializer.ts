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
            row[columns[i]] = data[i].replace(/"/g, '""').trim();
        }
        return row;
    }

    static serialize(csvString: string) {
        const results = [];
        const rows = csvString.split('\n');
        const header = rows[0].split(',').map(s => s.trim());
        for (let i = 1; i < rows.length; i++) {
            if (!rows[i] && i + 1 === rows.length) continue; 
            const row = this.serializeRow(rows[i], header);
            results.push(row);
        }
        return results;
    }

    static deserialize(data: {[key: string]: any}[], numRows: number = 1000) {
        const head: string[] = [];
        for (let i = 0; i < numRows; i++) {
            // accumulate head based on subset of rows in data
            if (!data[i]) continue;
            for (let name in data[i]) {
                if (head.includes(name)) continue;
                head.push(name);
            }
        }

        const values = data.map((row: any) => head.map((column) => {
            return row[column] ? this.csvSafeString(row[column]): "";
        }))

        return [head, ...values].map(row => {
            let rowString = "";
            for (let i = 0; i < head.length; i++) {
                const value = row[i];
                if (i + 1 === head.length) {
                    rowString += value || "";
                    continue;
                } 
                rowString += value ? `${value|| ""},` : ',';
            }
            return rowString;
        }).join("\n") + "\n";
    }
}

export default CSVSerializer;
