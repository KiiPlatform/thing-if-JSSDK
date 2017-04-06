import { TimeRange } from './TimeRange';
import { HistoryState } from './HistoryState';
/** Represents aggregated results whin a data grouping intervals
 * @prop {Timerange} range a time range within a data grouping intervals.
 * @prop {number} value aggregated value
 * @prop {Array<HistoryState>} aggregatedStates array of states, having the aggregated value.
 */
export class AggregatedResults {
    constructor(
        public range: TimeRange,
        public value?: number,
        public aggregatedStates?: Array<HistoryState> 
    ){}
}

/**
 * Represents result of aggregation query.
 * @prop {string} queryDescription string description of the query.
 * @prop {Array<AggregatedResults>} groupedResults array of AggregatedResults objects.
 */
export class QueryAggregationResults {
    constructor(
        public queryDescription: string,
        public groupedResults: Array<AggregatedResults>
    ){}
}