import {Clause} from './Clause';

/**
 * Represents the condition for the StatePredicate.
 */
export class Condition {
    /**
     * Query condition to be applied. 
     * @type {Clause}
     */
    public clause: Clause;

    /**
     * Create a condition.
     * @constructor
     * @param {Clause} clause Query condition to be applied.
     */
    constructor(clause: Clause) {
        this.clause = clause;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a condition.
     * @return {Condition} Condition instance
     */
    static fromJson(obj:any): Condition {
        return new Condition(Clause.fromJson(obj));
    }
}