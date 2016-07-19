/** Represent Query Result */
export class QueryResult<T> {
    constructor(
        public results: Array<T>,
        public paginationKey?: string) {
    }
    get hasNext(): boolean {
        return !!this.paginationKey;
    }
}