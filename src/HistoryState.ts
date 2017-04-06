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

/**
 * Represents results of ungrouped query.
 * @prop {string} queryDescription string description for the query.
 * @prop {HistoryState[]} results array of HistoryState.
 * @prop {string} nextPaginationKey pagination key to do next query.
 */
export class QueryHistoryStatesResults extends QueryResult<HistoryState>{
    constructor(
        public queryDescription: string,
        results: Array<HistoryState>,
        nextPaginationKey? : string) {
            super(results, nextPaginationKey);
        }
}

/**
 * Represents results of grouped query
 * @prop {string} queryDescription string description for the query.
 * @prop {GroupedHistoryStates[]} groupedResults array of GroupedHistoryStates
 */
export class QueryGroupedHistoryStatesResults {
    constructor (
        public queryDescription: string,
        public groupedResults: Array<GroupedHistoryStates>) {}
}