/** DataGroupingInterval will be used to create the bucket to store the
 * state history when the thing is not using traits.
    <ul>
        <li>DataGroupingInterval.INTERVAL_1_MINUTE: data is grouped in 1 minute.</li>
        <li>DataGroupingInterval.INTERVAL_15_MINUTES: data is grouped in 15 minutes. </li>
        <li>DataGroupingInterval.INTERVAL_30_MINUTES: data is grouped in 30 minutes.</li>
        <li>DataGroupingInterval.INTERVAL_1_HOUR: data is grouped in 1 hour.</li>
        <li>DataGroupingInterval.INTERVAL_12_HOURS: data is grouped in 12 hours.</li>
    </ul>
*/
export const DataGroupingInterval = {
    INTERVAL_1_MINUTE: "1_MINUTE",
    INTERVAL_15_MINUTES: "15_MINUTES",
    INTERVAL_30_MINUTES: "30_MINUTES",
    INTERVAL_1_HOUR: "1_HOUR",
    INTERVAL_12_HOURS: "12_HOURS"
}