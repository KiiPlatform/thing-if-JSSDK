import { TimeRange } from './TimeRange';
import { QueryResult } from './QueryResult';

/**
 * Represents a history sate.
 * @prop {Object} state state.
 * @prop {Date} createdAt the date when the state created.
 */
export class HistoryState {
    constructor(
        public state: Object,
        public createdAt: Date) {}
}

/**
 * Represents grouped history states
 * @prop {TimeRange} range range of the grouped states.
 * @prop {HistoryState[]} states array of HistoryState under the range.
 */
export class GroupedHistoryStates {
    constructor(
        public range: TimeRange, 
        public states: Array<HistoryState>) {}
}