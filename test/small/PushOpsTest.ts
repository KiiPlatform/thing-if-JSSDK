/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types//nock/index.d.ts" />

import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import PushOps from '../../src/ops/PushOps'
import {default as request} from '../../src/ops/Request'
import {APIAuthor} from '../../src/APIAuthor'
import {Errors} from '../../src/ThingIFError'

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

describe("Test ArgumentError for push ops", function() {
    describe("Test APIAuthor#installFCM", function() {
        class TestCase {
            constructor(
                public installationRegistrationID: string,
                public development: boolean,
                public expectedError: string
            ){}
        }
        let tests = [
            new TestCase(null, null, Errors.ArgumentError),
            new TestCase(null, true, Errors.ArgumentError),
            new TestCase("someID", null, Errors.ArgumentError),
            new TestCase("", true, Errors.ArgumentError),
            new TestCase(<any>6, true, Errors.ArgumentError),
            new TestCase("someID", <any>4, Errors.ArgumentError),
            new TestCase(<any>true, <any>"str", Errors.ArgumentError)
        ]

        tests.forEach(function(test) {
            it("when installationRegistrationID="+test.installationRegistrationID
                +", development="+test.development+ ", "
                +test.expectedError+" error should be returned",
                function (done) {
                au.installFCM(test.installationRegistrationID, test.development)
                .then(()=>{
                    done("should fail");
                }).catch((err)=>{
                    expect(err.name).to.equal(test.expectedError);
                    done();
                })
            })
        })
    })

    describe("Test APIAuthor#uninstallPush", function() {
        class TestCase {
            constructor(
                public installationID: string,
                public expectedError: string
            ){}
        }
        let tests = [
            new TestCase(null, Errors.ArgumentError),
            new TestCase("", Errors.ArgumentError),
            new TestCase(<any>5, Errors.ArgumentError) // when development is not string type
        ]

        tests.forEach(function(test) {
            it("when installationID="+test.installationID+ ", "
                +test.expectedError+" error should be returned",
                function (done) {
                au.uninstallPush(test.installationID)
                .then(()=>{
                    done("should fail");
                }).catch((err)=>{
                    expect(err.name).to.equal(test.expectedError);
                    done();
                })
            })
        })
    })
})