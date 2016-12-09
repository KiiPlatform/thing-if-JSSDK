/**
 * Base Clause implementation.
 */
export abstract class Clause {
    abstract toJson(): any;
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a clause.
     * @return {Clause} Equals instance
     */
    static fromJson(obj:any): Clause {
        if (obj.type == "eq") {
            return Equals.fromJson(obj);
        } else if (obj.type == "not") {
            return NotEquals.fromJson(obj);
        } else if (obj.type == "and") {
            return And.fromJson(obj);
        } else if (obj.type == "or") {
            return Or.fromJson(obj);
        } else if (obj.type == "range") {
            return Range.fromJson(obj);
        } else if (obj.type == "withTimeRange") {
            return TimeRange.fromJson(obj);
        }
        return null;
    }
}
/**
 * Represents the clause of equals condition.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 * @prop {string} alias Name of TraitAlias.
 */
export class Equals extends Clause {
    public field: string;
    public value: string|number|boolean;
    public alias: string
    /**
     * Create a equals condition.
     * @constructor
     * @param {string} field Field name of comparison.
     * @param {string} value Value to be compared.
     * @param [string] alias Name of TraitAlias.
     */
    constructor(
        field: string,
        value: string|number|boolean,
        alias?: string
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
        var jsonObject: any = {
            type: "eq",
            field: this.field,
            value: this.value
        };
        if(!!this.alias) {
            jsonObject["alias"] = this.alias;
        }
        return jsonObject;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a equals condition.
     * @return {Equals} Equals instance
     */
    static fromJson(obj:any): Equals {
        let field = obj.field;
        let value = obj.value;
        let alias = obj.alias;

        return new Equals(field, value, alias);
    }
}
/**
 * Represents the clause of not equals condition.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 * @prop {string} alias Name of TraitAlias.
 */
export class NotEquals extends Clause {
    public field: string;
    public value: string|number|boolean;
    public alias: string;

    /**
     * Create a not equals condition.
     * @constructor
     * @param {string} field Field name of comparison.
     * @param {string} value Value to be compared.
     * @param [string] alias Name of TraitAlias.
     */
    constructor(
        field: string,
        value: string|number|boolean,
        alias?: string
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
        let equals: Equals = new Equals(this.field, this.value, this.alias);
        return {
            type: "not",
            clause: equals.toJson()
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a not equals condition.
     * @return {NotEquals} NotEquals instance
     */
    static fromJson(obj:any): NotEquals {
        let field = obj.clause.field;
        let value = obj.clause.value;
        let alias = obj.clause.alias;
        return new NotEquals(field, value, alias);
    }
}
/**
 * Represents the And operator.
 * @prop {Clause[]} clauses Clauses to be concatenated with And operator.
 */
export class And extends Clause {
    public clauses: Clause[];

    /**
     * Create a AND operator.
     * @constructor
     * @param {Clause[]} clauses Array of clauses to be concatenated with And operator.
     */
    constructor(...clauses: Clause[]) {
        super();
        this.clauses = clauses;
    }
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "and"};
        var clauses :Array<Clause> = new Array<Clause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a AND operator.
     * @return {And} And instance
     */
    static fromJson(obj:any): And {
        let clauses: Array<Clause> = new Array<Clause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(Clause.fromJson(json));
        }
        let and = new And();
        and.clauses = clauses;
        return and;
    }
}
/**
 * Represents the OR operator.
 * @prop {Clause[]} clauses Clauses to be concatenated with Or operator.
 */
export class Or extends Clause {
    public clauses: Clause[];

    /**
     * Create a OR operator.
     * @constructor
     * @param {Clause[]} clauses Array of clauses to be concatenated with Or operator.
     */
    constructor(...clauses: Clause[]) {
        super();
        this.clauses = clauses;
    }
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "or"};
        var clauses :Array<Clause> = new Array<Clause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a OR operator.
     * @return {Or} Or instance
     */
    static fromJson(obj:any): Or {
        let clauses: Array<Clause> = new Array<Clause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(Clause.fromJson(json));
        }
        let or = new Or();
        or.clauses = clauses;
        return or;
    }
}
/**
 * Represents the clause of range condition.
 * @prop {string} field Field name of comparison.
 * @prop {number} upperLimit The upper limit of the range.
 * @prop {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
 * @prop {number} lowerLimit The lower limit of the range.
 * @prop {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
 * @prop {string} alias Name of TraitAlias.
 */
