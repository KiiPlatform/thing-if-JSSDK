/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import {ThingIFAPI} from '../../src/ThingIFAPI'

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for ThingIFAPI#getState:", function () {

    let user: KiiUser;
    let au: ThingIFAPI;
    let target: string;
    let expectedState = {power:true};

    before(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            au = new thingIFSDK.ThingIFAPI(owner, newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
            // onboarding to get ownership
            return au.onboardWithVendorThingID(request)
        }).then((res)=>{
            target = res.thingID;
            expect(target).not.to.be.undefined;
            return apiHelper.updateThingState(`thing:${target}`, expectedState);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });

    after(function(done) {
        apiHelper.deleteKiiThing(target).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    })

    describe('test with promise:', function () {

        it("handle success response", function (done) {
            au.getState().then((state)=>{
                expect(state).to.deep.equal(expectedState);
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });
})