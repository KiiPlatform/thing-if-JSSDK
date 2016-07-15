/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for Onboarding:", function () {

    let user: KiiUser;
    let au: any;

    beforeEach(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    afterEach(function(done) {
        apiHelper.deleteKiiUser(user).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    describe('onboardWithVendorThingID:', function () {
        it("handle success response", function (done) {
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
            au.onboardWithVendorThingID(request).then((result:any)=>{
                expect(result.thingID).to.be.not.null;
                expect(result.accessToken).to.be.not.null;
                expect(result.mqttEndPoint.installationID).to.be.not.null;
                expect(result.mqttEndPoint.username).to.be.not.null;
                expect(result.mqttEndPoint.password).to.be.not.null;
                expect(result.mqttEndPoint.mqttTopic).to.be.not.null;
                expect(result.mqttEndPoint.host).to.be.not.null;
                expect(result.mqttEndPoint.portTCP).to.be.not.null;
                expect(result.mqttEndPoint.portSSL).to.be.not.null;
                expect(result.mqttEndPoint.portWS).to.be.not.null;
                expect(result.mqttEndPoint.portWSS).to.be.not.null;
                expect(result.mqttEndPoint.ttl).to.be.not.null;
                done();
            }).catch((err:Error)=>{
                done(err);
            });
        });
    });
    describe('onboardWithThingID:', function () {
        it("handle success response", function (done) {
            apiHelper.createKiiThing().then((thing:KiiThing)=>{
                var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
                var request = new thingIFSDK.OnboardWithThingIDRequest(thing.thingID, thing.password, owner);
                return au.onboardWithThingID(request);
            }).then((result:any)=>{
                expect(result.thingID).to.be.not.null;
                expect(result.accessToken).to.be.not.null;
                expect(result.mqttEndPoint.installationID).to.be.not.null;
                expect(result.mqttEndPoint.username).to.be.not.null;
                expect(result.mqttEndPoint.password).to.be.not.null;
                expect(result.mqttEndPoint.mqttTopic).to.be.not.null;
                expect(result.mqttEndPoint.host).to.be.not.null;
                expect(result.mqttEndPoint.portTCP).to.be.not.null;
                expect(result.mqttEndPoint.portSSL).to.be.not.null;
                expect(result.mqttEndPoint.portWS).to.be.not.null;
                expect(result.mqttEndPoint.portWSS).to.be.not.null;
                expect(result.mqttEndPoint.ttl).to.be.not.null;
                done();
            }).catch((err:Error)=>{
                done(err);
            });
        });
    });
});
