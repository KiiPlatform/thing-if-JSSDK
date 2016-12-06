/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import StateOps from '../../src/ops/StateOps'
import {default as request} from '../../src/ops/Request'
import {APIAuthor} from '../../src/APIAuthor'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import {TypedID, Types} from '../../src/TypedID'
import * as Options from '../../src/RequestObjects'
import * as TestUtil from './utils/TestUtil'

import * as nock from 'nock'
let scope : nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let targetID = new TypedID(Types.Thing, "dummyid");

describe("Test StateOps", function() {
    describe("Test StateOps#getState", function() {
        describe("handle http response", function() {
            let stateOp = new StateOps(au, targetID);
            let path = `/thing-if/apps/${testApp.appID}/targets/${targetID.toString()}/states`;
            let expectedReqHeaders = {
                "Authorrization": `Bearer ${au.token}`
            };
            let responseBody:any = {
                power: true
            }

            beforeEach(function() {
                nock.cleanAll();
            });

            it("handle success response", function (done) {
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .get(path)
                    .reply(
                        200,
                        responseBody,
                        {"Content-Type": "application/json"}
                    );
                stateOp.getState().then((state)=>{
                    expect(state).to.deep.equal(responseBody);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

            it("handle 404 response", function (done) {
                var errResponse = {
                    "errorCode": "TARGET_NOT_FOUND",
                    "message": `Target thing:${targetID.id} not found`
                }
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .get(path)
                    .reply(
                        404,
                        errResponse,
                        {"Content-Type": "application/json"}
                    );
                stateOp.getState().then((state)=>{
                    done("should fail");
                }).catch((err:HttpRequestError)=>{
                    expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                    expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                    expect(err.body.message).to.be.equal(errResponse.message);
                    expect(err.status).to.equal(404);
                    expect(err.name).to.equal(Errors.HttpError);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
        })

        describe("handle http response with Trait", function() {
            let alias = "DummyAlias";
            let stateOp = new StateOps(au, targetID, alias);
            let path = `/thing-if/apps/${testApp.appID}/targets/${targetID.toString()}/states/aliases/${alias}`;
            let expectedReqHeaders = {
                "Authorrization": `Bearer ${au.token}`
            };
            let responseBody:any = {
                power: true
            }

            beforeEach(function() {
                nock.cleanAll();
            });

            it("handle success response", function (done) {
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .get(path)
                    .reply(
                        200,
                        responseBody,
                        {"Content-Type": "application/vnd.kii.TraitState+json"}
                    );
                stateOp.getState().then((state)=>{
                    expect(state).to.deep.equal(responseBody);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

            it("handle 404 response", function (done) {
                var errResponse = {
                    "errorCode": "TARGET_NOT_FOUND",
                    "message": `Target thing:${targetID.id} not found`
                }
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .get(path)
                    .reply(
                        404,
                        errResponse,
                        {"Content-Type": "application/json"}
                    );
                stateOp.getState().then((state)=>{
                    done("should fail");
                }).catch((err:HttpRequestError)=>{
                    expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                    expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                    expect(err.body.message).to.be.equal(errResponse.message);
                    expect(err.status).to.equal(404);
                    expect(err.name).to.equal(Errors.HttpError);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
        })
    })

})
