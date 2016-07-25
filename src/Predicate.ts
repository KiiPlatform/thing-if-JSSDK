import {Condition} from './Condition';
import {TriggersWhen} from './Trigger';

/** Represent Predicate for a Trigger */
export abstract class Predicate {
    /**
     * Gets the string represented EventSource
     * @return {string} EventSource
     */
    abstract getEventSource(): string;
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    abstract toJson(): any;
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a predicate.
     * @return {Predicate} Predicate instance
     */
    static fromJson(obj:any): Predicate {
        if (obj.eventSource == EventSource.STATES) {
            return StatePredicate.fromJson(obj);
        } else if (obj.eventSource == EventSource.SCHEDULE) {
            return SchedulePredicate.fromJson(obj);
        } else if (obj.eventSource == EventSource.SCHEDULE_ONCE) {
            return ScheduleOncePredicate.fromJson(obj);
        }
        return null;
    }
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            condition: this.condition.clause.toJson(),
            eventSource: EventSource.STATES,
            triggersWhen: this.triggersWhen
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a StatePredicate.
     * @return {StatePredicate} StatePredicate instance
     */
    static fromJson(obj:any): StatePredicate {
        let condition: Condition = Condition.fromJson(obj.condition);
        let triggersWhen = (<any>TriggersWhen)[obj.triggersWhen];
        return new StatePredicate(condition, triggersWhen);
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            schedule: this.schedule,
            eventSource: EventSource.SCHEDULE
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a SchedulePredicate.
     * @return {SchedulePredicate} SchedulePredicate instance
     */
    static fromJson(obj:any): SchedulePredicate {
        let schedule = obj.schedule;
        return new SchedulePredicate(schedule);
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
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
    toJson(): any {
        return {
            scheduleAt: this.scheduleAt,
            eventSource: EventSource.SCHEDULE_ONCE
        };
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a ScheduleOncePredicate.
     * @return {ScheduleOncePredicate} ScheduleOncePredicate instance
     */
    static fromJson(obj:any): ScheduleOncePredicate {
        let scheduleAt = obj.scheduleAt;
        return new ScheduleOncePredicate(scheduleAt);
    }
}

