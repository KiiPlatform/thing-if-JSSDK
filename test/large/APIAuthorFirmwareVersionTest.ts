/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
import { expect } from 'chai';
import { apiHelper, KiiUser, KiiThing } from './utils/APIHelper';
import { testApp } from './utils/TestApp';
import { TestInfo } from './utils/TestInfo';
import { APIAuthor } from '../../src/APIAuthor';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

describe("Large Tests for get/update firmwareVersion of APIAuthor:", function () {

    let user: KiiUser;
    let au: APIAuthor;
    let thingID: string;

    beforeEach(function (done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                vendorThingID,
                password,
                owner,
                TestInfo.DefaultThingType);
            return au.onboardWithVendorThingID(request)
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

    it("handle success response by calling APIAuthor#getFirmwareVersion, APIAuthor#updateFirmwareVersion", function (done) {
        au.getFirmwareVersion(thingID).then((fwVersion) => {
            expect(fwVersion).null;
            return au.updateFirmwareVersion(thingID, TestInfo.DefaultFirmwareVersion);
        }).then(() => {
            return au.getFirmwareVersion(thingID);
        }).then((fwVersion) => {
            expect(fwVersion).equals(TestInfo.DefaultFirmwareVersion);
            done();
        }).catch((err) => {
            done(JSON.stringify(err));
        })
    });
})