/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for APIAuthor Trigger APIs:", function () {

    let user: KiiUser;
    let au: any;
    let adminToken: string;
    let targetThingID: string;
    let triggerID: string;

    beforeEach(function(done) {
        // 1. create KiiUser
        // 2. get AdminToken
        // 3. onboard thing
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            return apiHelper.getAdminToken();
        }).then((token: string) => {
            adminToken = token;
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
            return au.onboardWithVendorThingID(request);
        }).then((result:any) => {
            targetThingID = result.thingID;
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

    describe("Command Trigger", function () {
        it("with StatePredicate", function (done) {
            var schemaName = "led";
            var schemaVersion = 1;
            var actions = [{turnPower: {power:true}}, {setColor: {color: [255,0,255]}}];
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, targetThingID);
            
            var condition = new thingIFSDK.Condition(new thingIFSDK.Equals("power", "false"));
            var predicate = new thingIFSDK.StatePredicate(condition, thingIFSDK.TriggersWhen.CONDITION_CHANGED);
            var request = new thingIFSDK.CommandTriggerRequest(schemaName, schemaVersion, actions, predicate, issuerID);

            // 1. create trigger
            au.postCommandTrigger(targetID, request).then((trigger:any)=>{
                triggerID = trigger.triggerID;
                expect(triggerID).to.be.not.null;
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.getEventSource()).to.equal("STATES");
                expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                expect(trigger.predicate.condition).to.deep.equal(condition);

                expect(trigger.command.schemaName).to.equal(schemaName);
                expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                expect(trigger.command.actions).to.deep.equal(actions);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);

                expect(trigger.serverCode).to.be.null;
                done();
            }).catch((err:Error)=>{
                done(err);
            });

        });
        // it("with SchedulePredicate", function (done) {
        // });
        // it("with ScheduleOncePredicate", function (done) {
        // });
    });
    // describe("ServerCode Trigger", function () {
    //     it("with StatePredicate", function (done) {
    //     });
    //     it("with SchedulePredicate", function (done) {
    //     });
    //     it("with ScheduleOncePredicate", function (done) {
    //     });
    // });
});
