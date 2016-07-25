/** Represents Query Result */
export class QueryResult<T> {
    /**
     * Array of query results.
     * @type {Array<T>}
     */
    public results: Array<T>;
    /**
     * Key to retrieve next page.
     * @type {string}
     */
    public paginationKey: string;

    /**
     * Create a QueryResult.
     * @constructor
     * @param {Array<T>} results Array of query results.
     * @param {string} paginationKey Key to retrieve next page.
     */
    constructor(
        results: Array<T>,
        paginationKey?: string) {
            this.results = results;
            this.paginationKey = paginationKey;
    }
    /**
     * Returns true if the query has more results.
     */
    get hasNext(): boolean {
        return !!this.paginationKey;
    }
}