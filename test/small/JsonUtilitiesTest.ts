import { expect } from 'chai';
import { actionToJson, jsonToAction, aliasActionToJson, jsonToAliasAction, jsonToActionResult, jsonToAliasActionResult, triggerClauseToJson, jsonToTriggerClause } from '../../src/internal/JsonUtilities';
import { Action, AliasAction } from '../../src/AliasAction';
import { ActionResult, AliasActionResult } from '../../src/AliasActionResult';
import { EqualsClauseInTrigger, NotEqualsClauseInTrigger, RangeClauseInTrigger, AndClauseInTrigger, OrClauseInTrigger } from '../../src/TriggerClause';

describe('Test JsonUtilities', () => {
    it('Test actionToJson()', () => {
        expect(actionToJson(new Action(null, null))).null;
        expect(actionToJson(new Action("turnPower", true))).deep.equal({ turnPower: true });
        expect(actionToJson(<any>34)).null;
        expect(actionToJson(<any>null)).null;
    })

    it('Test jsonToAction()', () => {
        expect(jsonToAction({ "turnPower": true })).deep.equal(new Action("turnPower", true));
        expect(jsonToAction(<any>34)).null;
        expect(jsonToAction({ "turnPower": true, "setPresetTemp": 23 })).null;
    })

    it('Test aliasActionToJson()', () => {
        expect(aliasActionToJson(new AliasAction("alias1", [new Action("turnPower", true)])))
            .deep.equal({
                alias1: [
                    { "turnPower": true }]
            }
            );
        expect(aliasActionToJson(<any>{})).null;
        expect(aliasActionToJson(<any>null)).null;
    })

    it('Test jsonToAliasAction()', () => {
        expect(jsonToAliasAction({ alias1: [{ turnPower: true }, { setPresetTemp: 23 }] })).deep.equal(
            new AliasAction(
                "alias1", [
                    new Action("turnPower", true),
                    new Action("setPresetTemp", 23)])
        );
        expect(jsonToAliasAction({})).null;
        expect(jsonToAliasAction({
            alias1: [{ turnPower: true }, { setPresetTemp: 23 }],
            alias2: [{ setPresetHumd: 56 }]
        })).null;
    })

    it('Test jsonToActionResult()', () => {
        expect(jsonToActionResult(
            {
                turnPower:
                { succeeded: true }
            })).deep.equal(new ActionResult("turnPower", true));
        expect(jsonToActionResult(
            {
                turnPower: {
                    succeeded: false,
                    data: { key: "value" },
                    errorMessage: "invalid value"
                }
            })).deep.equal(new ActionResult("turnPower", false, { key: "value" }, "invalid value"));

        expect(jsonToActionResult({})).null;
        expect(jsonToActionResult(
            {
                turnPower: {}
            })).null;
    })

    it('Test jsonToAliasActionResult()', () => {
        expect(jsonToAliasActionResult(
            {
                alias1: [
                    {
                        turnPower:
                        { succeeded: true }

                    },
                    {
                        setPresetTemp: {
                            succeeded: false,
                            data: { key: "value" },
                            errorMessage: "invalid value"
                        }
                    }
                ]
            }
        )).deep.equal(new AliasActionResult("alias1", [
            new ActionResult("turnPower", true),
            new ActionResult("setPresetTemp", false, { key: "value" }, "invalid value")
        ]));

        expect(jsonToAliasActionResult({})).null;
        expect(jsonToAliasActionResult({
            alias1: {}
        })).null;
    })
})

