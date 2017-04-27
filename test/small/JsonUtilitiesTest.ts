/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import { expect } from 'chai';
import {
    actionToJson,
    jsonToAction,
    aliasActionToJson,
    jsonToAliasAction,
    jsonToActionResult,
    jsonToAliasActionResult,
    triggerClauseToJson,
    jsonToTriggerClause,
    triggeredCommandToJson,
    jsonToTrigger,
    predicateToJson,
    jsonToPredicate,
    serverCodeToJson,
    jsonToServerCode,
    jsonToQueryClause,
    queryClauseToJson
 } from '../../src/internal/JsonUtilities';
import { Action, AliasAction } from '../../src/AliasAction';
import { ActionResult, AliasActionResult } from '../../src/AliasActionResult';
import { EqualsClauseInTrigger, NotEqualsClauseInTrigger, RangeClauseInTrigger, AndClauseInTrigger, OrClauseInTrigger } from '../../src/TriggerClause';
import { EqualsClauseInQuery, NotEqualsClauseInQuery, RangeClauseInQuery, AndClauseInQuery, OrClauseInQuery } from '../../src/QueryClause';

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

describe("Test JsonUtilities for Predicate", () => {
    describe("Test predicateToJson()", () => {
        it("provides not suppert object should return null", () => {
            expect(predicateToJson(<any>{})).null;
        })
        it("provides statePredicate expected json should be returned", () => {
            expect(predicateToJson(new StatePredicate(
                new Condition(new EqualsClauseInTrigger("alias", "turnPower", true)),
                TriggersWhen.CONDITION_CHANGED
            ))).deep.equal({
                condition: { alias: "alias", type: "eq", field: "turnPower", value: true },
                triggersWhen: "CONDITION_CHANGED",
                eventSource: "STATES"
            })
            expect(predicateToJson(new StatePredicate(
                new Condition(new EqualsClauseInTrigger("alias", "turnPower", true)),
                TriggersWhen.CONDITION_FALSE_TO_TRUE
            ))).deep.equal({
                condition: { alias: "alias", type: "eq", field: "turnPower", value: true },
                triggersWhen: "CONDITION_FALSE_TO_TRUE",
                eventSource: "STATES"
            })
            expect(predicateToJson(new StatePredicate(
                new Condition(new EqualsClauseInTrigger("alias", "turnPower", true)),
                TriggersWhen.CONDITION_TRUE
            ))).deep.equal({
                condition: { alias: "alias", type: "eq", field: "turnPower", value: true },
                triggersWhen: "CONDITION_TRUE",
                eventSource: "STATES"
            })
        })
        it("provides schedulePredicate expected json should be returned", () => {
            expect(predicateToJson(new SchedulePredicate("0 12 1 * *"))).deep.equal({
                eventSource: "SCHEDULE",
                schedule: "0 12 1 * *"
            })
        })
        it("provides scheduleOncePredicate expected json should be returned", () => {
            expect(predicateToJson(new ScheduleOncePredicate(10))).deep.equal({
                eventSource: "SCHEDULE_ONCE",
                scheduleAt: 10
            })
        })
    })
    describe("Test jsonToPredicate()", () => {
        it("provides invalid json should return null", () => {
            expect(jsonToPredicate({})).null;
        })
        it("provides statePredicate json expected predicate should be returned", () => {
            expect(jsonToPredicate({
                condition: { alias: "alias", type: "eq", field: "turnPower", value: true },
                triggersWhen: "CONDITION_CHANGED",
                eventSource: "STATES"
            })).deep.equal(new StatePredicate(
                new Condition(new EqualsClauseInTrigger("alias", "turnPower", true)),
                TriggersWhen.CONDITION_CHANGED
            ))
            expect(jsonToPredicate({
                condition: { alias: "alias", type: "eq", field: "turnPower", value: true },
                triggersWhen: "CONDITION_FALSE_TO_TRUE",
                eventSource: "STATES"
            })).deep.equal(new StatePredicate(
                new Condition(new EqualsClauseInTrigger("alias", "turnPower", true)),
                TriggersWhen.CONDITION_FALSE_TO_TRUE
            ))
            expect(jsonToPredicate({
                condition: { alias: "alias", type: "eq", field: "turnPower", value: true },
                triggersWhen: "CONDITION_TRUE",
                eventSource: "STATES"
            })).deep.equal(new StatePredicate(
                new Condition(new EqualsClauseInTrigger("alias", "turnPower", true)),
                TriggersWhen.CONDITION_TRUE
            ))
        })
        it("provides schedulePredicate json expected predicate should be returned", () => {
            expect(jsonToPredicate({
                eventSource: "SCHEDULE",
                schedule: "0 12 1 * *"
            })).deep.equal(new SchedulePredicate("0 12 1 * *"))
        })
        it("provides scheduleOncePredicate expected json should be returned", () => {
            expect(jsonToPredicate({
                eventSource: "SCHEDULE_ONCE",
                scheduleAt: 10
            })).deep.equal(new ScheduleOncePredicate(10))
        })
    })
})

