/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for Command Ops(APIAuthor):", function () {

    let user: KiiUser;
    let au: any;
    let target: string;

    before(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
            return au.onboardWithVendorThingID(request)
        }).then((res)=>{
            target = res.thingID;
            expect(target).not.to.be.undefined;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    after(function(done) {
        apiHelper.deleteKiiThing(target).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    describe('postNewCommand with promise:', function () {
        let installationRegistrationID = `${new Date()}`

        it("handle success response", function (done) {
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, target);
            var postCommandRequest = new thingIFSDK.PostCommandRequest("led", 1, [{turnPower: {power:true}}], issuerID)
            au.postNewCommand(targetID, postCommandRequest).then((cmd)=>{
                expect(cmd).not.null;
                expect(cmd.commandID).not.equal("");
                done();
            }).catch((err)=>{
                done(err);
            })
        });
    });

    describe('postNewCommand with callback:', function () {
        let installationRegistrationID = `${new Date()}`

        it("handle success response", function (done) {
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, target);
            var postCommandRequest = new thingIFSDK.PostCommandRequest("led", 1, [{turnPower: {power:true}}], issuerID)
            au.postNewCommand(targetID, postCommandRequest,(err, cmd)=>{
                expect(err).to.null;
                expect(cmd).not.null;
                expect(cmd.commandID).not.equal("");
                done();
            })
        });
    });


})