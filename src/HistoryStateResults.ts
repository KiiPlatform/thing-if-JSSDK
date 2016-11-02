export class GroupedResults {
    constructor(
        public rangeFrom: Date,
        public rangeTo: Date,
        public results: Array<any>
    ){}
}

export class HistoryStateResults {
    constructor(
        public queryDescription: string,
        public grouped: boolean,
        public results?: Array<any>,
        public groupedResults?: GroupedResults
    ){}

    getResults(): Array<any> | GroupedResults {
        if(this.grouped){
            return this.groupedResults
        }else{
            return this.results
        }
    }
}