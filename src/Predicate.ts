import {Condition} from './Condition';
import {TriggersWhen} from './Trigger';

/** Represent Predicate for a Trigger */
export interface Predicate {
    getEventSource(): EventSource;
    toJson(): any;
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
}

