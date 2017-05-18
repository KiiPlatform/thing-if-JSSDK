/**
 * Base TriggerClause implementation.
 */
export class TriggerClause {}
/**
 * Represents the clause of equals condition.
 * @prop {string} alias alias name.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class EqualsClauseInTrigger extends TriggerClause {
    public alias: string;
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a equals condition.
     * @constructor
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {string} value Value to be compared.
     */
    constructor(
        alias: string,
        field: string,
        value: string|number|boolean
    ) {
        super();
        this.field = field;
        this.value = value;
        this.alias = alias;
    }
}
/**
 * Represents the clause of not equals condition.
 * @prop {string} alias alias.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class NotEqualsClauseInTrigger extends TriggerClause {
    public alias: string;
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a not equals condition.
     * @constructor
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {string} value Value to be compared.
     */
    constructor(
        alias: string,
        field: string,
        value: string|number|boolean
    ) {
        super();
        this.field = field;
        this.value = value;
        this.alias = alias;
    }
}
/**
 * Represents the And operator.
 * @prop {TriggerClause[]} clauses Clauses to be concatenated with And operator.
 */
export class AndClauseInTrigger extends TriggerClause {
    public clauses: TriggerClause[];

    /**
     * Create a AND operator.
     * @constructor
     * @param {TriggerClause[]} clauses Array of clauses to be concatenated with And operator.
     */
    constructor(...clauses: TriggerClause[]) {
        super();
        this.clauses = clauses;
    }
}
/**
 * Represents the OR operator.
 * @prop {TriggerClause[]} clauses Clauses to be concatenated with Or operator.
 */
export class OrClauseInTrigger extends TriggerClause {
    public clauses: TriggerClause[];

    /**
     * Create a OR operator.
     * @constructor
     * @param {TriggerClause[]} clauses Array of clauses to be concatenated with Or operator.
     */
    constructor(...clauses: TriggerClause[]) {
        super();
        this.clauses = clauses;
    }
}
/**
 * Represents the clause of range condition.
 * @prop {string} alias alias.
 * @prop {string} field Field name of comparison.
 * @prop {number} upperLimit The upper limit of the range.
 * @prop {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
 * @prop {number} lowerLimit The lower limit of the range.
 * @prop {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
 */
export class RangeClauseInTrigger extends TriggerClause {
    public alias: string;
    public field: string;
    public upperLimit: number;
    public upperIncluded: boolean;
    public lowerLimit: number;
    public lowerIncluded: boolean;

    /**
     * Create a range condition.
     * @constructor
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @param {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
     * @param {number} lowerLimit The upper lower of the range.
     * @param {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
     */
    constructor(
        alias: string,
        field: string,
        upperLimit: number,
        upperIncluded: boolean,
        lowerLimit: number,
        lowerIncluded: boolean
    ) {
        super();
        this.alias = alias;
        this.field = field;
        this.upperLimit = upperLimit;
        this.upperIncluded = upperIncluded;
        this.lowerLimit = lowerLimit;
        this.lowerIncluded = lowerIncluded;
    }
    /**
     * Create a Range instance of the less than.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     */
    static greaterThan(alias: string, field: string, lowerLimit: number): RangeClauseInTrigger {
        return new RangeClauseInTrigger(alias, field, null, null, lowerLimit, false);
    }
    /**
     * Create a Range instance of the less than or equals.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     */
    static greaterThanEquals(alias: string, field: string, lowerLimit: number): RangeClauseInTrigger {
        return new RangeClauseInTrigger(alias, field, null, null, lowerLimit, true);
    }
    /**
     * Create a Range instance of the greater than.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     */
    static lessThan(alias: string, field: string, upperLimit: number): RangeClauseInTrigger {
        return new RangeClauseInTrigger(alias, field, upperLimit, false, null, null);
    }
    /**
     * Create a Range instance of the greater than or equals.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     */
    static lessThanEquals(alias: string, field: string, upperLimit: number): RangeClauseInTrigger {
        return new RangeClauseInTrigger(alias, field, upperLimit, true, null, null);
    }
}
