/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import {Command, CommandState} from '../../src/Command'
import {QueryResult} from '../../src/QueryResult'
import { TestInfo } from './utils/TestInfo';
import { AliasAction, Action } from '../../src/AliasAction';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for Command APIs(ThingIFAPI):", function () {

    let user: KiiUser;
    let thingIFAPI: any;

    beforeEach(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            thingIFAPI = new thingIFSDK.ThingIFAPI(owner, newUser.token, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                vendorThingID,
                password,
                owner,
                TestInfo.DefaultThingType,
                TestInfo.DefaultFirmwareVersion);
            return thingIFAPI.onboardWithVendorThingID(request)
        }).then(()=>{
            expect(thingIFAPI.target).not.to.be.null;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    afterEach(function(done) {
        apiHelper.deleteKiiThing(thingIFAPI.target.id).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("handle success response by calling ThingIFAPI#postNewCommand, ThingIFAPI#getCommand, and ThingIFAPI#listCommands", function (done) {
        var postCommandRequest =
            new thingIFSDK.PostCommandRequest(
                [
                    new AliasAction(TestInfo.AirConditionerAlias, [
                        new Action("turnPower", true),
                        new Action("setPresetTemperature", 23)
                    ]),
                    new AliasAction(TestInfo.HumidityAlias, [
                        new Action("setPresetHumidity", 45)
                    ])
                ],
                null,
                "title of led",
                "represent led light",
                {"power": "true for power on, and false for power off"});
        var postCommandRequest2 = new thingIFSDK.PostCommandRequest([
            new AliasAction(TestInfo.AirConditionerAlias, [
                new Action("turnPower", false)
            ])
        ]);
        let command1:Command;
        let command2:Command;
        thingIFAPI.postNewCommand(postCommandRequest).then((cmd:Command)=>{
            // test postNewCommand
            expect(cmd).not.null;
            expect(cmd.commandID).not.null;
            expect(cmd.aliasActions).to.be.deep.equal(postCommandRequest.aliasActions);
            // These three fields are assigned by server automatically.
            // postNewCommand method does not get command from server, so these fields should be undefined.
            expect(cmd.modified).to.be.undefined;
            expect(cmd.created).to.be.undefined;
            expect(cmd.commandState).to.be.undefined;

            expect(cmd.title).to.equal("title of led");
            expect(cmd.description).to.equal("represent led light");
            expect(cmd.metadata).to.deep.equal({"power": "true for power on, and false for power off"});
            expect(!cmd.firedByTriggerID).to.true;
            return thingIFAPI.getCommand(cmd.commandID);
        }).then((cmd:Command)=>{
            command1 = cmd;
            // tet getCommand
            expect(cmd).not.null;
            expect(cmd.commandID).not.null;
            expect(JSON.stringify(cmd.aliasActions))
                .equals(JSON.stringify(postCommandRequest.aliasActions));
            expect(cmd.modified).not.null;
            expect(cmd.modified).not.undefined;
            expect(cmd.created).not.null;
            expect(cmd.created).not.undefined;
            expect(cmd.commandState).to.equal(CommandState.SENDING);
            expect(cmd.title).to.equal("title of led");
            expect(cmd.description).to.equal("represent led light");
            expect(cmd.metadata).to.deep.equal({"power": "true for power on, and false for power off"});
            expect(!cmd.firedByTriggerID).to.true;
            return thingIFAPI.postNewCommand(postCommandRequest2);
        }).then((cmd:Command)=>{
            return thingIFAPI.getCommand(cmd.commandID);
        }).then((cmd:Command)=>{
            command2 = cmd;
            return thingIFAPI.listCommands()
        }).then((result:QueryResult<Command>)=>{
            // test listCommands
            var commands = result.results;
            expect(commands.length).to.equal(2);
            for(var i in commands){
                var cmd = commands[i];
                if(cmd.commandID == command1.commandID){
                    expect(cmd).to.deep.equal(command1);
                }else{
                    expect(cmd).to.deep.equal(command2);
                }
            }
            expect(result.hasNext).to.be.false;
            expect(!result.paginationKey).to.be.true;
            done();
        }).catch((err:Error)=>{
            done(err);
        });
    });
})