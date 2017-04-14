/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import CommandOps from '../../src/ops/CommandOps'
import {default as request} from '../../src/ops/Request'
import {APIAuthor} from '../../src/APIAuthor'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import {TypedID, Types} from '../../src/TypedID'
import * as Options from '../../src/RequestObjects'
import {Command, CommandState} from '../../src/Command'
import {QueryResult} from '../../src/QueryResult'
import * as TestUtil from './utils/TestUtil'

import * as nock from 'nock'
import { AliasAction, Action } from '../../src/AliasAction';
import { AliasActionResult, ActionResult } from '../../src/AliasActionResult';
let scope : nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let targetID = new TypedID(Types.Thing, "dummyid");
let cmdOp = new CommandOps(au, targetID);

describe("Test CommandOps", function() {
    describe("Test CommandOps#PostNewCommand", function() {
        describe("Validate parameters", function () {
            class TestCase {
                constructor(
                    public actions: any,
                    public issuerID: any,
                    public expectedError: string
                ){}
            }
            let tests: Array<TestCase> = [
                new TestCase(null, new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase([new AliasAction("alias1",[new Action("turnPower", true)])], null, Errors.ArgumentError),
                new TestCase([new AliasAction("alias1",[new Action("turnPower", true)])], {id: "dummyID"}, Errors.ArgumentError)
            ]

            tests.forEach(function(test) {
                it("when actions ="+JSON.stringify(test.actions)
                    +", issuerID ="+JSON.stringify(test.issuerID) + ", "
                    +test.expectedError+" error should be returned",
                    function (done) {
                    cmdOp.postNewCommand(new Options.PostCommandRequest(
                        test.actions,
                        test.issuerID))
                    .then(()=>{
                        done("should fail");
                    }).catch((err)=>{
                        expect(err.name).to.equal(test.expectedError);
                        done();
                    })
                })
            })
        })
        describe("handle http response", function() {
            let path = `/thing-if/apps/${testApp.appID}/targets/${targetID.toString()}/commands`;
            let expectedReqHeaders = {
                "Content-Type": "application/json",
                "Authorrization": `Bearer ${au.token}`
            };
            let issuerUserID = "123456"
            let expectedReqBody:any = {
                schema: "led",
                schemaVersion: 1,
                actions: [{"alias1":[{turnPower: {power: true}}]}],
                issuer: `user:${issuerUserID}`,
                title: "title of led",
                description: "represent led",
                metadata: {"power": "true for power on, and false for power off"}
            }
            let expectedCommandID = "2334354545";

            beforeEach(function() {
                nock.cleanAll();
            });

            it("handle success response", function (done) {
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(path)
                    .reply(
                        201,
                        {commandID: expectedCommandID},
                        {"Content-Type": "application/json"}
                    );
                var issuerID = new TypedID(Types.User, issuerUserID);
                var cmdRequest = new Options.PostCommandRequest(
                    [new AliasAction("alias1", [new Action("turnPower", true)])],
                    issuerID,
                    expectedReqBody.title,
                    expectedReqBody.description,
                    expectedReqBody.metadata);
                cmdOp.postNewCommand(cmdRequest).then((cmd)=>{
                    expect(cmd.commandID).to.be.equal(expectedCommandID);
                    expect(cmd.aliasActions).to.be.deep.equal([new AliasAction("alias1", [new Action("turnPower", true)])]);
                    expect(cmd.aliasActionResults).to.be.undefined;
                    expect(cmd.commandState).to.be.undefined;
                    expect(cmd.title).to.be.equal(expectedReqBody.title);
                    expect(cmd.description).to.be.equal(expectedReqBody.description);
                    expect(cmd.metadata).to.be.deep.equal(expectedReqBody.metadata);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

            it("handle 400 response", function (done) {
                var errResponse:any = {
                    "errorCode": "WRONG_COMMAND",
                    "message": "At least one action is required"
                }
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(path)
                    .reply(
                        400,
                        errResponse,
                        {"Content-Type": "application/json"}
                    );
                var issuerID = new TypedID(Types.User, issuerUserID);
                var cmdRequest = new Options.PostCommandRequest(
                    [],
                    issuerID);
                cmdOp.postNewCommand(cmdRequest).then((cmd)=>{
                    done("should fail");
                }).catch((err:HttpRequestError)=>{
                    expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                    expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                    expect(err.body.message).to.be.equal(errResponse.message);
                    expect(err.status).to.equal(400);
                    expect(err.name).to.equal(Errors.HttpError);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

        })
    })

    describe("Test CommandOps#getCommand", function() {
        describe("Validate parameter", function () {
            class TestCase{
                constructor(
                    public commandID: any,
                    public expectedError: string
                ){}
            }
            let tests = [
                new TestCase("", Errors.ArgumentError),
                new TestCase(null, Errors.ArgumentError),
                new TestCase({}, Errors.ArgumentError)
            ]
            tests.forEach(function (test) {
                it("When commandID="+test.commandID+", "
                    +test.expectedError+" error should be returned", function(done) {
                    cmdOp.getCommand(test.commandID).then(()=>{
                        done("should fail");
                    }).catch((err)=>{
                        expect(err.name).to.be.equal(test.expectedError);
                        done();
                    }).catch((err)=>{
                        done(err);
                    })
                });
            });
        });

        describe("handle http response", function() {
            let commandID = "3f2c4b10-4e26-11e6-ae54-22000ad9156c"
            let path = `/thing-if/apps/${testApp.appID}/targets/${targetID.toString()}/commands/${commandID}`;
            let expectedReqHeaders = {
                "Content-Type": "application/json",
                "Authorrization": `Bearer ${au.token}`
            };
            let issuerUserID = "123456"

            beforeEach(function() {
                nock.cleanAll();
            });
            it("handle success respones", function(done) {
                let date = new Date();
                let responseBody:any = {
                    "schema": "LED",
                    "schemaVersion": 1,
                    "target": "thing:"+targetID.id,
                    "commandState": "SENDING",
                    "issuer": "user:"+issuerUserID,
                    "actions":[ {"alias1": [
                        {
                        "changeColor": {
                            "Red": 0,
                            "White": 0,
                            "Blue": 50,
                            "Green": 0
                        }
                        }
                    ]}],
                    "actionResults": [{"alias1":[
                    {
                        "changeColor":  {
                            "succeeded":true,
                            "errorMessage":"",
                            "data":{
                                "Red": 0,
                                "White": 0,
                                "Blue": 50,
                                "Green": 0
                            }
                        }
                    }]}],
                    "commandID": commandID,
                    "createdAt": date.getTime(),
                    "modifiedAt": date.getTime(),
                    "firedByTriggerID": "0cjc20jc20immc3mic2mi0c2",
                    "title": "Turn and set brightness",
                    "description": "Turns light on and set to full brightness",
                    "metadata": {"brightness":"full brightness"}
                }

                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .get(path)
                    .reply(
                        200,
                        responseBody,
                        {"Content-Type": "application/json"}
                    );
                cmdOp.getCommand(commandID).then((cmd)=>{
                    expect(cmd.commandID).to.be.equal(commandID);
                    expect(cmd.aliasActions).to.be.deep.equal(
                        [new AliasAction("alias1", [
                            new Action("changeColor", {Red: 0, White:0, Blue:50, Green:0})
                            ])
                        ]
                    );
                    expect(cmd.aliasActionResults).to.be.deep.equal([
                        new AliasActionResult("alias1", [
                            new ActionResult(
                                "changeColor",
                                true, {
                                "Red": 0,
                                "White": 0,
                                "Blue": 50,
                                "Green": 0
                                }, "")
                        ])
                    ]);
                    expect(cmd.commandState).to.be.equal(CommandState.SENDING);
                    expect(TestUtil.sameDate(cmd.modified, date)).to.true;
                    expect(TestUtil.sameDate(cmd.created, date));
                    expect(cmd.title).to.be.equal(responseBody.title);
                    expect(cmd.description).to.be.equal(responseBody.description);
                    expect(cmd.metadata).to.be.deep.equal(responseBody.metadata);
                    expect(cmd.firedByTriggerID).to.be.equal(responseBody.firedByTriggerID);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

            it("handle 404 respones", function(done) {
                let date = new Date();
                let errResponse:any = {
                "errorCode": "COMMAND_NOT_FOUND",
                "message": `Command ${commandID} not found`
                }

                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .get(path)
                    .reply(
                        404,
                        errResponse,
                        {"Content-Type": "application/json"}
                    );
                cmdOp.getCommand(commandID).then(()=>{
                    done("should fail");
                }).catch((err:HttpRequestError)=>{
                    expect(err.status).to.be.equal(404);
                    expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                    expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                    expect(err.body.message).to.be.equal(errResponse.message);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
        })
    })

    describe("Test CommandOps#listCommand", function() {

        describe("handle http response", function() {

            let path = `/thing-if/apps/${testApp.appID}/targets/${targetID.toString()}/commands`;
            let expectedReqHeaders = {
                "Content-Type": "application/json",
                "Authorrization": `Bearer ${au.token}`
            };
            let issuerUserID = "123456"

            beforeEach(function() {
                    nock.cleanAll();
            });

            describe("handle success response", function() {

                class TestCase {
                        constructor(
                            public paginationKey: any,
                            public bestEffortLimit: any,
                            public expectedQueryObject: Object
                        ){}
                    }
                let tests = [
                    new TestCase('200/1', 1, {paginationKey: "200/1", bestEffortLimit: 1}),
                    new TestCase(null, 1, {bestEffortLimit:1}),
                    new TestCase('200/1', null, {paginationKey:"200/1"}),
                    new TestCase(null, null, {}),

                ];

                tests.forEach(function(test) {
                    it("when paginationKey="+test.paginationKey+", bestEffortLimit="+test.bestEffortLimit, function(done) {
                        let responseBody:any = {
                            "commands":[
                                {
                                    "target": "thing:"+targetID.id,
                                    "commandState": "SENDING",
                                    "issuer": "user:"+issuerUserID,
                                    "actions": [{"alias1":[{"turnPower": true}]}],
                                    "commandID": "id1",
                                    "createdAt": (new Date()).getTime(),
                                    "modifiedAt": (new Date()).getTime(),
                                },
                                {
                                    "target": "thing:"+targetID.id,
                                    "commandState": "SENDING",
                                    "issuer": "user:"+issuerUserID,
                                    "actions": [{"alias1":[{"turnPower": false}]}],
                                    "commandID": "id2",
                                    "createdAt": (new Date()).getTime(),
                                    "modifiedAt": (new Date()).getTime(),
                                },
                            ],
                            "nextPaginationKey": "200/2"
                        }

                        scope = nock(testApp.site, <any>expectedReqHeaders)
                            .get(path)
                            .query(test.expectedQueryObject)
                            .reply(
                                200,
                                responseBody,
                                {"Content-Type": "application/json"}
                            );
                        cmdOp.listCommands(new Options.ListQueryOptions(test.bestEffortLimit, test.paginationKey)).then((result: QueryResult<Command>)=>{
                            expect(result.hasNext).to.be.true;
                            expect(result.paginationKey).to.be.equal(responseBody.nextPaginationKey);
                            expect(result.results.length).to.be.equal(2);

                            //validate first command
                            var cmd1 = result.results[0];
                            var expectedCmd1 = responseBody.commands[0];
                            expect(cmd1.commandID).to.be.equal(expectedCmd1.commandID);
                            expect(cmd1.aliasActions).to.be.deep.equal([
                                new AliasAction("alias1", [new Action("turnPower", true)])
                            ]);
                            expect(cmd1.aliasActionResults).to.undefined;
                            expect(cmd1.commandState).to.be.equal(CommandState.SENDING);
                            expect(TestUtil.sameDate(cmd1.modified, new Date(expectedCmd1.modifiedAt))).to.true;
                            expect(TestUtil.sameDate(cmd1.created, new Date(expectedCmd1.createdAt))).to.true;
                            expect(cmd1.title).to.be.equal(expectedCmd1.title);
                            expect(cmd1.description).to.be.equal(expectedCmd1.description);
                            expect(cmd1.metadata).to.be.deep.equal(expectedCmd1.metadata);
                            expect(cmd1.firedByTriggerID).to.be.equal(expectedCmd1.firedByTriggerID);

                            //validate second command
                            var cmd2 = result.results[1];
                            var expectedCmd2 = responseBody.commands[1];
                            expect(cmd2.commandID).to.be.equal(expectedCmd2.commandID);
                            expect(cmd2.aliasActions).to.be.deep.equal([
                                new AliasAction("alias1", [new Action("turnPower", false)])
                            ]);
                            expect(cmd2.aliasActionResults).undefined;
                            expect(cmd2.commandState).to.be.equal(CommandState.SENDING);
                            expect(TestUtil.sameDate(cmd2.modified, new Date(expectedCmd2.modifiedAt))).to.true;
                            expect(TestUtil.sameDate(cmd2.created, new Date(expectedCmd2.createdAt))).to.true;
                            expect(cmd2.title).to.be.equal(expectedCmd2.title);
                            expect(cmd2.description).to.be.equal(expectedCmd2.description);
                            expect(cmd2.metadata).to.be.deep.equal(expectedCmd2.metadata);
                            expect(cmd2.firedByTriggerID).to.be.equal(expectedCmd2.firedByTriggerID);

                            done();
                        }).catch((err)=>{
                            done(err);
                        })
                    })
                })
            })

            describe("handle err response", function() {
                it("handle 404 respones", function(done) {
                    let date = new Date();
                    let errResponse:any = {
                        "errorCode": "TARGET_NOT_FOUND",
                        "message": `Target ${targetID.toString()} not found`
                    }

                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .get(path)
                        .reply(
                            404,
                            errResponse,
                            {"Content-Type": "application/json"}
                        );
                    cmdOp.listCommands().then(()=>{
                        done("should fail");
                    }).catch((err:HttpRequestError)=>{
                        expect(err.status).to.be.equal(404);
                        expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                        expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                        expect(err.body.message).to.be.equal(errResponse.message);
                        done();
                    }).catch((err)=>{
                        done(err);
                    })
                })
            })
        })
    })
})