describe('Test JsonUtilities for TriggerClause', () => {
    describe("Test triggerClauseToJson()", () => {
        describe("Equals", () => {
            it("string value", () => {
                var clause = new EqualsClauseInTrigger("alias1", "field1", "hoge");
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "eq", field: "field1", value: "hoge" });
            });
            it("number value", () => {
                var clause = new EqualsClauseInTrigger("alias1", "field2", 1234.5);
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "eq", field: "field2", value: 1234.5 });
            });
            it("boolean value", () => {
                var clause = new EqualsClauseInTrigger("alias1", "field3", false);
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "eq", field: "field3", value: false });
            });
        });
        describe("NotEquals", () => {
            it("string value", () => {
                var clause = new NotEqualsClauseInTrigger("alias1", "field1", "hoge");
                expect(triggerClauseToJson(clause)).to.deep.equal({ type: "not", clause: { alias: "alias1", type: "eq", field: "field1", value: "hoge" } });
            });
            it("number value", () => {
                var clause = new NotEqualsClauseInTrigger("alias1", "field2", 1234.5);
                expect(triggerClauseToJson(clause)).to.deep.equal({ type: "not", clause: { alias: "alias1", type: "eq", field: "field2", value: 1234.5 } });
            });
            it("boolean value", () => {
                var clause = new NotEqualsClauseInTrigger("alias1", "field3", false);
                expect(triggerClauseToJson(clause)).to.deep.equal({ type: "not", clause: { alias: "alias1", type: "eq", field: "field3", value: false } });
            });
        });
        describe("Range", () => {
            it("greaterThan", () => {
                var clause = RangeClauseInTrigger.greaterThan("alias1", "field1", 1234);
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "range", field: "field1", lowerLimit: 1234, lowerIncluded: false });
            });
            it("greaterThanEquals", () => {
                var clause = RangeClauseInTrigger.greaterThanEquals("alias1", "field2", 1234);
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "range", field: "field2", lowerLimit: 1234, lowerIncluded: true });
            });
            it("lessThan", () => {
                var clause = RangeClauseInTrigger.lessThan("alias1", "field3", 1234);
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "range", field: "field3", upperLimit: 1234, upperIncluded: false });
            });
            it("lessThanEquals", () => {
                var clause = RangeClauseInTrigger.lessThanEquals("alias1", "field4", 1234);
                expect(triggerClauseToJson(clause)).to.deep.equal({ alias: "alias1", type: "range", field: "field4", upperLimit: 1234, upperIncluded: true });
            });
        });
        describe("And", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInTrigger("alias1", "field1", "hoge");
                var clause2 = new NotEqualsClauseInTrigger("alias1", "field2", 1234.5);
                var clause3 = RangeClauseInTrigger.lessThan("alias1", "field3", 1234);
                var clause4 = RangeClauseInTrigger.lessThanEquals("alias1", "field4", 1234);
                var clause = new AndClauseInTrigger(clause1, clause2, clause3, clause4);
                expect(triggerClauseToJson(clause)).to.deep.equal(
                    {
                        type: "and",
                        clauses: [
                            { alias: "alias1", type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { alias: "alias1", type: "eq", field: "field2", value: 1234.5 } },
                            { alias: "alias1", type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { alias: "alias1", type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    });
            });
        });
        describe("Or", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInTrigger("alias1", "field1", "hoge");
                var clause2 = new NotEqualsClauseInTrigger("alias1", "field2", 1234.5);
                var clause3 = RangeClauseInTrigger.lessThan("alias1", "field3", 1234);
                var clause4 = RangeClauseInTrigger.lessThanEquals("alias1", "field4", 1234);
                var clause = new OrClauseInTrigger(clause1, clause2, clause3, clause4);
                expect(triggerClauseToJson(clause)).to.deep.equal(
                    {
                        type: "or",
                        clauses: [
                            { alias: "alias1", type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { alias: "alias1", type: "eq", field: "field2", value: 1234.5 } },
                            { alias: "alias1", type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { alias: "alias1", type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    });
            });
        });
        describe("return null", () => {
            it("provide with non TriggerClause object should return null", () => {
                expect(triggerClauseToJson(<any>{})).null;
            })
        })
    })

    describe("Test jsonToTriggerClause()", () => {
        describe("Equals", () => {
            it("string value", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "eq",
                        field: "field1",
                        value: "hoge"
                    }))
                    .deep.equal(new EqualsClauseInTrigger("alias1", "field1", "hoge"));
            });
            it("number value", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "eq",
                        field: "field2",
                        value: 1234.5
                    }))
                    .deep.equal(new EqualsClauseInTrigger("alias1", "field2", 1234.5));
            });
            it("boolean value", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "eq",
                        field: "field3",
                        value: false
                    }))
                    .deep.equal(new EqualsClauseInTrigger("alias1", "field3", false));
            });
        });
        describe("NotEquals", () => {
            it("string value", () => {
                expect(jsonToTriggerClause(
                    {
                        type: "not",
                        clause: {
                            alias: "alias1",
                            type: "eq",
                            field: "field1",
                            value: "hoge"
                        }
                    }))
                    .deep.equal(new NotEqualsClauseInTrigger("alias1", "field1", "hoge"));
            });
            it("number value", () => {
                expect(jsonToTriggerClause(
                    {
                        type: "not",
                        clause:
                        {
                            alias: "alias1",
                            type: "eq",
                            field: "field2",
                            value: 1234.5
                        }
                    }))
                    .deep.equal(new NotEqualsClauseInTrigger("alias1", "field2", 1234.5));
            });
            it("boolean value", () => {
                expect(jsonToTriggerClause(
                    {
                        type: "not",
                        clause:
                        {
                            alias: "alias1",
                            type: "eq",
                            field: "field3",
                            value: false
                        }
                    }))
                    .deep.equal(new NotEqualsClauseInTrigger("alias1", "field3", false));
            });
        });
        describe("Range", () => {
            it("greaterThan", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "range",
                        field: "field1",
                        lowerLimit: 1234,
                        lowerIncluded: false
                    }))
                    .deep.equal(RangeClauseInTrigger.greaterThan("alias1", "field1", 1234));
            });
            it("greaterThanEquals", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "range",
                        field: "field2",
                        lowerLimit: 1234,
                        lowerIncluded: true
                    }))
                    .deep.equal(RangeClauseInTrigger.greaterThanEquals("alias1", "field2", 1234));
            });
            it("lessThan", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "range",
                        field: "field3",
                        upperLimit: 1234,
                        upperIncluded: false
                    }))
                    .deep.equal(RangeClauseInTrigger.lessThan("alias1", "field3", 1234));
            });
            it("lessThanEquals", () => {
                expect(jsonToTriggerClause(
                    {
                        alias: "alias1",
                        type: "range",
                        field: "field4",
                        upperLimit: 1234,
                        upperIncluded: true
                    }))
                    .deep.equal(RangeClauseInTrigger.lessThanEquals("alias1", "field4", 1234));
            });
        });
        describe("And", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInTrigger("alias1", "field1", "hoge");
                var clause2 = new NotEqualsClauseInTrigger("alias1", "field2", 1234.5);
                var clause3 = RangeClauseInTrigger.lessThan("alias1", "field3", 1234);
                var clause4 = RangeClauseInTrigger.lessThanEquals("alias1", "field4", 1234);
                var clause = new AndClauseInTrigger(clause1, clause2, clause3, clause4);
                expect(jsonToTriggerClause(
                    {
                        type: "and",
                        clauses: [
                            { alias: "alias1", type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { alias: "alias1", type: "eq", field: "field2", value: 1234.5 } },
                            { alias: "alias1", type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { alias: "alias1", type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    })).deep.equal(clause);
            });
        });
        describe("Or", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInTrigger("alias1", "field1", "hoge");
                var clause2 = new NotEqualsClauseInTrigger("alias1", "field2", 1234.5);
                var clause3 = RangeClauseInTrigger.lessThan("alias1", "field3", 1234);
                var clause4 = RangeClauseInTrigger.lessThanEquals("alias1", "field4", 1234);
                var clause = new OrClauseInTrigger(clause1, clause2, clause3, clause4);
                expect(jsonToTriggerClause(
                    {
                        type: "or",
                        clauses: [
                            { alias: "alias1", type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { alias: "alias1", type: "eq", field: "field2", value: 1234.5 } },
                            { alias: "alias1", type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { alias: "alias1", type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    })).deep.equal(clause);
            });
        });
    })

})