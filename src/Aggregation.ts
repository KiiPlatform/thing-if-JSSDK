
/** AggreationType will be used to create type of aggreation when querying history states */
export const AggregationType = {
    COUNT: "COUNT",
    SUM: "SUM",
    MAX: "MAX",
    MIN: "MIN",
    MEAN: "MEAN"
}

/** Represent aggregation when querying history states. */
export class Aggregation {
    constructor(
        public type: string,
        public responseField: string,
        public field: string,
        public fieldType: string
    ){}

    toJson(): any {
        return {
            type: this.type,
            putAggregationInto: this.responseField,
            field: this.field,
            fieldType: this.fieldType
        }
    }
}