export class Range extends Clause {
    public field: string;
    public upperLimit: number;
    public upperIncluded: boolean;
    public lowerLimit: number;
    public lowerIncluded: boolean;
    public alias: string;

    /**
     * Create a range condition.
     * @constructor
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @param {boolean} upperIncluded Boolean field that indicates if the upper limit is contained in the range, if omitted is considered as "true".
     * @param {number} lowerLimit The upper lower of the range.
     * @param {boolean} lowerIncluded Boolean field that indicates if the lower limit is contained in the range, if omitted is considered as "true".
     * @param [string] alias Name of TraitAlias.
     */
    constructor(
        field: string,
        upperLimit: number,
        upperIncluded: boolean,
        lowerLimit: number,
        lowerIncluded: boolean,
        alias?: string
    ) {
        super();
        this.field = field;
        this.upperLimit = upperLimit;
        this.upperIncluded = upperIncluded;
        this.lowerLimit = lowerLimit;
        this.lowerIncluded = lowerIncluded;
        this.alias = alias;
    }
    /**
     * Create a Range instance of the less than.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     * @param [string] alias Name of TraitAlias.
     */
    static greaterThan(field: string, lowerLimit: number, alias?: string): Range {
        return new Range(field, null, null, lowerLimit, false, alias);
    }
    /**
     * Create a Range instance of the less than or equals.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     * @param [string] alias Name of TraitAlias.
     */
    static greaterThanEquals(field: string, lowerLimit: number, alias?: string): Range {
        return new Range(field, null, null, lowerLimit, true, alias);
    }
    /**
     * Create a Range instance of the greater than.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @param [string] alias Name of TraitAlias.
     */
    static lessThan(field: string, upperLimit: number, alias?: string): Range {
        return new Range(field, upperLimit, false, null, null, alias);
    }
    /**
     * Create a Range instance of the greater than or equals.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     * @param [string] alias Name of TraitAlias.
     */
    static lessThanEquals(field: string, upperLimit: number, alias?: string): Range {
        return new Range(field, upperLimit, true, null, null, alias);
    }
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        var json: any = {type: "range", field: this.field};
        if (!!this.alias) {
            json["alias"] = this.alias;
        }
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
        return json;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a range condition.
     * @return {Range} Range instance
     */
    static fromJson(obj:any): Range {
        let field = obj.field;
        let upperLimit = obj.upperLimit ? obj.upperLimit : null;
        let upperIncluded = obj.upperIncluded ? obj.upperIncluded : null;
        let lowerLimit = obj.lowerLimit ? obj.lowerLimit : null;
        let lowerIncluded = obj.lowerIncluded ? obj.lowerIncluded : null;
        let alias = obj.alias ? obj.alias : null;
        return new Range(field, upperLimit, upperIncluded, lowerLimit, lowerIncluded, alias);
    }
}

/**
 * Represent time range clause when querying state history.
 */
export class TimeRange extends Clause {
    constructor(
        public lowerLimit: Date,
        public upperLimit: Date,
    ){
        super();
    }

    toJson(): any {
        var json: any = {type: "withTimeRange"};
        if (this.lowerLimit) {
            json["lowerLimit"] = this.lowerLimit.getTime();
        }
        if (this.upperLimit) {
            json["upperLimit"] = this.upperLimit.getTime();
        }
        return json;
    }

    static fromJson(obj:any): TimeRange {
        let lowerLimit = obj.lowerLimit ? new Date(obj.lowerLimit) : null;
        let upperLimit = obj.upperLimit ? new Date(obj.upperLimit) : null;
        return new TimeRange(lowerLimit, upperLimit);
    }
}
