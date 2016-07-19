import {Condition} from './Condition';
import {TriggersWhen} from './Trigger';

/** Represent Predicate for a Trigger */
export abstract class Predicate {
    abstract getEventSource(): EventSource;
}
export enum EventSource {
    STATES,
    SCHEDULE,
    SCHEDULE_ONCE
}
/** Represent StatePredicate for a Trigger */
export class StatePredicate extends Predicate {
    constructor(
        public condition: Condition,
        public triggersWhen: TriggersWhen
    ) {
        super();
    }
    getEventSource(): EventSource {
        return EventSource.STATES;
    }
}
/** Represent SchedulePredicate for a Trigger */
export class SchedulePredicate extends Predicate {
    constructor(public cronExpression: string) {
        super();
    }
    getEventSource(): EventSource {
        return EventSource.SCHEDULE;
    }
}
/** Represent ScheduleOncePredicate for a Trigger */
export class ScheduleOncePredicate extends Predicate {
    constructor(public scheduleAt: number) {
        super();
    }
    getEventSource(): EventSource {
        return EventSource.SCHEDULE_ONCE;
    }
}

