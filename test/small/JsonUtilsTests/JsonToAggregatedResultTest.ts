/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import { expect } from 'chai';
import { jsonToAggregatedResults } from '../../../src/internal/JsonUtilities';
import { AggregatedResults } from '../../../src/AggregatedResult';
import { TimeRange } from '../../../src/TimeRange';
import { HistoryState } from '../../../src/HistoryState';

describe("Test JsonUtilities#jsonToAggregatedResults()", () => {
    it("provide json expected AggregatedResults instance should be returned", () => {
        expect(jsonToAggregatedResults({
            range: { from: 10, to: 20 },
            aggregations: [{
                value: 23,
                name: "max",
                object: {
                    currentTemperature: 23,
                    _created: 11
                }
            }]
        })).deep.equal(new AggregatedResults(
            new TimeRange(new Date(10), new Date(20)),
            23,
            [new HistoryState({ currentTemperature: 23 }, new Date(11))]
        ))

        expect(jsonToAggregatedResults({
            range: { from: 20, to: 30 },
            aggregations: [{
                value: 3,
                name: "count"
            }]
        })).deep.equal(new AggregatedResults(
            new TimeRange(new Date(20), new Date(30)),
            3
        ))
    })
})