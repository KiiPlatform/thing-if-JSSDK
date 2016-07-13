/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />

import {expect} from 'chai';
import * as nock from 'nock'
import {APIAuthor} from '../../src/APIAuthor';
import {App} from '../../src/App';
import {Site} from '../../src/Site';
import {TypedID} from '../../src/TypedID';
import {Types} from '../../src/TypedID';
import * as RequestObjects from '../../src/RequestObjects';
import * as OnboardingOps from '../../src/ops/OnboardingOps'
import {OnboardingResult} from '../../src/OnboardingResult';
let scope : nock.Scope;

describe('OnboardingOps', function () {

    let hostname = "http://api-jp.test.com";
    let appID = "abcd1234";
    let appKey = "ABCD1234efgh5678IJKLM";
    let path = `/thing-if/apps/${appID}/onboardings`;
    let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
    let owner = new TypedID(Types.User, "userid-01234");
    var au: APIAuthor;
    let app = new App(appID, appKey, hostname);
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

    beforeEach(function() {
        nock.cleanAll();
        au = new APIAuthor(ownerToken, app);
    });
    describe('#onboardWithThingID() with callback', function () {

        let reqHeaders = {
            "X-Kii-AppID": appID,
            "X-Kii-AppKey": appKey,
            "Authorization":"Bearer " + ownerToken,
            "Content-Type": "application/vnd.kii.OnboardingWithThingIDByOwner+json"
        }

        it("should send a request to the thing-if server", function (done) {
            scope = nock(
                hostname,
                <any>{
                    reqheaders: reqHeaders
                }).post(path, {
                    thingID: "th.7b3f20b00022-414b-6e11-0374-03ab0ce5",
                    thingPassword: "password",
                    owner: owner.toString()
                })
                .reply(200, responseBody, {"Content-Type": "application/json"});
            var request = new RequestObjects.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);
            OnboardingOps.onboardWithThingID(au, request, (err:Error, res:OnboardingResult)=>{
                // expect(err).not.be.null;
                console.log("XXXXXXXXXXXXXX");
                done();
            });
        });

        it("should handle error when thingID is null", function (done) {
        });
        // it("should handle error when thingID is empty string", function (done) {
        // });
        // it("should handle error when password is null", function (done) {
        // });
        // it("should handle error when password is empty string", function (done) {
        // });
        // it("should handle error when server returned 403 error", function (done) {
        // });
        // it("should handle error when owner is null", function (done) {
        // });
        // it("should handle error when server returned 404 error", function (done) {
        // });
        // it("should handle error when server returned 405 error", function (done) {
        // });
    });
    // describe('#onboardWithVendorThingID()', function () {
    // });
});
