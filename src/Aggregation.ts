/** AggreationType will be used to create type of aggreation when querying history states.
  <ul>
  <li>AggregationType.COUNT: count function.</li>
  <li>AggregationType.SUM: sum function. </li>
  <li>AggregationType.MAX: max function.</li>
  <li>AggregationType.MIN: min function.</li>
  <li>AggregationType.MEAN: mean function.</li>
  </ul>
*/
export const FunctionType = {
    COUNT: "COUNT",
    SUM: "SUM",
    MAX: "MAX",
    MIN: "MIN",
    MEAN: "MEAN"
}

/**
 * Represents field type
  <ul>
  <li>FieldType.INTEGER: integer field type.</li>
  <li>FieldType.DECIMAL: decimal field type. </li>
  <li>FieldType.BOOLEAN: boolean field type.</li>
  <li>FieldType.OBJECTSG: object field type.</li>
  <li>FieldType.ARRAY: array field type.</li>
  </ul>
 */
export const FieldType = {
    INTEGER: "INTEGER",
    DECIMAL: "DECIMAL",
    BOOLEAN: "BOOLEAN",
    OBJECT: "OBJECT",
    ARRAY: "ARRAY"
    //TODO: need to check other field types
}

/** Represent aggregation when querying history states. 
 * @prop {FunctionType} type function type of the aggregation.
 * @prop {string} field Name of field of the aggregation. 
 * @prop {FieldType} fieldType Type of field.
*/
export class Aggregation {
    /**
     * Create Aggregation object.
     * @param {FunctionType} type function type of the aggregation.
     * @param {string} field name of field of the aggregation. 
     * @param {FieldType} fieldType Type of field.
     */
    constructor(
        public type: string,
        public field: string,
        public fieldType: string
    ){}
}