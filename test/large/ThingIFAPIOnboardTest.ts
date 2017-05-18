/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

describe("Large Tests for ThingIFAPI#Onboarding:", function () {

    let user: KiiUser;
    let api: any;

    beforeEach(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            api = new thingIFSDK.ThingIFAPI(owner, newUser.token, testApp);
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
        describe('with promise:', function () {
            it("handle success response", function (done) {
                var vendorThingID = "vendor-" + new Date().getTime();
                var password = "password";
                var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password);
                api.onboardWithVendorThingID(request).then((result:any)=>{
                    expect(result.thingID).to.be.not.null;
                    expect(api.target.id).to.equal(result.thingID)
                    expect(api.target.type).to.equal(thingIFSDK.Types.Thing)
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
        describe('with callback:', function () {
            it("handle success response", function (done) {
                var vendorThingID = "vendor-" + new Date().getTime();
                var password = "password";
                var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password);
                api.onboardWithVendorThingID(request, (err:Error, result:any)=>{
                    try {
                        expect(err).to.be.null;
                        expect(result.thingID).to.be.not.null;
                        expect(api.target.id).to.equal(result.thingID)
                        expect(api.target.type).to.equal(thingIFSDK.Types.Thing)
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
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });
    });
    describe('onboardWithThingID:', function () {
        describe('with promise:', function () {
            it("handle success response", function (done) {
                apiHelper.createKiiThing().then((thing:KiiThing)=>{
                    var request = new thingIFSDK.OnboardWithThingIDRequest(thing.thingID, thing.password);
                    return api.onboardWithThingID(request);
                }).then((result:any)=>{
                    expect(result.thingID).to.be.not.null;
                    expect(api.target.id).to.equal(result.thingID)
                    expect(api.target.type).to.equal(thingIFSDK.Types.Thing)
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
        describe('with callback:', function () {
            it("handle success response", function (done) {
                apiHelper.createKiiThing().then((thing:KiiThing)=>{
                    var request = new thingIFSDK.OnboardWithThingIDRequest(thing.thingID, thing.password);
                    return api.onboardWithThingID(request, (err:Error, result:any)=>{
                        try {
                            expect(err).to.be.null;
                            expect(result.thingID).to.be.not.null;
                            expect(api.target.id).to.equal(result.thingID)
                            expect(api.target.type).to.equal(thingIFSDK.Types.Thing)
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
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
});