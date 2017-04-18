/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import { expect } from 'chai';
import { actionToJson, jsonToAction, aliasActionToJson, jsonToAliasAction, jsonToActionResult, jsonToAliasActionResult, triggerClauseToJson, jsonToTriggerClause, triggeredCommandToJson, jsonToTrigger } from '../../src/internal/JsonUtilities';
import { Action, AliasAction } from '../../src/AliasAction';
import { ActionResult, AliasActionResult } from '../../src/AliasActionResult';
import { EqualsClauseInTrigger, NotEqualsClauseInTrigger, RangeClauseInTrigger, AndClauseInTrigger, OrClauseInTrigger } from '../../src/TriggerClause';
import { TriggerCommandObject } from '../../src/RequestObjects';
import { TypedID, Types } from '../../src/TypedID';
import { Trigger, TriggersWhen } from '../../src/Trigger';
import { StatePredicate, SchedulePredicate, ScheduleOncePredicate } from '../../src/Predicate';
import { Condition } from '../../src/Condition';
import { Command } from '../../src/Command';
import TestApp from './TestApp';
import { ServerCode } from '../../src/ServerCode';

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

describe('Test JsonUtilities for Trigger', () => {
    describe("Test triggeredCommandToJson()", () => {
        it("provide with invalid parameters should return null", () => {
            expect(triggeredCommandToJson(new TriggerCommandObject(null))).null;
            expect(triggeredCommandToJson(new TriggerCommandObject(
                [new AliasAction("alias", [new Action("turnPower", true)])],
                null,
                null
            ))).null;
            expect(triggeredCommandToJson(new TriggerCommandObject(
                [new AliasAction("alias", [new Action("turnPower", true)])],
                new TypedID(Types.Thing, "thing-1"),
                null
            ))).null;
            expect(triggeredCommandToJson(new TriggerCommandObject(
                [new AliasAction("alias", [new Action("turnPower", true)])],
                null,
                new TypedID(Types.User, "user-1")
            ))).null;
        })
        it("provide with parameters, json should be returned as expection", () => {
            expect(triggeredCommandToJson(new TriggerCommandObject(
                [new AliasAction("alias", [new Action("turnPower", true)])],
                new TypedID(Types.Thing, "thing-1"),
                new TypedID(Types.User, "user-1"),
                "title",
                "description",
                { key: "value" }
            ))).deep.equal({
                actions: [
                    { alias: [{ turnPower: true }] }
                ],
                target: "thing:thing-1",
                issuer: "user:user-1",
                title: "title",
                description: "description",
                metadata: { key: "value" }
            })
        })
    })
    describe("Test jsonToTrigger()", () => {
    let testApp = new TestApp();
        let command = new  Command(
            new TypedID(Types.Thing, "thing-1"),
            new TypedID(Types.User, "user-1"),
            [new AliasAction("alias", [new Action("turnPower", true)])]
        );
        let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
        let endpoint = "server_function";
        let parameters = {brightness : 100, color : "#FFF"};
        let serverCode = new ServerCode(endpoint, ownerToken, testApp.appID, parameters);

        let commandJson = {
            actions: [
                { alias: [{ turnPower: true }] }
            ],
            target: "thing:thing-1",
            issuer: "user:user-1"
        }
        let serverCodeJson = {
            endpoint: endpoint,
            executorAccessToken: ownerToken,
            targetAppID: testApp.appID,
            parameters: parameters
        }
        it("provide with invalid json null should be returned", () =>{
            expect(jsonToTrigger({})).null;
        })
        it("provides command trigger(StatePredicate) expected trigger should be returned", () => {
            let trigger = new Trigger(
                "trigger-1",
                new StatePredicate(
                    new Condition(new EqualsClauseInTrigger("alias", "power", true)),
                    TriggersWhen.CONDITION_FALSE_TO_TRUE
                ),
                false,
                command,
                undefined);

            expect(jsonToTrigger({
                triggerID: "trigger-1",
                predicate: {
                    eventSource: "STATES",
                    condition: { type: "eq", alias: "alias", field: "power", value: true },
                    triggersWhen: "CONDITION_FALSE_TO_TRUE"
                },
                command: commandJson,
                disabled: false
            })).deep.equal(trigger);
        })

        it("provides command trigger(schedulePredicate), excepted trigger should be returned", () => {
            let expectedTrigger = new Trigger(
                "trigger-1",
                new SchedulePredicate("0 12 1 * *"),
                true,
                command,
                undefined,
                "invalid trigger",
                "title",
                "description",
                {key: "value"}
            );
            expect(jsonToTrigger({
                triggerID: "trigger-1",
                predicate: {
                    eventSource: "SCHEDULE",
                    schedule: "0 12 1 * *"
                },
                command: commandJson,
                disabled: true,
                disabledReason: "invalid trigger",
                title: "title",
                description: "description",
                metadata: {
                    key: "value"
                }
            })).deep.equal(expectedTrigger);
        })
        it("provides command trigger(scheduleOncePredicate), excepted trigger should be returned", () => {
            let scheduleAt = new Date(1000);
            let expectedTrigger = new Trigger(
                "trigger-1",
                new ScheduleOncePredicate(scheduleAt.getTime()),
                true,
                command,
                undefined,
                "invalid trigger",
                "title",
                "description",
                {key: "value"}
            );
            expect(jsonToTrigger({
                triggerID: "trigger-1",
                predicate: {
                    eventSource: "SCHEDULE_ONCE",
                    scheduleAt: scheduleAt.getTime()
                },
                command: commandJson,
                disabled: true,
                disabledReason: "invalid trigger",
                title: "title",
                description: "description",
                metadata: {
                    key: "value"
                }
            })).deep.equal(expectedTrigger);
        })

        it("provides servercode trigger(StatePredicate) expected trigger should be returned", () => {
            let trigger = new Trigger(
                "trigger-1",
                new StatePredicate(
                    new Condition(new EqualsClauseInTrigger("alias", "power", true)),
                    TriggersWhen.CONDITION_FALSE_TO_TRUE
                ),
                false,
                undefined,
                serverCode);

            expect(jsonToTrigger({
                triggerID: "trigger-1",
                predicate: {
                    eventSource: "STATES",
                    condition: { type: "eq", alias: "alias", field: "power", value: true },
                    triggersWhen: "CONDITION_FALSE_TO_TRUE"
                },
                serverCode: serverCodeJson,
                disabled: false
            })).deep.equal(trigger);
        })

        it("provides serverCode trigger(schedulePredicate), excepted trigger should be returned", () => {
            let expectedTrigger = new Trigger(
                "trigger-1",
                new SchedulePredicate("0 12 1 * *"),
                true,
                undefined,
                serverCode,
                "invalid trigger",
                "title",
                "description",
                {key: "value"}
            );
            expect(jsonToTrigger({
                triggerID: "trigger-1",
                predicate: {
                    eventSource: "SCHEDULE",
                    schedule: "0 12 1 * *"
                },
                serverCode: serverCodeJson,
                disabled: true,
                disabledReason: "invalid trigger",
                title: "title",
                description: "description",
                metadata: {
                    key: "value"
                }
            })).deep.equal(expectedTrigger);
        })
        it("provides server code trigger(scheduleOncePredicate), excepted trigger should be returned", () => {
            let scheduleAt = new Date(1000);
            let expectedTrigger = new Trigger(
                "trigger-1",
                new ScheduleOncePredicate(scheduleAt.getTime()),
                true,
                undefined,
                serverCode,
                "invalid trigger",
                "title",
                "description",
                {key: "value"}
            );
            expect(jsonToTrigger({
                triggerID: "trigger-1",
                predicate: {
                    eventSource: "SCHEDULE_ONCE",
                    scheduleAt: scheduleAt.getTime()
                },
                serverCode: serverCodeJson,
                disabled: true,
                disabledReason: "invalid trigger",
                title: "title",
                description: "description",
                metadata: {
                    key: "value"
                }
            })).deep.equal(expectedTrigger);
        })
    })
})