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
import MqttInstallationResult from '../../src/MqttInstallationResult'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import {TypedID, Types} from '../../src/TypedID'
import * as Options from '../../src/RequestObjects'

import * as nock from 'nock'
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
                    public schema: any,
                    public schemeVersion: any,
                    public actions: any,
                    public issuerID: any,
                    public expectedError: string
                ){}
            }
            let tests: Array<TestCase> = [
                new TestCase(null, 1, [{"turnPower": {"power": true}}], new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase("LED schema", null, [{"turnPower":{"power":true}}], new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase("LED schema", 1, null, new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase("LED schema", 1, [{"turnPower":{"power":true}}], null, Errors.ArgumentError),
                new TestCase({}, 1, {}, new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase("LED schema", "1", [{"turnPower":{"power":true}}], new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase("LED schema", 1, {"turnPower": {"power": true}}, new TypedID(Types.User, "dummyID"), Errors.ArgumentError),
                new TestCase("LED schema", 1, [{"turnPower":{"power":true}}], {id: "dummyID"}, Errors.ArgumentError)
            ]

            tests.forEach(function(test) {
                it("when schema="+test.schema
                    +", schemeVersion ="+test.schemeVersion
                    +", actions ="+JSON.stringify(test.actions)
                    +", issuerID ="+JSON.stringify(test.issuerID) + ", "
                    +test.expectedError+" error should be returned",
                    function (done) {
                    cmdOp.postNewCommand(new Options.PostCommandRequest(
                        test.schema,
                        test.schemeVersion,
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
                actions: [{turnPower: {power: true}}],
                issuer: `user:${issuerUserID}`
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
                    expectedReqBody.schema,
                    expectedReqBody.schemaVersion,
                    expectedReqBody.actions,
                    issuerID);
                cmdOp.postNewCommand(cmdRequest).then((cmd)=>{
                    console.log(JSON.stringify(cmd));
                    expect(cmd.commandID).to.be.equal(expectedCommandID);
                    expect(cmd.schemaName).to.be.equal(expectedReqBody.schema);
                    expect(cmd.schemaVersion).to.be.equal(expectedReqBody.schemaVersion);
                    expect(cmd.actions).to.be.deep.equal(expectedReqBody.actions);
                    expect(cmd.actionResults).to.be.undefined;
                    expect(cmd.commandState).to.be.undefined;
                    expect(cmd.title).to.be.undefined;
                    expect(cmd.description).to.be.undefined;
                    expect(cmd.metadata).to.be.undefined;
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

            it("handle 400 response", function (done) {
                var errRespone = {
                    "errorCode": "WRONG_COMMAND",
                    "message": "At least one action is required"
                }
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(path)
                    .reply(
                        400,
                        errRespone,
                        {"Content-Type": "application/json"}
                    );
                var issuerID = new TypedID(Types.User, issuerUserID);
                var cmdRequest = new Options.PostCommandRequest(
                    expectedReqBody.schema,
                    expectedReqBody.schemaVersion,
                    [],
                    issuerID);
                cmdOp.postNewCommand(cmdRequest).then((cmd)=>{
                    done("should fail");
                }).catch((err:HttpRequestError)=>{
                    expect(err.body).to.deep.equal(errRespone);
                    expect(err.status).to.equal(400);
                    expect(err.name).to.equal(Errors.HttpError);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

        })
    })
})

