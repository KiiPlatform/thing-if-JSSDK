/** Represent Query Result */
export class QueryResult<T> {
    public results: Array<T>;
    public paginationKey: string;
    constructor(results: Array<T>, paginationKey?: string) {
        this.results = results;
        this.paginationKey = paginationKey;
    }
    get hasNext(): boolean {
        return !!this.paginationKey;
    }
}