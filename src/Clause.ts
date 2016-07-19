export interface Clause {
    toJson(): any;
}
export class Equals implements Clause {
    constructor(
        public field: string,
        public value: string|number|boolean
    ) {}
    toJson(): any {
        return {
            type: "eq",
            field: this.field,
            value: this.value
        };
    }
}
export class NotEquals implements Clause {
    constructor(
        public field: string,
        public value: string|number|boolean
    ) {}
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
}
export class And implements Clause {
    public clauses: Clause[];
    constructor(...clauses: Clause[]) {
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
}
export class Or implements Clause {
    public clauses: Clause[];
    constructor(...clauses: Clause[]) {
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
}
export class Range implements Clause {
    constructor(
        public field: string,
        public upperLimit: number,
        public upperIncluded: boolean,
        public lowerLimit: number,
        public lowerIncluded: boolean
    ) {}
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
}
