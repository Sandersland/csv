import CSVReader from './Reader';
import CSVWriter from './Writer';
import CSVSerializer from './Serializer';
import Table from './Table';

const chunk = (array: any[], size: number) => {
    const chunked_arr = [];
    let copied = [...array];
    const numOfChild = Math.ceil(copied.length / size);
    for (let i = 0; i < numOfChild; i++) {
      chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
}

class CSV extends Table {
    private static reader: CSVReader = new CSVReader();
    private writer: CSVWriter = new CSVWriter();

    constructor(
        data: {[key: string]: any}[],
    ) {
        super(data);
    }

    private get data() {
        return this.rows.map(row => row.value);
    }

    static readFileSync(fp: string) {
        const data = this.reader.readFileSync(fp);
        return new this(data);
    }

    static async readFile(fp: string) {
        const reader = new CSVReader();
        const data = await reader.readFile(fp);
        return new this(data);
    }

    writeFileSync(fp: string) {
        this.writer.writeFileSync(fp, this.data);
    }

    async writeFile(fp: string) {
        await this.writer.writeFile(fp, this.data);
    }

    split(chunkSize: number) {
        return chunk(this.data, chunkSize).map(CSV.create);
    }

    toString() {
        return CSVSerializer.deserialize(this.data);
    }

    static create(rows: {[key: string]: any}[]) {
        return new CSV(rows);
    }
}

export default CSV;
