import { expect } from 'chai';
import { jsonToGroupedHistoryStates } from '../../../src/internal/JsonUtilities';
import { GroupedHistoryStates, HistoryState } from '../../../src/HistoryState';
import { TimeRange } from '../../../src/TimeRange';
describe("Test JsonUtilities#jsonToGroupedHistoryStates()", () => {
    it("provides valid json object should return expected states", () => {
        let json = {
            range: {
                from: 10,
                to: 100
            },
            objects: [
                {
                    power: true,
                    _created: 11
                },
                {
                    power: true,
                    currentTemperature: 23,
                    _created: 12
                }
            ]
        }

        expect(jsonToGroupedHistoryStates(json)).deep.equal(
            new GroupedHistoryStates(
                new TimeRange(new Date(10), new Date(100)),
                [
                    new HistoryState({power: true}, new Date(11)),
                    new HistoryState({power: true, currentTemperature: 23}, new Date(12))
                ])
        )
    })
})