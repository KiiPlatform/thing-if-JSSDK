/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import { QueryGroupedHistoryStatesRequest } from '../../../src/RequestObjects';
import { TimeRange } from '../../../src/TimeRange';
import { expect } from 'chai';
import { groupedQueryToJson } from '../../../src/internal/JsonUtilities';
import { EqualsClauseInQuery } from '../../../src/QueryClause';
describe("Test JsonUtilities#groupedQueryToJson()", () => {
    describe("request object only has required fields", () => {
        it("returned json should be expected", () => {
            let requestObject = new QueryGroupedHistoryStatesRequest(
                "alias1",
                new TimeRange(new Date(10), new Date(100))
            )
            expect(groupedQueryToJson(requestObject)).deep.equal({
                query: {
                    grouped: true,
                    clause: {
                        type: "withinTimeRange",
                        lowerLimit: 10,
                        upperLimit: 100
                    }
                }
            })
        })
    })
    describe("request object contains optional fields", () => {
        it("returned json should be expected", () => {
            let requestObject = new QueryGroupedHistoryStatesRequest(
                "alias1",
                new TimeRange(new Date(10), new Date(100)),
                new EqualsClauseInQuery("power", true),
                "v1"
            )
            expect(groupedQueryToJson(requestObject)).deep.equal({
                query: {
                    grouped: true,
                    clause: {
                        type: "and",
                        clauses: [
                            {
                                type: "eq",
                                field: "power",
                                value: true
                            },
                            {
                                type: "withinTimeRange",
                                lowerLimit: 10,
                                upperLimit: 100
                            }
                        ]
                    }
                },
                "firmwareVersion": "v1"
            })
        })
    })
})