class CSVSerializer {
    private static csvSafeDelim = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
    private static csvSafeString (column: any) {
        return typeof column === "string" ? `"${column}"` : column;
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
        const head = Object.keys(data[0]);
        const values = data.reduce((acc: any[], row: any, i: number) => {
            acc[i] = Object.values(row).map(this.csvSafeString);
            return acc;
        }, []);
        const rows = [head, ...values];
        return rows.map(row => row.join(",")).join("\n") + "\n";
    }
}

export default CSVSerializer;
