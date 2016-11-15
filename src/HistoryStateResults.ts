/** Represent results grouped by range of dates after querying history state
 * @prop {Date} rangeFrom Begin date of range.
 * @prop {Date} rangeTo End date of range.
 * @prop {Object[]} results Array of state object.
*/
export class GroupedResults {
    /** Initialize GroupedResults
     * @param {Date} rangeFrom Begin date of range.
     * @param {Date} rangeTo End date of range.
     * @param {Object[]} results Array of state object.
     */
    constructor(
        public rangeFrom: Date,
        public rangeTo: Date,
        public results: Array<Object>
    ){}
}

/** Represents results after query history states.
 * @prop {string} queryDescription Description of query
 * @prop {boolean} grouped If true, the results are grouped. Otherwise, false.
 * @prop {Object[]} results Represents non grouped results.
 * @prop {GroupedResults} groupedResults Represents grouped results.
*/
export class HistoryStateResults {
    constructor(
        public queryDescription: string,
        public grouped: boolean,
        public results?: Array<Object>,
        public groupedResults?: Array<GroupedResults>
    ){}

    /** Return the results by checking grouped. If grouped results is returned, otherwise GroupedResults returned
     * @return {Object[]|GroupedResults} Results based on grouped.
    */
    getResults(): Array<Object> | Array<GroupedResults> {
        if(this.grouped){
            return this.groupedResults
        }else{
            return this.results
        }
    }
}