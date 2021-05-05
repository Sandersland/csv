import {writeFileSync, writeFile} from 'fs';
import CSVSerializer from './Serializer';
import {Encoding} from './index.d';

class CSVWriter {
    constructor(
        private serializer = CSVSerializer
    ) {}

    writeFileSync(fp: string, data: {[key: string]: any}[]): void {
        const csvString = this.serializer.deserialize(data);
        writeFileSync(fp, csvString, {encoding: Encoding.UTF_8});
    }

    writeFile(fp: string, data: {[key: string]: any}[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const csvString = this.serializer.deserialize(data);
            const options = {encoding: Encoding.UTF_8};
            writeFile(fp, csvString, options, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

export default CSVWriter;
