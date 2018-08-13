/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />

import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {APIAuthor} from '../../src/APIAuthor'
import {TypedID, Types} from '../../src/TypedID'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import * as simple from 'simple-mock';
import PushOps from '../../src/ops/PushOps'

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let target = new TypedID(Types.Thing, "dummy-thing-id");
let au = new APIAuthor("dummy-token", testApp.app);

describe("Small test push APIs of APIAuthor", function() {
    describe("Test APIAuthor#installFCM", function() {
        describe("handle succeeded reponse", function() {
            let expectedInstallationID = "23243545"

            beforeEach(function() {
                simple.mock(PushOps.prototype, 'installFCM').returnWith(
                    new P<string>((resolve, reject)=>{
                        resolve(expectedInstallationID);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.installFCM("dummyID", true)
                .then((installationID)=>{
                    expect(installationID).to.be.deep.equal(expectedInstallationID);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.installFCM("dummyID", true,(err, installationID)=>{
                    try{
                        expect(err).to.null;
                        expect(installationID).to.be.deep.equal(expectedInstallationID);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(400, Errors.HttpError, {
            "errorCode": "INVALID_INPUT_DATA",
            "message": "There are validation errors: installationRegistrationID - Must not be null or empty.",
            "invalidFields": {
                "installationRegistrationID": "Must not be null or empty"
            }});

            beforeEach(function() {
                simple.mock(PushOps.prototype, 'installFCM').returnWith(
                    new P<string>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.installFCM("", true)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.installFCM("", true,(err, cmd)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(cmd).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })

    describe("Test APIAuthor#uninstallPush", function() {
      describe("handle succeeded reponse", function() {

            beforeEach(function() {
                simple.mock(PushOps.prototype, 'uninstall').returnWith(
                    new P<void>((resolve, reject)=>{
                        resolve();
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.uninstallPush("2342355")
                .then(()=>{
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.uninstallPush("234545",(err)=>{
                    try{
                        expect(err).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(403, Errors.HttpError, {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": "dummy-token"
            });

            beforeEach(function() {
                simple.mock(PushOps.prototype, 'uninstall').returnWith(
                    new P<void>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.uninstallPush("23435")
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.uninstallPush("sdfsdf",(err)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })
})