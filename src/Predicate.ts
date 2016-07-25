import {Condition} from './Condition';
import {TriggersWhen} from './Trigger';

/** Represent Predicate for a Trigger */
export abstract class Predicate {
    abstract getEventSource(): string;
    abstract toJson(): any;
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
/** Represent StatePredicate for a Trigger */
export class StatePredicate implements Predicate {
    public condition: Condition;
    public triggersWhen: string;

    constructor(
        condition: Condition,
        triggersWhen: string
    ) {
        this.condition = condition;
        this.triggersWhen = triggersWhen;
    }
    getEventSource(): string {
        return EventSource.STATES;
    }
    toJson(): any {
        return {
            condition: this.condition.clause.toJson(),
            eventSource: EventSource.STATES,
            triggersWhen: this.triggersWhen
        };
    }
    static fromJson(obj:any): StatePredicate {
        let condition: Condition = Condition.fromJson(obj.condition);
        let triggersWhen = (<any>TriggersWhen)[obj.triggersWhen];
        return new StatePredicate(condition, triggersWhen);
    }
}
/** Represent SchedulePredicate for a Trigger */
export class SchedulePredicate implements Predicate {
    public cronExpression: string;

    constructor(cronExpression: string) {
        this.cronExpression = cronExpression;
    }
    getEventSource(): string {
        return EventSource.SCHEDULE;
    }
    toJson(): any {
        return {
            schedule: this.cronExpression,
            eventSource: EventSource.SCHEDULE
        };
    }
    static fromJson(obj:any): SchedulePredicate {
        let schedule = obj.schedule;
        return new SchedulePredicate(schedule);
    }
}
/** Represent ScheduleOncePredicate for a Trigger */
export class ScheduleOncePredicate implements Predicate {
    public scheduleAt: number;
    constructor(scheduleAt: number) {
        this.scheduleAt = scheduleAt;
    }
    getEventSource(): string {
        return EventSource.SCHEDULE_ONCE;
    }
    toJson(): any {
        return {
            scheduleAt: this.scheduleAt,
            eventSource: EventSource.SCHEDULE_ONCE
        };
    }
    static fromJson(obj:any): ScheduleOncePredicate {
        let scheduleAt = obj.scheduleAt;
        return new ScheduleOncePredicate(scheduleAt);
    }
}

