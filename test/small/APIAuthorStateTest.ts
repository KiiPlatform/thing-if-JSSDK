/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {APIAuthor} from '../../src/APIAuthor'
import {TypedID, Types} from '../../src/TypedID'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import * as Options from '../../src/RequestObjects'
import StateOps from '../../src/ops/StateOps'
import * as simple from 'simple-mock';

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let au = new APIAuthor("dummy-token", testApp.app);
let target = new TypedID(Types.Thing, "dummy-thing-id");


describe("Test APIAuthor#getState without alias", function() {
    let commandID = "1234235534ferw"

    describe("handle succeeded reponse", function() {

        let expectedState = {alias1: {power: true}};

        beforeEach(function() {
            simple.mock(StateOps.prototype, 'getState').returnWith(
                new P<Object>((resolve, reject)=>{
                    resolve(expectedState);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            au.getState(target)
            .then((state)=>{
                expect(state).to.be.deep.equal(expectedState);
                done();
            }).catch((err)=>{
                done(err);
            })
        })
        it("test callback", function (done) {
            au.getState(target,null, (err, state)=>{
                try{
                    expect(err).to.null;
                    expect(state).to.be.deep.equal(expectedState);
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function() {
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "TARGET_NOT_FOUND",
            "message": `Target thing:${target.id} not found`
        });

        beforeEach(function() {
            simple.mock(StateOps.prototype, 'getState').returnWith(
                new P<Object>((resolve, reject)=>{
                    reject(expectedError);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            au.getState(target)
            .then((state)=>{
                done("should fail");
            }).catch((err: HttpRequestError)=>{
                expect(err).to.be.deep.equal(expectedError);
                done();
            })
        })
        it("test callback", function (done) {
            au.getState(target, null, (err, state)=>{
                try{
                    expect(err).to.be.deep.equal(expectedError);
                    expect(state).to.null;
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })
})

describe("Test APIAuthor#getState with alias", function() {
    let commandID = "1234235534ferw"

    describe("handle succeeded reponse", function() {

        let expectedState = {power: true};

        beforeEach(function() {
            simple.mock(StateOps.prototype, 'getState').returnWith(
                new P<Object>((resolve, reject)=>{
                    resolve(expectedState);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            au.getState(target, "alias1")
            .then((state)=>{
                expect(state).to.be.deep.equal(expectedState);
                done();
            }).catch((err)=>{
                done(err);
            })
        })
        it("test callback", function (done) {
            au.getState(target,"alias1", (err, state)=>{
                try{
                    expect(err).to.null;
                    expect(state).to.be.deep.equal(expectedState);
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function() {
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "TARGET_NOT_FOUND",
            "message": `Target thing:${target.id} not found`
        });

        beforeEach(function() {
            simple.mock(StateOps.prototype, 'getState').returnWith(
                new P<Object>((resolve, reject)=>{
                    reject(expectedError);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            au.getState(target, "alias1")
            .then((state)=>{
                done("should fail");
            }).catch((err: HttpRequestError)=>{
                expect(err).to.be.deep.equal(expectedError);
                done();
            })
        })
        it("test callback", function (done) {
            au.getState(target, "alias1", (err, state)=>{
                try{
                    expect(err).to.be.deep.equal(expectedError);
                    expect(state).to.null;
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })
})



