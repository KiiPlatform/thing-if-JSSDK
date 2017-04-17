/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import { TestInfo } from './utils/TestInfo';
import { AliasAction, Action } from '../../src/AliasAction';

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
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                vendorThingID,
                password,
                owner,
                TestInfo.DefaultThingType,
                TestInfo.DefaultFirmwareVersion);
            return au.onboardWithVendorThingID(request)
        }).then((res)=>{
            target = res.thingID;
            expect(target).not.to.be.undefined;
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

        it("handle success response by calling APIAuthor#postNewCommand, APIAuthor#getCommand, and APIAuthor#listCommands", function (done) {
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, target);
            var postCommandRequest =
                new thingIFSDK.PostCommandRequest(
                    [
                        new AliasAction(TestInfo.AirConditionerAlias, [
                            new Action("turnPower", true)
                        ])
                    ],
                    issuerID,
                    "title of led",
                    "represent led light",
                    {"power": "true for power on, and false for power off"});
            au.postNewCommand(targetID, postCommandRequest).then((cmd)=>{
                expect(cmd).not.null;
                expect(cmd.commandID).not.equal("");
                return au.postNewCommand(targetID, postCommandRequest);
            }).then((cmd)=>{
                expect(cmd).not.null;
                expect(cmd.commandID).not.equal("");
                return au.getCommand(targetID, cmd.commandID);
            }).then(()=>{
                return au.listCommands(targetID)
            }).then((result)=>{
                expect(result.results.length).to.gte(2);
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });

    describe('test with callbacks:', function () {

        it("handle success response by calling APIAuthor#postNewCommand, APIAuthor#getCommand, and APIAuthor#listCommands", function (done) {
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, target);
            var postCommandRequest =
                new thingIFSDK.PostCommandRequest(
                    [
                        new AliasAction(TestInfo.AirConditionerAlias, [
                            new Action("turnPower", true)
                        ])
                    ],
                    issuerID,
                    "title of led",
                    "represent led light",
                    {"power": "true for power on, and false for power off"});
            au.postNewCommand(targetID, postCommandRequest, (err, cmd)=>{
                if(!!err){
                    done(err);
                    return;
                }
                expect(cmd).not.null;
                expect(cmd.commandID).not.equal("");
                au.postNewCommand(targetID, postCommandRequest, (err, cmd1)=>{
                    if(!!err){
                        done(err);
                        return;
                    }
                    expect(cmd1).not.null;
                    expect(cmd1.commandID).not.equal("");
                    au.getCommand(targetID, cmd.commandID,(err, cmd)=>{
                        if(!!err){
                            done(err);
                            return;
                        }
                        au.listCommands(targetID, null, (err, result)=>{
                            if(!!err){
                                done(err);
                                return;
                            }
                            expect(result.results.length).to.gte(2);
                            done();
                        });
                    });
                });
            });
        });
    });
})