describe("Test JsonUtilities for ServerCode", () => {
    describe("Test serverCodeToJson()", () => {
        it("provides serverCode object expected json should be returned", () => {
            expect(serverCodeToJson(new ServerCode("endpoint-1", "token", "app", { param1: "value" })))
                .deep.equal({
                    endpoint: "endpoint-1",
                    executorAccessToken: "token",
                    targetAppID: "app",
                    parameters: { param1: "value" }
                })
        })
    })

    describe("Test jsonToServerCode()", () => {
        it("provide invalid json should return null", () => {
            expect(jsonToServerCode({})).null;
        })
        it("provide valid json expected server code should be returned", () => {
            expect(jsonToServerCode({
                endpoint: "endpoint-1",
                executorAccessToken: "token",
                targetAppID: "app",
                parameters: { param1: "value" }
            })).deep.equal(new ServerCode("endpoint-1", "token", "app", { param1: "value" }));
        })
    })
})

describe('Test JsonUtilities for QueryClause', () => {
    describe("Test queryClauseToJson()", () => {
        describe("Equals", () => {
            it("string value", () => {
                var clause = new EqualsClauseInQuery("field1", "hoge");
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "eq", field: "field1", value: "hoge" });
            });
            it("number value", () => {
                var clause = new EqualsClauseInQuery("field2", 1234.5);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "eq", field: "field2", value: 1234.5 });
            });
            it("boolean value", () => {
                var clause = new EqualsClauseInQuery("field3", false);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "eq", field: "field3", value: false });
            });
        });
        describe("NotEquals", () => {
            it("string value", () => {
                var clause = new NotEqualsClauseInQuery("field1", "hoge");
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "not", clause: { type: "eq", field: "field1", value: "hoge" } });
            });
            it("number value", () => {
                var clause = new NotEqualsClauseInQuery("field2", 1234.5);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "not", clause: { type: "eq", field: "field2", value: 1234.5 } });
            });
            it("boolean value", () => {
                var clause = new NotEqualsClauseInQuery("field3", false);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "not", clause: { type: "eq", field: "field3", value: false } });
            });
        });
        describe("Range", () => {
            it("greaterThan", () => {
                var clause = RangeClauseInQuery.greaterThan("field1", 1234);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "range", field: "field1", lowerLimit: 1234, lowerIncluded: false });
            });
            it("greaterThanEquals", () => {
                var clause = RangeClauseInQuery.greaterThanEquals("field2", 1234);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "range", field: "field2", lowerLimit: 1234, lowerIncluded: true });
            });
            it("lessThan", () => {
                var clause = RangeClauseInQuery.lessThan("field3", 1234);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "range", field: "field3", upperLimit: 1234, upperIncluded: false });
            });
            it("lessThanEquals", () => {
                var clause = RangeClauseInQuery.lessThanEquals("field4", 1234);
                expect(queryClauseToJson(clause)).to.deep.equal({ type: "range", field: "field4", upperLimit: 1234, upperIncluded: true });
            });
        });
        describe("And", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInQuery("field1", "hoge");
                var clause2 = new NotEqualsClauseInQuery("field2", 1234.5);
                var clause3 = RangeClauseInQuery.lessThan("field3", 1234);
                var clause4 = RangeClauseInQuery.lessThanEquals("field4", 1234);
                var clause = new AndClauseInQuery(clause1, clause2, clause3, clause4);
                expect(queryClauseToJson(clause)).to.deep.equal(
                    {
                        type: "and",
                        clauses: [
                            { type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { type: "eq", field: "field2", value: 1234.5 } },
                            { type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    });
            });
        });
        describe("Or", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInQuery("field1", "hoge");
                var clause2 = new NotEqualsClauseInQuery("field2", 1234.5);
                var clause3 = RangeClauseInQuery.lessThan("field3", 1234);
                var clause4 = RangeClauseInQuery.lessThanEquals("field4", 1234);
                var clause = new OrClauseInQuery(clause1, clause2, clause3, clause4);
                expect(queryClauseToJson(clause)).to.deep.equal(
                    {
                        type: "or",
                        clauses: [
                            { type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { type: "eq", field: "field2", value: 1234.5 } },
                            { type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    });
            });
        });
        describe("return null", () => {
            it("provide with non QueryClause object should return null", () => {
                expect(queryClauseToJson(<any>{})).null;
            })
        })
    })

    describe("Test jsonToQueryClause()", () => {
        describe("Equals", () => {
            it("string value", () => {
                expect(jsonToQueryClause(
                    {
                        type: "eq",
                        field: "field1",
                        value: "hoge"
                    }))
                    .deep.equal(new EqualsClauseInQuery("field1", "hoge"));
            });
            it("number value", () => {
                expect(jsonToQueryClause(
                    {
                        type: "eq",
                        field: "field2",
                        value: 1234.5
                    }))
                    .deep.equal(new EqualsClauseInQuery("field2", 1234.5));
            });
            it("boolean value", () => {
                expect(jsonToQueryClause(
                    {
                        type: "eq",
                        field: "field3",
                        value: false
                    }))
                    .deep.equal(new EqualsClauseInQuery("field3", false));
            });
        });
        describe("NotEquals", () => {
            it("string value", () => {
                expect(jsonToQueryClause(
                    {
                        type: "not",
                        clause: {
                            type: "eq",
                            field: "field1",
                            value: "hoge"
                        }
                    }))
                    .deep.equal(new NotEqualsClauseInQuery("field1", "hoge"));
            });
            it("number value", () => {
                expect(jsonToQueryClause(
                    {
                        type: "not",
                        clause:
                        {
                            type: "eq",
                            field: "field2",
                            value: 1234.5
                        }
                    }))
                    .deep.equal(new NotEqualsClauseInQuery("field2", 1234.5));
            });
            it("boolean value", () => {
                expect(jsonToQueryClause(
                    {
                        type: "not",
                        clause:
                        {
                            type: "eq",
                            field: "field3",
                            value: false
                        }
                    }))
                    .deep.equal(new NotEqualsClauseInQuery("field3", false));
            });
        });
        describe("Range", () => {
            it("greaterThan", () => {
                expect(jsonToQueryClause(
                    {
                        type: "range",
                        field: "field1",
                        lowerLimit: 1234,
                        lowerIncluded: false
                    }))
                    .deep.equal(RangeClauseInQuery.greaterThan("field1", 1234));
            });
            it("greaterThanEquals", () => {
                expect(jsonToQueryClause(
                    {
                        type: "range",
                        field: "field2",
                        lowerLimit: 1234,
                        lowerIncluded: true
                    }))
                    .deep.equal(RangeClauseInQuery.greaterThanEquals("field2", 1234));
            });
            it("lessThan", () => {
                expect(jsonToQueryClause(
                    {
                        type: "range",
                        field: "field3",
                        upperLimit: 1234,
                        upperIncluded: false
                    }))
                    .deep.equal(RangeClauseInQuery.lessThan("field3", 1234));
            });
            it("lessThanEquals", () => {
                expect(jsonToQueryClause(
                    {
                        type: "range",
                        field: "field4",
                        upperLimit: 1234,
                        upperIncluded: true
                    }))
                    .deep.equal(RangeClauseInQuery.lessThanEquals("field4", 1234));
            });
        });
        describe("And", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInQuery("field1", "hoge");
                var clause2 = new NotEqualsClauseInQuery("field2", 1234.5);
                var clause3 = RangeClauseInQuery.lessThan("field3", 1234);
                var clause4 = RangeClauseInQuery.lessThanEquals("field4", 1234);
                var clause = new AndClauseInQuery(clause1, clause2, clause3, clause4);
                expect(jsonToQueryClause(
                    {
                        type: "and",
                        clauses: [
                            { type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { type: "eq", field: "field2", value: 1234.5 } },
                            { type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    })).deep.equal(clause);
            });
        });
        describe("Or", () => {
            it("multiple clauses", () => {
                var clause1 = new EqualsClauseInQuery("field1", "hoge");
                var clause2 = new NotEqualsClauseInQuery("field2", 1234.5);
                var clause3 = RangeClauseInQuery.lessThan("field3", 1234);
                var clause4 = RangeClauseInQuery.lessThanEquals("field4", 1234);
                var clause = new OrClauseInQuery(clause1, clause2, clause3, clause4);
                expect(jsonToQueryClause(
                    {
                        type: "or",
                        clauses: [
                            { type: "eq", field: "field1", value: "hoge" },
                            { type: "not", clause: { type: "eq", field: "field2", value: 1234.5 } },
                            { type: "range", field: "field3", upperLimit: 1234, upperIncluded: false },
                            { type: "range", field: "field4", upperLimit: 1234, upperIncluded: true }
                        ]
                    })).deep.equal(clause);
            });
        });
    })

})