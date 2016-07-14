/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />

import {expect} from 'chai';
import * as nock from 'nock'
import TestApp from './TestApp'
import {APIAuthor} from '../../src/APIAuthor';
import {TypedID} from '../../src/TypedID';
import {Types} from '../../src/TypedID';
import * as RequestObjects from '../../src/RequestObjects';
import OnboardingOps from '../../src/ops/OnboardingOps'
import {OnboardingResult} from '../../src/OnboardingResult';
import {ThingIFError, HttpRequestError, Errors} from '../../src/ThingIFError';
let scope : nock.Scope;
let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let au = new APIAuthor(ownerToken, testApp.app);
let onboardingOps = new OnboardingOps(au);

describe('OnboardingOps', function () {

    let path = `/thing-if/apps/${testApp.appID}/onboardings`;
    let responseBody = {
        accessToken: "p5Q9jtFdqRYTNgseurHLhQ0aehCYxAOJ2qzOO4TSKbw",
        thingID: "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
        mqttEndpoint: {
            installationID: "roiczg4byahl2xji1fp2r1vk2",
            username: "163fa051-p6QcV3cP5oFJjdEAZO6d2uC",
            password: "jzgbQibmANOzaLLFkmnNCICbgHFYNyUBVlMREKHDbaHvmmWcmAGQlVYuoxQZAsQG",
            mqttTopic: "obEHMF5Y3qeuAltpXjvSLnx",
            host: "jp-mqtt-13915c439c5e.kii.com",
            portTCP: 1883,
            portSSL: 8883,
            portWS: 12470,
            portWSS: 12473,
            ttl: 2147483647
        }
    }
    let reqHeaders4ThingID = {
        "X-Kii-SDK": "0.1",
        "Authorization":"Bearer " + ownerToken,
        "Content-Type": "application/vnd.kii.OnboardingWithThingIDByOwner+json"
    }
    let reqHeaders4VendorThingID = {
        "X-Kii-SDK": "0.1",
        "Authorization":"Bearer " + ownerToken,
        "Content-Type": "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json"
    }

    beforeEach(function() {
        nock.cleanAll();
    });
    describe('#onboardWithThingID() with callback', function () {

        it("should send a request to the thing-if server", function (done) {
            scope = nock(
                testApp.site,
                <any>{
                    reqheaders: reqHeaders4ThingID
                }).post(path, {
                    thingID: "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.null;
                    expect(result.thingID).to.equals(responseBody.thingID);
                    expect(result.accessToken).to.equals(responseBody.accessToken);
                    expect(result.mqttEndPoint).to.deep.equal(responseBody.mqttEndpoint);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when thingID is null", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest(null, "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("thingID is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when thingID is empty string", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("", "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("thingID is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when password is null", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", null, owner);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("thingPassword is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when password is empty string", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "", owner);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("thingPassword is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when owner is null", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", null);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("owner is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when server returned 403 error", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": au.token
            };
            scope = nock(testApp.site,
                <any>{
                    reqheaders: reqHeaders4ThingID
                }).post(path, {
                    thingID: "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(
                    403,
                    errResponse,
                    {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
                );
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.HttpError);
                    expect(err.message).to.equals(errResponse.message);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
    describe('#onboardWithVendorThingID()', function () {
        it("should send a request to the thing-if server", function (done) {
            scope = nock(
                testApp.site,
                <any>{
                    reqheaders: reqHeaders4VendorThingID
                }).post(path, {
                    vendorThingID: "01234-56789-abcdefg-hijklm",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.null;
                    expect(result.thingID).to.equals(responseBody.thingID);
                    expect(result.accessToken).to.equals(responseBody.accessToken);
                    expect(result.mqttEndPoint).to.deep.equal(responseBody.mqttEndpoint);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when vendorThingID is null", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest(null, "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("vendorThingID is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when vendorThingID is empty string", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("", "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("vendorThingID is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when password is null", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", null, owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("thingPassword is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when password is empty string", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("thingPassword is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when owner is null", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "password", null);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.ArgumentError);
                    expect(err.message).to.equals("owner is null or empty");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
        it("should handle error when server returned 403 error", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": au.token
            };
            scope = nock(testApp.site,
                <any>{
                    reqheaders: reqHeaders4VendorThingID
                }).post(path, {
                    vendorThingID: "01234-56789-abcdefg-hijklm",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(
                    403,
                    errResponse,
                    {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
                );
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request, (err:ThingIFError, result:OnboardingResult)=>{
                try {
                    expect(err).be.not.null;
                    expect(err.name).to.equals(Errors.HttpError);
                    expect(err.message).to.equals(errResponse.message);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
    describe('#onboardWithThingID() with promise', function () {

        it("should send a request to the thing-if server", function (done) {
            scope = nock(
                testApp.site,
                <any>{
                    reqheaders: reqHeaders4ThingID
                }).post(path, {
                    thingID: "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                expect(result.thingID).to.equals(responseBody.thingID);
                expect(result.accessToken).to.equals(responseBody.accessToken);
                expect(result.mqttEndPoint).to.deep.equal(responseBody.mqttEndpoint);
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("should handle error when thingID is null", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest(null, "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("thingID is null or empty");
                done();
            });
        });
        it("should handle error when thingID is empty string", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("", "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("thingID is null or empty");
                done();
            });
        });
        it("should handle error when password is null", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", null, owner);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("thingPassword is null or empty");
                done();
            });
        });
        it("should handle error when password is empty string", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "", owner);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("thingPassword is null or empty");
                done();
            });
        });
        it("should handle error when owner is null", function (done) {
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", null);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("owner is null or empty");
                done();
            });
        });
        it("should handle error when server returned 403 error", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": au.token
            };
            scope = nock(testApp.site,
                <any>{
                    reqheaders: reqHeaders4ThingID
                }).post(path, {
                    thingID: "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(
                    403,
                    errResponse,
                    {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
                );
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.HttpError);
                expect(err.message).to.equals(errResponse.message);
                done();
            });
        });
    });
    describe('#onboardWithVendorThingID() with promise', function () {

        it("should send a request to the thing-if server", function (done) {
            scope = nock(
                testApp.site,
                <any>{
                    reqheaders: reqHeaders4VendorThingID
                }).post(path, {
                    vendorThingID: "01234-56789-abcdefg-hijklm",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                expect(result.thingID).to.equals(responseBody.thingID);
                expect(result.accessToken).to.equals(responseBody.accessToken);
                expect(result.mqttEndPoint).to.deep.equal(responseBody.mqttEndpoint);
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("should handle error when vendorThingID is null", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest(null, "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("vendorThingID is null or empty");
                done();
            });
        });
        it("should handle error when vendorThingID is empty string", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("", "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("vendorThingID is null or empty");
                done();
            });
        });
        it("should handle error when password is null", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", null, owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("thingPassword is null or empty");
                done();
            });
        });
        it("should handle error when password is empty string", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("thingPassword is null or empty");
                done();
            });
        });
        it("should handle error when owner is null", function (done) {
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "password", null);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.ArgumentError);
                expect(err.message).to.equals("owner is null or empty");
                done();
            });
        });
        it("should handle error when server returned 403 error", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": au.token
            };
            scope = nock(testApp.site,
                <any>{
                    reqheaders: reqHeaders4VendorThingID
                }).post(path, {
                    vendorThingID: "01234-56789-abcdefg-hijklm",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(
                    403,
                    errResponse,
                    {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
                );
            var request = new RequestObjects.OnboardWithVendorThingIDRequest("01234-56789-abcdefg-hijklm", "password", owner);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                done("should fail");
            }).catch((err:ThingIFError)=>{
                expect(err).be.not.null;
                expect(err.name).to.equals(Errors.HttpError);
                expect(err.message).to.equals(errResponse.message);
                done();
            });
        });
    });
});
