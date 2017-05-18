/**
 * Reprensets range of time.
 * @prop {Date} from included date the range from.
 * @prop {Date} to included date the range to.
 */
export class TimeRange {
    constructor(
        public from: Date, 
        public to: Date) {}
}