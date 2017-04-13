/**
 * Base TriggerClause implementation.
 */
export abstract class TriggerClause {
    abstract toJson(): any;
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a clause.
     * @return {TriggerClause} Equals instance
     */
    static fromJson(obj:any): TriggerClause {
        if (obj.type == "eq") {
            return EqualsClauseInTrigger.fromJson(obj);
        } else if (obj.type == "not") {
            return NotEqualsClauseInTrigger.fromJson(obj);
        } else if (obj.type == "and") {
            return AndClauseInTrigger.fromJson(obj);
        } else if (obj.type == "or") {
            return OrClauseInTrigger.fromJson(obj);
        } else if (obj.type == "range") {
            return RangeClauseInTrigger.fromJson(obj);
        }
        return null;
    }
}
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            type: "eq",
            alias: this.alias,
            field: this.field,
            value: this.value
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a equals condition.
     * @return {EqualsClauseInTrigger} Equals instance
     */
    static fromJson(obj:any): EqualsClauseInTrigger {
        let field = obj.field;
        let value = obj.value;
        let alias = obj.alias;
        return new EqualsClauseInTrigger(alias, field, value);
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            type: "not",
            clause: {
                type: "eq",
                alias: this.alias,
                field: this.field,
                value: this.value
            }
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a not equals condition.
     * @return {NotEqualsClauseInTrigger} NotEquals instance
     */
    static fromJson(obj:any): NotEqualsClauseInTrigger {
        let field = obj.clause.field;
        let value = obj.clause.value;
        let alias = obj.clause.alias;
        return new NotEqualsClauseInTrigger(alias, field, value);
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "and"};
        var clauses :Array<TriggerClause> = new Array<TriggerClause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a AND operator.
     * @return {AndClauseInTrigger} And instance
     */
    static fromJson(obj:any): AndClauseInTrigger {
        let clauses: Array<TriggerClause> = new Array<TriggerClause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(TriggerClause.fromJson(json));
        }
        let and = new AndClauseInTrigger();
        and.clauses = clauses;
        return and;
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "or"};
        var clauses :Array<TriggerClause> = new Array<TriggerClause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a OR operator.
     * @return {OrClauseInTrigger} Or instance
     */
    static fromJson(obj:any): OrClauseInTrigger {
        let clauses: Array<TriggerClause> = new Array<TriggerClause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(TriggerClause.fromJson(json));
        }
        let or = new OrClauseInTrigger();
        or.clauses = clauses;
        return or;
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "range", field: this.field};
        if (this.upperLimit != null && this.upperLimit != undefined) {
            json["upperLimit"] = this.upperLimit;
        }
        if (this.upperIncluded != null && this.upperIncluded != undefined) {
            json["upperIncluded"] = this.upperIncluded;
        }
        if (this.lowerLimit != null && this.lowerLimit != undefined) {
            json["lowerLimit"] = this.lowerLimit;
        }
        if (this.lowerIncluded != null && this.lowerIncluded != undefined) {
            json["lowerIncluded"] = this.lowerIncluded;
        }
        json["alias"] = this.alias;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a range condition.
     * @return {RangeClauseInTrigger} Range instance
     */
    static fromJson(obj:any): RangeClauseInTrigger {
        let field = obj.field;
        let upperLimit = obj.upperLimit ? obj.upperLimit : null;
        let upperIncluded = obj.upperIncluded ? obj.upperIncluded : null;
        let lowerLimit = obj.lowerLimit ? obj.lowerLimit : null;
        let lowerIncluded = obj.lowerIncluded ? obj.lowerIncluded : null;
        let alias = obj.alias;
        return new RangeClauseInTrigger(alias, field, upperLimit, upperIncluded, lowerLimit, lowerIncluded);
    }
}
