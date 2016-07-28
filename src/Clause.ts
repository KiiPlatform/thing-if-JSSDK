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
        }
        return null;
    }
}
/**
 * Represents the clause of equals condition.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class Equals extends Clause {
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a equals condition.
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            type: "eq",
            field: this.field,
            value: this.value
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a equals condition.
     * @return {Equals} Equals instance
     */
    static fromJson(obj:any): Equals {
        let field = obj.field;
        let value = obj.value;
        return new Equals(field, value);
    }
}
/**
 * Represents the clause of not equals condition.
 * @prop {string} field Field name of comparison.
 * @prop {(string|number|boolean)} value Value to be compared.
 */
export class NotEquals extends Clause {
    public field: string;
    public value: string|number|boolean;

    /**
     * Create a not equals condition.
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            type: "not",
            clause: {
                type: "eq",
                field: this.field,
                value: this.value
            }
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
        return new NotEquals(field, value);
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
 */
export class Range extends Clause {
    public field: string;
    public upperLimit: number;
    public upperIncluded: boolean;
    public lowerLimit: number;
    public lowerIncluded: boolean;

    /**
     * Create a range condition.
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
     */
    static greaterThan(field: string, lowerLimit: number): Range {
        return new Range(field, null, null, lowerLimit, false);
    }
    /**
     * Create a Range instance of the less than or equals.
     * @param {string} field Field name of comparison.
     * @param {number} lowerLimit The upper lower of the range.
     */
    static greaterThanEquals(field: string, lowerLimit: number): Range {
        return new Range(field, null, null, lowerLimit, true);
    }
    /**
     * Create a Range instance of the greater than.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     */
    static lessThan(field: string, upperLimit: number): Range {
        return new Range(field, upperLimit, false, null, null);
    }
    /**
     * Create a Range instance of the greater than or equals.
     * @param {string} field Field name of comparison.
     * @param {number} upperLimit The upper limit of the range.
     */
    static lessThanEquals(field: string, upperLimit: number): Range {
        return new Range(field, upperLimit, true, null, null);
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
        return new Range(field, upperLimit, upperIncluded, lowerLimit, lowerIncluded);
    }
}
