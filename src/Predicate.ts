import {Condition} from './Condition';
import {TriggersWhen} from './Trigger';

/** Represent Predicate for a Trigger */
export abstract class Predicate {
    abstract getEventSource(): EventSource;
    abstract toJson(): any;
    static fromJson(obj:any): Predicate {
        if (obj.eventSource == EventSource[EventSource.STATES]) {
            StatePredicate.fromJson(obj);
        } else if (obj.eventSource == EventSource[EventSource.SCHEDULE]) {
            SchedulePredicate.fromJson(obj);
        } else if (obj.eventSource == EventSource[EventSource.SCHEDULE_ONCE]) {
            ScheduleOncePredicate.fromJson(obj);
        }
        return null;
    }
}
export enum EventSource {
    STATES,
    SCHEDULE,
    SCHEDULE_ONCE
}
/** Represent StatePredicate for a Trigger */
export class StatePredicate implements Predicate {
    constructor(
        public condition: Condition,
        public triggersWhen: TriggersWhen
    ) {}
    getEventSource(): EventSource {
        return EventSource.STATES;
    }
    toJson(): any {
        return {
            condition: this.condition.clause.toJson(),
            eventSource: EventSource[EventSource.STATES],
            triggersWhen: TriggersWhen[this.triggersWhen]
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
    constructor(public cronExpression: string) {}
    getEventSource(): EventSource {
        return EventSource.SCHEDULE;
    }
    toJson(): any {
        return {
            schedule: this.cronExpression,
            eventSource: EventSource[EventSource.SCHEDULE]
        };
    }
    static fromJson(obj:any): SchedulePredicate {
        let schedule = obj.schedule;
        return new SchedulePredicate(schedule);
    }
}
/** Represent ScheduleOncePredicate for a Trigger */
export class ScheduleOncePredicate implements Predicate {
    constructor(public scheduleAt: number) {}
    getEventSource(): EventSource {
        return EventSource.SCHEDULE_ONCE;
    }
    toJson(): any {
        return {
            scheduleAt: this.scheduleAt,
            eventSource: EventSource[EventSource.SCHEDULE_ONCE]
        };
    }
    static fromJson(obj:any): ScheduleOncePredicate {
        let scheduleAt = obj.scheduleAt;
        return new ScheduleOncePredicate(scheduleAt);
    }
}

