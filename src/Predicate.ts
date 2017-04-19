import {Condition} from './Condition';
import {TriggersWhen} from './Trigger';
import { triggerClauseToJson } from './internal/JsonUtilities';

/** Represent Predicate for a Trigger */
export abstract class Predicate {
    /**
     * Gets the string represented EventSource
     * @return {string} EventSource
     */
    abstract getEventSource(): string;
}
/** Represent source to fire trigger.
<ul>
    <li>EventSource.STATES: fire trigger based on states.</li>
    <li>EventSource.SCHEDULE: fire trigger based on schedule.</li>
    <li>EventSource.SCHEDULE_ONCE: fire trigger based on schedule only once.</li>
</ul>
*/
export const EventSource = {
    STATES: "STATES",
    SCHEDULE: "SCHEDULE",
    SCHEDULE_ONCE: "SCHEDULE_ONCE"
}
/**
 * Represent StatePredicate for a Trigger
 * @param {Condition} condition Condition to fire trigger.
 * @param {string} triggersWhen Defined when trigger will be fired
 */
export class StatePredicate implements Predicate {
    public condition: Condition;
    public triggersWhen: string;

    /**
     * Create a StatePredicate.
     * @constructor
     * @param {Condition} condition Condition to fire trigger.
     * @param {string} triggersWhen Defined when trigger will be fired
     */
    constructor(
        condition: Condition,
        triggersWhen: string
    ) {
        this.condition = condition;
        this.triggersWhen = triggersWhen;
    }
    /**
     * Gets the string represented EventSource
     * @return {string} EventSource
     */
    getEventSource(): string {
        return EventSource.STATES;
    }
}
/**
 * Represent SchedulePredicate for a Trigger
 * @param {string} schedule Cron expression to fire trigger.
 */
export class SchedulePredicate implements Predicate {
    public schedule: string;

    /**
     * Create a ScheduleOncePredicate.
     * @constructor
     * @param {string} schedule Cron expression to fire trigger.
     */
    constructor(schedule: string) {
        this.schedule = schedule;
    }
    /**
     * Gets the string represented EventSource
     * @return {string} EventSource
     */
    getEventSource(): string {
        return EventSource.SCHEDULE;
    }
}
/**
 * Represent ScheduleOncePredicate for a Trigger
 * @param {number} scheduleAt Timestamp to fire trigger.
 */
export class ScheduleOncePredicate implements Predicate {
    public scheduleAt: number;

    /**
     * Create a ScheduleOncePredicate.
     * @constructor
     * @param {number} scheduleAt Timestamp to fire trigger.
     */
    constructor(scheduleAt: number) {
        this.scheduleAt = scheduleAt;
    }
    /**
     * Gets the string represented EventSource
     * @return {string} EventSource
     */
    getEventSource(): string {
        return EventSource.SCHEDULE_ONCE;
    }
}

