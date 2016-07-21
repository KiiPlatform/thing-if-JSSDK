/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for Command APIs(ThingIFAPI):", function () {

    let user: KiiUser;
    let thingIFAPI: any;

    before(function(done) {
        let au: any;
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.ThingIFAPI(newUser.token, testApp);
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            thingIFAPI = new thingIFSDK.ThingIFAPI(owner, newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
            return thingIFAPI.onboardWithVendorThingID(request)
        }).then(()=>{
            expect(thingIFAPI.target).not.to.be.null;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    after(function(done) {
        apiHelper.deleteKiiThing(thingIFAPI.target.id).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("handle success response by calling ThingIFAPI#postNewCommand, ThingIFAPI#getCommand, and ThingIFAPI#listCommands", function (done) {
        var postCommandRequest = new thingIFSDK.PostCommandRequest("led", 1, [{turnPower: {power:true}}])
        thingIFAPI.postNewCommand(postCommandRequest).then((cmd)=>{
            expect(cmd).not.null;
            expect(cmd.commandID).not.equal("");
            return thingIFAPI.postNewCommand(postCommandRequest);
        }).then((cmd)=>{
            expect(cmd).not.null;
            expect(cmd.commandID).not.equal("");
            return thingIFAPI.getCommand(cmd.commandID);
        }).then(()=>{
            return thingIFAPI.listCommands()
        }).then((result)=>{
            expect(result.results.length).to.equal(2);
            done();
        }).catch((err)=>{
            done(err);
        });
    });
})