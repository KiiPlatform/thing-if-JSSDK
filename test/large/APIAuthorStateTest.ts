/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import {APIAuthor} from '../../src/APIAuthor'
import { TestInfo } from './utils/TestInfo';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

describe("Large Tests for APIAuthor#getState:", function () {

    let user: KiiUser;
    let au: APIAuthor;
    let target: string;
    let simpleState = {power: true}
    let expectedState = { AirConditionerAlias: simpleState};

    before(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                vendorThingID,
                password,
                owner,
                TestInfo.DefaultThingType,
                TestInfo.DefaultFirmwareVersion);
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
            // get state without alias
            au.getState(new thingIFSDK.TypedID(thingIFSDK.Types.Thing, target)).then((state)=>{
                expect(state).to.deep.equal(expectedState);
                return au.getState(
                    new thingIFSDK.TypedID(thingIFSDK.Types.Thing, target),
                    TestInfo.AirConditionerAlias
                );
            }).then((state) => {
                expect(state).deep.equal(simpleState);
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });
})