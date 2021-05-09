interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}

interface IteratorResult<T> {
    done: boolean;
    value: T | null;
}

export class Row {
    constructor (private data: {[key: string]: any}) {}

    set columns(names) {
        const row: {[key: string]: any} = {};
        for (let i = 0; i < names.length; i++) {
            if (!this.columns.includes(names[i])) return;
            row[names[i]] = this.data[names[i]];
        }
        this.data = row;
    }

    get columns() {
        return Object.keys(this.data);
    }

    get value() {
        return this.data;
    }

    get isEmpty() {
        for (let i = 0; i < this.columns.length; i++) {
            if (this.data[this.columns[i]]) return false;
        }
        return true;
    }
}

enum Join {
    LEFT = "left",
    RIGHT = "right",
    OUTER = "outer"
}

interface ITableMerger<T extends Table> {
    left: T;
    right: T;
    merge(leftOn: string, rightOn:string, join: Join): T;
}

class TableMerger<T extends Table> implements ITableMerger<T> {
    constructor(public left: T, public right: T) {}

    merge(leftOn: string, rightOn: string, join: Join = Join.LEFT) {
        // TODO: determine if there are any rows where the leftOn or the rightOn have duplicate values
        // TODO: sort out what the join method based on join arg
        const constructor = Object.getPrototypeOf(this.left).constructor;
        const rows = this.left.map((row) => {
            const value: {[key: string]: any} = {};
            const right = this.right.valueOf(rightOn, row[leftOn]).indexOf(0);
            if (!right) return row;
            for (let key in right.value) {
                if (row[key]) continue;
                value[key] = right.value[key];
            }
            return {...row, ...value};
        });
        return new constructor(rows);
    }

}

class Table implements Iterator<Row> {
    protected rows: Row[];
    protected _columns: string[];
    private pointer = 0;

    constructor(data: ({[key: string]: any}[] | Row[])) {
        this.rows = [];
        this._columns = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i] instanceof Row ? data[i] as Row : new Row(data[i]); 
            for (let j = 0; j < row.columns.length; j++) {
                if (this._columns.includes(row.columns[j])) continue;
                this._columns.push(row.columns[j]);
            }
            this.rows.push(row);
        }
    }

    get columns() {
        return this._columns;
    }

    set columns(names: string[]) {
        for (let i = 0; i < this.rows.length; i++) {
            this.rows[i].columns = names;
        }
        this._columns = names;
    }
    
    get length() {
        return this.rows.length
    };

    private resetPointer() {
        this.pointer = 0;
    }

    public next(): IteratorResult<Row> {
        if (this.pointer < this.rows.length) {
            return {
                done: false,
                value: this.rows[this.pointer++]
            }
        } else {
            return {
                done: true,
                value: null
            }
        }
    }

    [Symbol.iterator](): Iterator<Row> {
        return this;
    }

    indexOf(index: number) {
        return this.rows[index];
    }

    valueOf(column: string, value: any) {
        const constructor = Object.getPrototypeOf(this).constructor;
        const rows = this.rows.filter(row => {
            return row.value[column] == value;
        });
        return new constructor(rows);
    }
    
    forEach(callback: (data: {[key: string]: any}, index: number) => void): void {
        this.resetPointer();
        let i = 0;
        for (let row of this) {
            if (!row || row.isEmpty) break;
            callback(row.value, i);
            i++;
        }
    }

    map(callback: (data: {[key: string]: any}, index: number) => any): any[] {
        this.resetPointer();
        let i = 0;
        const results = [];
        for (let row of this) {
            if (!row || row.isEmpty) break;
            const result = callback(row.value, i);
            if (result !== undefined) {
                results.push(result);
            }
            i++;
        }
        return results;
    }

    reduce(callback: (accumulator: any, currentValue: {[key: string]: any}, index: number) => any, initialValue: any): any {
        this.resetPointer();
        let i = 0;
        let result = initialValue;
        for (let row of this) {
            if (!row || row.isEmpty) break;
            result = callback(result, row.value, i);
            i++
        }
        return result;
    }

    concat<T extends Table>(other: T) {
        const constructor = Object.getPrototypeOf(this).constructor;
        const rows = this.rows.concat(other.rows);
        return new constructor(rows);
    }

    merge<T extends Table>(other: T, leftOn: string, rightOn: string = leftOn) {
        const merger = new TableMerger<Table>(this, other);
        return merger.merge(leftOn, rightOn, Join.LEFT);
    }
}

export default Table;
