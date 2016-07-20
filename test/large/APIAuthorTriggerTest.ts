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
        it("create/update/delete/get/list/disable", function (done) {
            var triggerID1: string;
            var triggerID2: string;
            var schemaName = "led";
            var schemaVersion = 1;
            var actions = [{turnPower: {power:true}}, {setColor: {color: [255,0,255]}}];
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, targetThingID);
            
            var condition = new thingIFSDK.Condition(new thingIFSDK.Equals("power", "false"));
            var statePredicate = new thingIFSDK.StatePredicate(condition, thingIFSDK.TriggersWhen.CONDITION_CHANGED);
            var request = new thingIFSDK.CommandTriggerRequest(schemaName, schemaVersion, actions, statePredicate, issuerID);

            // 1. create trigger with StatePredicate
            au.postCommandTrigger(targetID, request).then((trigger:any)=>{
                triggerID1 = trigger.triggerID;
                expect(triggerID1).to.be.not.null;
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

                // 2. create trigger with SchedulePredicate
                var schedulePredicate = new thingIFSDK.SchedulePredicate("0 12 1 * *");
                request = new thingIFSDK.CommandTriggerRequest(schemaName, schemaVersion, actions, schedulePredicate, issuerID);
                // Admin token is needed when allowCreateTaskByPrincipal=false
                au._token = adminToken;
                return au.postCommandTrigger(targetID, request);
            }).then((trigger:any)=>{
                triggerID2 = trigger.triggerID;
                expect(triggerID2).to.be.not.null;
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.cronExpression).to.equal("0 12 1 * *");
                expect(trigger.command.schemaName).to.equal(schemaName);
                expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                expect(trigger.command.actions).to.deep.equal(actions);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).to.be.null;

                // 3. disable trigger
                return au.enableTrigger(targetID, triggerID2, false);
            }).then((trigger:any)=>{
                expect(trigger.triggerID).to.equal(triggerID2);
                expect(trigger.disabled).to.be.true;
                expect(trigger.predicate.cronExpression).to.equal("0 12 1 * *");
                expect(trigger.command.schemaName).to.equal(schemaName);
                expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                expect(trigger.command.actions).to.deep.equal(actions);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).to.be.null;
                
                // 4. list triggers
                au._token = user.token;
                return au.listTriggers(targetID, new thingIFSDK.ListQueryOptions());
            }).then((queryResult:any)=>{
                expect(queryResult.results.length).to.equal(2);
                expect(queryResult.paginationKey).to.be.null;
                expect(queryResult.hasNext).to.be.false;
                var trigger1 = queryResult.results[0];
                for (var trigger of queryResult.results) {
                    if (trigger.triggerID == triggerID1) {
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
                    } else if (trigger.triggerID == triggerID2) {
                        expect(trigger.disabled).to.be.true;
                        expect(trigger.predicate.cronExpression).to.equal("0 12 1 * *");
                        expect(trigger.command.schemaName).to.equal(schemaName);
                        expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                        expect(trigger.command.actions).to.deep.equal(actions);
                        expect(trigger.command.targetID).to.deep.equal(targetID);
                        expect(trigger.command.issuerID).to.deep.equal(issuerID);
                        expect(trigger.serverCode).to.be.null;
                    } else {
                        done("Unexpected TriggerID");
                    }
                }
                // 5. update trigger
                request = new thingIFSDK.CommandTriggerRequest("led2", 2, [{setBrightness: {brightness:50}}], statePredicate, issuerID);
                return au.patchCommandTrigger(targetID, triggerID1, request);
            }).then((trigger:any)=>{
                expect(trigger.triggerID).to.equal(triggerID1);
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.getEventSource()).to.equal("STATES");
                expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                expect(trigger.predicate.condition).to.deep.equal(condition);
                expect(trigger.command.schemaName).to.equal("led2");
                expect(trigger.command.schemaVersion).to.equal(2);
                expect(trigger.command.actions).to.deep.equal([{setBrightness: {brightness:50}}]);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).to.be.null;
                // 6. delete trigger
                au._token = adminToken;
                return au.deleteTrigger(targetID, triggerID2);
            }).then((deletedTriggerID:string)=>{
                expect(deletedTriggerID).to.equal(triggerID2);
                // 7. list triggers
                return au.listTriggers(targetID, new thingIFSDK.ListQueryOptions());
            }).then((queryResult:any)=>{
                expect(queryResult.results.length).to.equal(1);
                expect(queryResult.paginationKey).to.be.null;
                expect(queryResult.hasNext).to.be.false;
                expect(queryResult.results[0].triggerID).to.equal(triggerID1);
                expect(queryResult.results[0].disabled).to.be.false;
                expect(queryResult.results[0].predicate.getEventSource()).to.equal("STATES");
                expect(queryResult.results[0].predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                expect(queryResult.results[0].predicate.condition).to.deep.equal(condition);
                expect(queryResult.results[0].command.schemaName).to.equal("led2");
                expect(queryResult.results[0].command.schemaVersion).to.equal(2);
                expect(queryResult.results[0].command.actions).to.deep.equal([{setBrightness: {brightness:50}}]);
                expect(queryResult.results[0].command.targetID).to.deep.equal(targetID);
                expect(queryResult.results[0].command.issuerID).to.deep.equal(issuerID);
                expect(queryResult.results[0].serverCode).to.be.null;
                done();
            }).catch((err:Error)=>{
                done(err);
            });

        });
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
