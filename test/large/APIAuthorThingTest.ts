/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for thing APIs(APIAuthor):", function () {

    let user: KiiUser;
    let au: any;
    let thingID: string;
    let orgVendorThingID: string;

    beforeEach(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            orgVendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(orgVendorThingID, password, owner);
            return au.onboardWithVendorThingID(request)
        }).then((result)=>{
            expect(result.thingID).not.null;
            thingID = result.thingID;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    afterEach(function(done) {
        apiHelper.deleteKiiThing(thingID).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("handle success response by calling APIAuthor#getVendorThingID, APIAuthor#updateVendorThingID", function (done) {
        let newVendorThingID = `new${(new Date()).getTime()}`
        let newPassword = "pass";
        au.getVendorThingID(thingID).then((vendorThingID)=>{
            expect(vendorThingID).to.be.equal(orgVendorThingID);
            return au.updateVendorThingID(thingID, newVendorThingID, newPassword);
        }).then(()=>{
            return au.getVendorThingID(thingID);
        }).then((vendorThingID)=>{
            expect(vendorThingID).to.be.equal(newVendorThingID);
            done();
        }).catch((err)=>{
            done(JSON.stringify(err));
        })
    });
})