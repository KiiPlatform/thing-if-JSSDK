/**
 * Base QueryClause implementation.
 */
export abstract class QueryClause {
    abstract toJson(): any;
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a clause.
     * @return {QueryClause} a QueryClause instance
     */
    static fromJson(obj:any): QueryClause {
        if (obj.type == "eq") {
            return EqualsClauseInQuery.fromJson(obj);
        } else if (obj.type == "not") {
            return NotEqualsClauseInQuery.fromJson(obj);
        } else if (obj.type == "and") {
            return AndClauseInQuery.fromJson(obj);
        } else if (obj.type == "or") {
            return OrClauseInQuery.fromJson(obj);
        } else if (obj.type == "range") {
            return RangeClauseInQuery.fromJson(obj);
        } else if (obj.type == "all") {
            return new AllClause();
        }
        return null;
    }
}
/**
 * Represents equals clause when query history states.
 * @prop {string} alias alias name.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class EqualsClauseInQuery extends QueryClause {
    public alias: string;
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a equals clause.
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
     * @param obj JSON object that represented a equals clause.
     * @return {EqualsClauseInQuery} EqualsClauseInQuery instance
     */
    static fromJson(obj:any): EqualsClauseInQuery {
        let field = obj.field;
        let value = obj.value;
        let alias = obj.alias;
        return new EqualsClauseInQuery(alias, field, value);
    }
}
/**
 * Represents not equals clause when query history states.
 * @prop {string} alias alias.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class NotEqualsClauseInQuery extends QueryClause {
    public alias: string;
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a not equals clause.
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
        this.alias = alias;
        this.field = field;
        this.value = value;
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
     * @param obj JSON object that represented a not equals clause.
     * @return {NotEqualsClauseInQuery} NotEqualsClauseInQuery instance
     */
    static fromJson(obj:any): NotEqualsClauseInQuery {
        let field = obj.clause.field;
        let value = obj.clause.value;
        let alias = obj.clause.alias;
        return new NotEqualsClauseInQuery(alias, field, value);
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "and"};
        var clauses :Array<QueryClause> = new Array<QueryClause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a AND clause.
     * @return {AndClauseInQuery} AndClauseInQuery instance
     */
    static fromJson(obj:any): AndClauseInQuery {
        let clauses: Array<QueryClause> = new Array<QueryClause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(QueryClause.fromJson(json));
        }
        let and = new AndClauseInQuery();
        and.clauses = clauses;
        return and;
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "or"};
        var clauses :Array<QueryClause> = new Array<QueryClause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a OR clause.
     * @return {OrClauseInQuery} Or instance
     */
    static fromJson(obj:any): OrClauseInQuery {
        let clauses: Array<QueryClause> = new Array<QueryClause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(QueryClause.fromJson(json));
        }
        let or = new OrClauseInQuery();
        or.clauses = clauses;
        return or;
    }
}
/**
 * Represents the clause of range clause when query history states.
 * @prop {string} alias alias.
 * @prop {string} field Field name of comparison.
 * @prop {number} upperLimit The upper limit of the range.
 * @prop {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
 * @prop {number} lowerLimit The lower limit of the range.
 * @prop {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
 */
export class RangeClauseInQuery extends QueryClause {
    public alias: string;
    public field: string;
    public upperLimit: number;
    public upperIncluded: boolean;
    public lowerLimit: number;
    public lowerIncluded: boolean;

    /**
     * Create a range clause.
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
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
     */
    static greaterThan(alias: string, field: string, lowerLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(alias, field, null, null, lowerLimit, false);
    }
    /**
     * Create a Range instance of the less than or equals.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
    */
    static greaterThanEquals(alias: string, field: string, lowerLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(alias, field, null, null, lowerLimit, true);
    }
    /**
     * Create a Range instance of the greater than.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
     */
    static lessThan(alias: string, field: string, upperLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(alias, field, upperLimit, false, null, null);
    }
    /**
     * Create a Range instance of the greater than or equals.
     * @param {string} alias alias.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @returns {RangeClauseInQuery} RangeClauseInQuery instance.
     */
    static lessThanEquals(alias: string, field: string, upperLimit: number): RangeClauseInQuery {
        return new RangeClauseInQuery(alias, field, upperLimit, true, null, null);
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
     * @return {RangeClauseInQuery} RangeClauseInQuery instance
     */
    static fromJson(obj:any): RangeClauseInQuery {
        let field = obj.field;
        let upperLimit = obj.upperLimit ? obj.upperLimit : null;
        let upperIncluded = obj.upperIncluded ? obj.upperIncluded : null;
        let lowerLimit = obj.lowerLimit ? obj.lowerLimit : null;
        let lowerIncluded = obj.lowerIncluded ? obj.lowerIncluded : null;
        let alias = obj.alias;
        return new RangeClauseInQuery(alias, field, upperLimit, upperIncluded, lowerLimit, lowerIncluded);
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
