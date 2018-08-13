/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../../node_modules/@types/simple-mock/index.d.ts" />

import {Promise as P} from 'es6-promise'
import {expect} from 'chai';
import TestApp from '../TestApp'
import {ThingIFAPI} from '../../../src/ThingIFAPI';
import {TypedID} from '../../../src/TypedID';
import {Types} from '../../../src/TypedID';
import {ListQueryOptions} from '../../../src/RequestObjects';
import TriggerOps from '../../../src/ops/TriggerOps'
import {ThingIFError, HttpRequestError, Errors} from '../../../src/ThingIFError';
import {ServerCodeResult, ServerError} from '../../../src/ServerCodeResult'
import {QueryResult} from '../../../src/QueryResult'
import * as simple from 'simple-mock';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let triggerID = "dummy-trigger-id";

describe("Small Test ThingIFAPI#listServerCodeResults", function() {
    describe("handle IllegalStateError", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            thingIFAPI.listServerCodeExecutionResults(triggerID)
            .then((result)=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("handle http response", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app, target);
        describe("hanle success response", function(){
            let result1 = new ServerCodeResult(true,100, 1469102511270, "server_function1", null);
            let result2 = new ServerCodeResult(false, null, 1469102511271, "server_function2",
                new ServerError(
                    "RUNTIME_ERROR",
                    "Error found while executing the developer-defined code",
                    JSON.stringify({
                        errorCode : "RUNTIME_ERROR",
                        message : "adminContext is not defined"
                    })
                ))

            let expectedResults = new QueryResult<ServerCodeResult>([result1, result2], "200/1")
            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'listServerCodeResults').returnWith(
                    new P<QueryResult<ServerCodeResult>>((resolve, reject)=>{
                        resolve(expectedResults);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.listServerCodeExecutionResults(triggerID)
                .then((results: QueryResult<ServerCodeResult>)=>{
                    expect(results).to.be.deep.equal(expectedResults);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.listServerCodeExecutionResults(triggerID, null, (err, results)=>{
                    try{
                        expect(err).to.null;
                        expect(results).to.be.deep.equal(expectedResults);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(401, Errors.HttpError, {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid"
            })

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'listServerCodeResults').returnWith(
                    new P<QueryResult<ServerCodeResult>>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.listServerCodeExecutionResults(triggerID)
                .then((results)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.listServerCodeExecutionResults(triggerID, null, (err, results)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(results).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })
})