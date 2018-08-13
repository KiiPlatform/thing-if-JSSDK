/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types//nock/index.d.ts" />

import {expect} from 'chai';
import * as nock from 'nock'
import TestApp from './TestApp'
import * as RequestObjects from '../../src/RequestObjects';
import OnboardingOps from '../../src/ops/OnboardingOps'
import * as TestUtil from './utils/TestUtil'

import {
    LayoutPosition,
    APIAuthor,
    TypedID,
    Types,
    OnboardingResult,
    ThingIFError,
    HttpRequestError,
    Errors
} from '../../src/ThingIFSDK'

let scope : nock.Scope;
let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let au = new APIAuthor(ownerToken, testApp.app);
let onboardingOps = new OnboardingOps(au);

describe('Test OnboardingOps', function () {

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
        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
        "Authorization":"Bearer " + ownerToken,
        "Content-Type": "application/vnd.kii.OnboardingWithThingIDByOwner+json"
    }
    let reqHeaders4VendorThingID = {
        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
        "Authorization":"Bearer " + ownerToken,
        "Content-Type": "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json"
    }

    beforeEach(function() {
        nock.cleanAll();
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
                    owner: owner.toString(),
                    layoutPosition: "ENDNODE"
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithThingIDRequest(
                "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                "password",
                owner,
                LayoutPosition.ENDNODE);
            (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                expect(result.thingID).to.equals(responseBody.thingID);
                expect(result.accessToken).to.equals(responseBody.accessToken);
                expect(result.mqttEndPoint).to.deep.equal(responseBody.mqttEndpoint);
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
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
            var request = new RequestObjects.OnboardWithThingIDRequest(
                "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                "password",
                owner);
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
                    owner: owner.toString(),
                    firmwareVersion: "v1.0.0",
                    layoutPosition: "ENDNODE"
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithVendorThingIDRequest(
                "01234-56789-abcdefg-hijklm",
                "password",
                owner,
                null,
                "v1.0.0",
                null,
                LayoutPosition.ENDNODE);
            (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                expect(result.thingID).to.equals(responseBody.thingID);
                expect(result.accessToken).to.equals(responseBody.accessToken);
                expect(result.mqttEndPoint).to.deep.equal(responseBody.mqttEndpoint);
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
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
            var request = new RequestObjects.OnboardWithVendorThingIDRequest(
                "01234-56789-abcdefg-hijklm",
                "password",
                owner);
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
describe("Test ArgumentError for OnboardingOps", function() {
    describe("#onboardWithThingID() with promise", function() {
        class TestCase {
            constructor(
                public thingID: string,
                public thingPassword: string,
                public owner: TypedID,
                public layoutPosition: any,
                public expectedError: string,
                public expectedErrorMsg: string,
                public description: string
            ){}
        }
        let tests = [
            new TestCase(null, "passowrd", owner, null, Errors.ArgumentError, "thingID is null or empty", "should handle error when thingID is null"),
            new TestCase("", "passowrd", owner, null, Errors.ArgumentError, "thingID is null or empty", "should handle error when thingID is empty string"),
            new TestCase("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", null, owner, null, Errors.ArgumentError, "thingPassword is null or empty", "should handle error when password is null"),
            new TestCase("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "", owner, null, Errors.ArgumentError, "thingPassword is null or empty", "should handle error when password is empty string"),
            new TestCase("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "passowrd", null, null, Errors.ArgumentError, "owner is null", "should handle error when owner is null"),
            new TestCase("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "passowrd", owner, 1, Errors.ArgumentError, "layoutPosition is not string", "should handle error when layoutPosition is not string"),
            new TestCase("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "passowrd", owner, "gateway", Errors.ArgumentError, "layoutPosition is invalid, should equal to one of values of LayoutPosition", "should handle error when layoutPosition is invalid string"),
        ]
        tests.forEach(function(test) {
            it(test.description, function(done){
                var request = new RequestObjects.OnboardWithThingIDRequest(
                    test.thingID,
                    test.thingPassword,
                    test.owner,
                    test.layoutPosition);
                (new OnboardingOps(au)).onboardWithThingID(request).then((result:OnboardingResult)=>{
                    done("should fail");
                }).catch((err:ThingIFError)=>{
                    try {
                        expect(err).be.not.null;
                        expect(err.name).to.equals(test.expectedError);
                        expect(err.message).to.equals(test.expectedErrorMsg);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });
    });
    describe("#onboardWithVendorThingID() with promise", function() {
        class TestCase {
            constructor(
                public vendorThingID: string,
                public thingPassword: string,
                public owner: TypedID,
                public thingType: any,
                public thingProperties: any,
                public firmwareVersion: any,
                public layoutPosition: any,
                public expectedError: string,
                public expectedErrorMsg: string,
                public description: string
            ){}
        }
        let tests = [
            new TestCase(null, "passowrd", owner, null, null, null, null, Errors.ArgumentError, "vendorThingID is null or empty", "should handle error when vendorThingID is null"),
            new TestCase("", "passowrd", owner, null, null, null, null, Errors.ArgumentError, "vendorThingID is null or empty", "should handle error when vendorThingID is empty string"),
            new TestCase("01234-56789-abcdefg-hijklm", null, owner, null, null, null, null, Errors.ArgumentError, "thingPassword is null or empty", "should handle error when password is null"),
            new TestCase("01234-56789-abcdefg-hijklm", "", owner, null, null, null, null, Errors.ArgumentError, "thingPassword is null or empty", "should handle error when password is empty string"),
            new TestCase("01234-56789-abcdefg-hijklm", "passowrd", null, null, null, null, null, Errors.ArgumentError, "owner is null", "should handle error when owner is null"),
            new TestCase("01234-56789-abcdefg-hijklm", "password", owner, 1, null, null, null, Errors.ArgumentError, "thingType is not string", "should handle error when thingType is not string"),
            new TestCase("01234-56789-abcdefg-hijklm", "password", owner, "LED", "power:true", null, null, Errors.ArgumentError, "thingProperties is not object", "should handle error when thingProperties is not object"),
            new TestCase("01234-56789-abcdefg-hijklm", "password", owner, null, null, 1234, null, Errors.ArgumentError, "firmwareVersion is not string", "should handle error when firmwareVersion is not string"),
            new TestCase("01234-56789-abcdefg-hijklm", "password", owner, null, null, null, 1, Errors.ArgumentError, "layoutPosition is not string", "should handle error when layoutPosition is not string"),
            new TestCase("01234-56789-abcdefg-hijklm", "password", owner, null, null, null, "gateway", Errors.ArgumentError, "layoutPosition is invalid, should equal to one of values of LayoutPosition", "should handle error when layoutPosition is invalid string"),
        ]
        tests.forEach(function(test) {
            it(test.description, function(done){
                var request = new RequestObjects.OnboardWithVendorThingIDRequest(
                    test.vendorThingID,
                    test.thingPassword,
                    test.owner,
                    test.thingType,
                    test.firmwareVersion,
                    test.thingProperties,
                    test.layoutPosition);
                (new OnboardingOps(au)).onboardWithVendorThingID(request).then((result:OnboardingResult)=>{
                    done("should fail");
                }).catch((err:ThingIFError)=>{
                    try {
                        expect(err).be.not.null;
                        expect(err.name).to.equals(test.expectedError);
                        expect(err.message).to.equals(test.expectedErrorMsg);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });
    });
});
