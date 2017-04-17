import {TriggerClause} from './TriggerClause';
import { jsonToTriggerClause } from './internal/JsonUtilities';

/**
 * Represents the condition for the StatePredicate.
 * @prop {TriggerClause} clause Query condition to be applied.
 */
export class Condition {
    public clause: TriggerClause;

    /**
     * Create a condition.
     * @constructor
     * @param {TriggerClause} clause Query condition to be applied.
     */
    constructor(clause: TriggerClause) {
        this.clause = clause;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a condition.
     * @return {Condition} Condition instance
     */
    static fromJson(obj:any): Condition {
        return new Condition(jsonToTriggerClause(obj));
    }
}