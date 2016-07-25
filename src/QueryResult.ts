/**
 * Represents Query Result
 * @prop {Array<T>} results Array of query results.
 * @prop {string} paginationKey Key to retrieve next page.
 */
export class QueryResult<T> {
    public results: Array<T>;
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