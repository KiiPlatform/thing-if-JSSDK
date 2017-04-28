/**
 * Base QueryClause implementation.
 */
export class QueryClause {}
/**
 * Represents equals clause when query history states.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class EqualsClauseInQuery extends QueryClause {
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a equals clause.
     * @constructor
     * @param {string} field Field name of comparison.
     * @param {string} value Value to be compared.
     */
    constructor(
        field: string,
        value: string|number|boolean
    ) {
        super();
        this.field = field;
        this.value = value;
    }
}
/**
 * Represents not equals clause when query history states.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class NotEqualsClauseInQuery extends QueryClause {
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a not equals clause.
     * @constructor
     * @param {string} field Field name of comparison.
     * @param {string} value Value to be compared.
     */
    constructor(
        field: string,
        value: string|number|boolean
    ) {
        super();
        this.field = field;
        this.value = value;
    }
}
/**
 * Represents the And clause when query history states.
 * @prop {QueryClause[]} clauses Clauses to be concatenated with and clause.
 */
export class AndClauseInQuery extends QueryClause {
    public clauses: QueryClause[];

    /**
     * Create a AND operator.
     * @constructor
     * @param {QueryClause[]} clauses Array of clauses to be concatenated with And clause.
     */
    constructor(...clauses: QueryClause[]) {
        super();
        this.clauses = clauses;
    }
}
/**
 * Represents the OR clause when query history states.
 * @prop {QueryClause[]} clauses Clauses to be concatenated with Or clause.
 */
export class OrClauseInQuery extends QueryClause {
    public clauses: QueryClause[];

    /**
     * Create a OR operator.
     * @constructor
     * @param {QueryClause[]} clauses Array of clauses to be concatenated with Or clause.
     */
    constructor(...clauses: QueryClause[]) {
        super();
        this.clauses = clauses;
    }
}
/**
 * Represents the clause of range clause when query history states.
 * @prop {string} field Field name of comparison.
 * @prop {number} upperLimit The upper limit of the range.
 * @prop {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
 * @prop {number} lowerLimit The lower limit of the range.
 * @prop {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
 */
export class RangeClauseInQuery extends QueryClause {
    public field: string;
    public upperLimit: number;
    public upperIncluded: boolean;
    public lowerLimit: number;
    public lowerIncluded: boolean;

    /**
     * Create a range clause.
     * @constructor
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @param {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
     * @param {number} lowerLimit The upper lower of the range.
     * @param {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
     */
    constructor(
        field: string,
        upperLimit: number,
        upperIncluded: boolean,
        lowerLimit: number,
        lowerIncluded: boolean
    ) {
        super();
        this.field = field;
        this.upperLimit = upperLimit;
        this.upperIncluded = upperIncluded;
        this.lowerLimit = lowerLimit;
        this.lowerIncluded = lowerIncluded;
    }
    /**
     * Create a Range instance of the less than.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
     */
    static greaterThan(field: string, lowerLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(field, null, null, lowerLimit, false);
    }
    /**
     * Create a Range instance of the less than or equals.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
    */
    static greaterThanEquals(field: string, lowerLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(field, null, null, lowerLimit, true);
    }
    /**
     * Create a Range instance of the greater than.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
     */
    static lessThan(field: string, upperLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(field, upperLimit, false, null, null);
    }
    /**
     * Create a Range instance of the greater than or equals.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
     */
    static lessThanEquals(field: string, upperLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(field, upperLimit, true, null, null);
    }
}

/**
 * Represents all clause.
 */
export class AllClause extends QueryClause {

    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): Object {
        return {
            type: "all"
        }
    }
}
