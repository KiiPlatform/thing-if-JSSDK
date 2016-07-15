/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import PushOps from '../../src/ops/PushOps'
import {default as request} from '../../src/ops/Request'
import {APIAuthor} from '../../src/APIAuthor'
import MqttInstallationResult from '../../src/MqttInstallationResult'
import {Errors} from '../../src/ThingIFError'
import {promiseWhile} from './utils/PromiseUtil'

import * as nock from 'nock'
let scope : nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let pushOp = new PushOps(au);

describe('Test installFCM', function () {
    let path = `/api/apps/${testApp.appID}/installations`;
    let reqHeaders = {
        "Content-Type": "application/vnd.kii.InstallationCreationRequest+json",
        "Authorrization": `Bearer ${au.token}`
    };
    let expectedInstallationID = "69lp6jr0evcirfcfk2mmwiow5";

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                installationRegistrationID: expectedInstallationID,
                deviceType: "ANDROID",
                development: true
            })
            .reply(
                201,
                {installationID: expectedInstallationID},
                {"Content-Type": "application/vnd.kii.InstallationCreationResponse+json"}
            );

        pushOp.installFCM(expectedInstallationID, true).then((installID)=>{
            expect(installID).to.equal(expectedInstallationID);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 400 error response", function (done) {
        let errResponse = {
            "errorCode": "INVALID_INPUT_DATA",
            "message": "There are validation errors: installationRegistrationID - Must not be null or empty.",
            "invalidFields": {
                "installationRegistrationID": "Must not be null or empty"
            }
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                installationRegistrationID: expectedInstallationID,
                deviceType: "ANDROID",
                development: true
            })
            .reply(
                400,
                errResponse,
                {"Content-Type": "application/vnd.kii.ValidationException+json"}
            );

        pushOp.installFCM(expectedInstallationID, true).then((installID)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(400);
            expect(err.message).deep.equal(errResponse.message);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });

    it("handle 403 error response", function (done) {
        let errResponse = {
            "errorCode": "WRONG_TOKEN",
            "message": "The provided token is not valid",
            "appID": testApp.appID,
            "accessToken": au.token
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                installationRegistrationID: expectedInstallationID,
                deviceType: "ANDROID",
                development: true
            })
            .reply(
                403,
                errResponse,
                {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
            );

        pushOp.installFCM(expectedInstallationID, true).then((installID)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(403);
            expect(err.message).deep.equal(errResponse.message);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});

describe('Test installMQTT', function () {
    let path = `/api/apps/${testApp.appID}/installations`;
    let reqHeaders = {
        "Content-Type": "application/vnd.kii.InstallationCreationRequest+json",
        "Authorrization": `Bearer ${au.token}`
    };
    let expectedInstallationID = "69lp6jr0evcirfcfk2mmwiow5";
    let expectedInstallationRegistrationID = "b79dbf4d-c4fc-4bde-9c08-2860f3a4c389";

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                deviceType: "MQTT",
                development: true
            })
            .reply(
                201,
                {installationID: expectedInstallationID, installationRegistrationID: expectedInstallationRegistrationID},
                {"Content-Type": "application/vnd.kii.InstallationCreationResponse+json"}
            );

        pushOp.installMqtt(true).then((result)=>{
            expect(result.installationID).to.equal(expectedInstallationID);
            expect(result.installationRegistrationID).to.equal(expectedInstallationRegistrationID);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 403 error response", function (done) {
        let errResponse = {
            "errorCode": "WRONG_TOKEN",
            "message": "The provided token is not valid",
            "appID": testApp.appID,
            "accessToken": au.token
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                deviceType: "MQTT",
                development: true
            })
            .reply(
                403,
                errResponse,
                {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
            );

        pushOp.installMqtt(true).then((result)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(403);
            expect(err.message).deep.equal(errResponse.message);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});

describe('Test uninstall', function () {
    let installationID = "d7i6hg8ng22kzgebj4nfsu887";
    let path = `/api/apps/${testApp.appID}/installations/${installationID}`;
    let reqHeaders = {
        "Authorrization": `Bearer ${au.token}`
    };

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .delete(path)
            .reply(204);

        pushOp.uninstall(installationID).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 404 error response", function (done) {
        let errResponse = {
            "errorCode": "INSTALLATION_NOT_FOUND",
            "message": `Installation ${installationID} was not found`,
            "appID": testApp.appID,
            "installationID": installationID
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .delete(path)
            .reply(
                404,
                errResponse,
                {"Content-Type": "application/vnd.kii.InstallationNotFoundException+json"}
            );

        pushOp.uninstall(installationID).then((result)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(404);
            expect(err.message).deep.equal(errResponse.message);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});

describe("Test ArgumentError", function() {
    it("APIAuthor#installFCM when paramerter with the following cases:\
     \n installationRegistrationID  development \
     \n null                        null\
     \n null                        boolean\
     \n not empty string            null\
     \n empty string                boolean", function(done) {

        class TestCase {
            constructor(
                public installationRegistrationID: string,
                public development: boolean,
                public succeeded: boolean,
                public errorName?: string
            ){}
        }
        let tests = [
            new TestCase(null, null, false, Errors.ArgumentError),
            new TestCase(null, true, false, Errors.ArgumentError),
            new TestCase("someID", null, false, Errors.ArgumentError),
            new TestCase("", true, false, Errors.ArgumentError)
        ]

        let i=0, loop = tests.length;
        promiseWhile(()=>{
            return i < loop;
        },()=>{
            return new P<void>((resolve, reject)=>{
                var testCase = tests[i];
                au.installFCM(testCase.installationRegistrationID, testCase.development).then(()=>{
                    reject("should fail");
                }).catch((err)=>{
                    expect(err.name).to.equal(testCase.errorName);
                    i++;
                    resolve();
                })
            })
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("APIAuthor#installMqtt, when development is null", function(done) {
        au.installMqtt(null).then(()=>{
            done("should fail");
        }).catch((err)=>{
            expect(err.name).to.be.equal(Errors.ArgumentError);
            done();
        })
    })

    it("APIAuthor#uninstallPush, if installationID is null or empty string", function(done) {
        class TestCase {
            constructor(
                public installationID: string,
                public succeeded: boolean,
                public errorName?: string
            ){}
        }
        let tests = [
            new TestCase(null, false, Errors.ArgumentError),
            new TestCase("", false, Errors.ArgumentError)
        ]

        let i=0, loop = tests.length;
        promiseWhile(()=>{
            return i < loop;
        },()=>{
            return new P<void>((resolve, reject)=>{
                var testCase = tests[i];
                au.uninstallPush(testCase.installationID).then(()=>{
                    reject("should fail");
                }).catch((err)=>{
                    expect(err.name).to.equal(testCase.errorName);
                    i++;
                    resolve();
                })
            })
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })
})