export abstract class Clause {
    abstract toJson(): any;
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
export class Equals extends Clause {
    constructor(
        public field: string,
        public value: string|number|boolean
    ) {
        super();
    }
    toJson(): any {
        return {
            type: "eq",
            field: this.field,
            value: this.value
        };
    }
    static fromJson(obj:any): Equals {
        let field = obj.field;
        let value = obj.value;
        return new Equals(field, value);
    }
}
export class NotEquals extends Clause {
    constructor(
        public field: string,
        public value: string|number|boolean
    ) {
        super();
    }
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
    static fromJson(obj:any): NotEquals {
        let field = obj.clause.field;
        let value = obj.clause.value;
        return new NotEquals(field, value);
    }
}
export class And extends Clause {
    public clauses: Clause[];
    constructor(...clauses: Clause[]) {
        super();
        this.clauses = clauses;
    }
    toJson(): any {
        var json: any = {type: "and"};
        var clauses :Array<Clause> = new Array<Clause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
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
export class Or extends Clause {
    public clauses: Clause[];
    constructor(...clauses: Clause[]) {
        super();
        this.clauses = clauses;
    }
    toJson(): any {
        var json: any = {type: "or"};
        var clauses :Array<Clause> = new Array<Clause>();
        for (var clause of this.clauses) {
            clauses.push(clause.toJson());
        }
        json["clauses"] = clauses;
        return json;
    }
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
export class Range extends Clause {
    constructor(
        public field: string,
        public upperLimit: number,
        public upperIncluded: boolean,
        public lowerLimit: number,
        public lowerIncluded: boolean
    ) {
        super();
    }
    static greaterThan(field: string, lowerLimit: number): Range {
        return new Range(field, null, null, lowerLimit, false);
    }
    static greaterThanEquals(field: string, lowerLimit: number): Range {
        return new Range(field, null, null, lowerLimit, true);
    }
    static lessThan(field: string, upperLimit: number): Range {
        return new Range(field, upperLimit, false, null, null);
    }
    static lessThanEquals(field: string, upperLimit: number): Range {
        return new Range(field, upperLimit, true, null, null);
    }
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
    static fromJson(obj:any): Range {
        let field = obj.field;
        let upperLimit = obj.upperLimit ? obj.upperLimit : null;
        let upperIncluded = obj.upperIncluded ? obj.upperIncluded : null;
        let lowerLimit = obj.lowerLimit ? obj.lowerLimit : null;
        let lowerIncluded = obj.lowerIncluded ? obj.lowerIncluded : null;
        return new Range(field, upperLimit, upperIncluded, lowerLimit, lowerIncluded);
    }
}
