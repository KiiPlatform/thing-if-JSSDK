/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
import { expect } from 'chai';
import { apiHelper, KiiUser, KiiThing } from './utils/APIHelper';
import { testApp } from './utils/TestApp';
import { ThingIFAPI } from '../../src/ThingIFAPI'
import { TestInfo } from './utils/TestInfo';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

describe("Large Tests for get/update thingType of ThingIFAPI:", function () {

    let user: KiiUser;
    let api: ThingIFAPI;
    let thingID: string;

    beforeEach(function (done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            api = new thingIFSDK.ThingIFAPI(owner, newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password);
            return api.onboardWithVendorThingID(request)
        }).then((result) => {
            expect(result.thingID).not.null;
            thingID = result.thingID;
            done();
        }).catch((err) => {
            done(err);
        })
    });

    afterEach(function (done) {
        apiHelper.deleteKiiThing(thingID).then(() => {
            return apiHelper.deleteKiiUser(user);
        }).then(() => {
            done();
        }).catch((err) => {
            done(err);
        })
    })

    it("handle success response by calling ThingIFAPI#getThingType, ThingIFAPI#updateThingType", function (done) {
        api.getThingType().then((thingType) => {
            expect(thingType).null;
            return api.updateThingType(TestInfo.DefaultThingType);
        }).then(() => {
            return api.getThingType();
        }).then((thingType) => {
            expect(thingType).to.be.equal(TestInfo.DefaultThingType);
            done();
        }).catch((err) => {
            done(JSON.stringify(err));
        })
    });
})