import {readFileSync, readFile} from 'fs';
import CSVSerializer from './Serializer';
import {Encoding} from './index.d';

class CSVReader {

    constructor(
        private serializer = CSVSerializer
    ) {}

    private serialize(csvString: string) {
       return this.serializer.serialize(csvString); 
    }
    
    readFileSync(fp: string): {[key: string]: any}[] {
        const stringContents = readFileSync(fp, {encoding: Encoding.UTF_8});
        return this.serialize(stringContents);
    }

    readFile(fp: string): Promise<{[key: string]: any}[]> {
        return new Promise((resolve, reject) => {
            const options = {encoding: Encoding.UTF_8};
            readFile(fp, options, (err, stringContents) => {
                if (err) return reject(err);
                const data = this.serialize(stringContents);
                resolve(data);
            });
        });
    }
}

export default CSVReader;
