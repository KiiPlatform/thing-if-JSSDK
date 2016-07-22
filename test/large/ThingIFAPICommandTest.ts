/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import {Command, CommandState} from '../../src/Command'
import {QueryResult} from '../../src/QueryResult'

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
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
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
        var postCommandRequest = new thingIFSDK.PostCommandRequest("led", 1, [{turnPower: {power:true}}])
        var postCommandRequest2 = new thingIFSDK.PostCommandRequest("light", 2, [{turnPower: {power:false}}])
        let command1:Command;
        let command2:Command;
        thingIFAPI.postNewCommand(postCommandRequest).then((cmd:Command)=>{
            // test postNewCommand
            expect(cmd).not.null;
            expect(cmd.commandID).not.null;
            expect(cmd.schema).to.be.equal(postCommandRequest.schema);
            expect(cmd.schemaVersion).to.be.equal(postCommandRequest.schemaVersion);
            expect(cmd.actions).to.be.deep.equal(postCommandRequest.actions);
            expect(cmd.modified).not.null;
            expect(cmd.created).not.null;
            expect(!cmd.commandState).to.true;
            expect(!cmd.title).to.be.true;
            expect(!cmd.description).to.true;
            expect(!cmd.metadata).to.true;
            expect(!cmd.firedByTriggerID).to.true;
            return thingIFAPI.getCommand(cmd.commandID);
        }).then((cmd:Command)=>{
            command1 = cmd;
            // tet getCommand
            expect(cmd).not.null;
            expect(cmd.commandID).not.null;
            expect(cmd.schema).to.be.equal(postCommandRequest.schema);
            expect(cmd.schemaVersion).to.be.equal(postCommandRequest.schemaVersion);
            expect(cmd.actions).to.be.deep.equal(postCommandRequest.actions);
            expect(cmd.modified).not.null;
            expect(cmd.created).not.null;
            expect(cmd.commandState).to.equal(CommandState.SENDING);
            expect(!cmd.title).to.be.true;
            expect(!cmd.description).to.true;
            expect(!cmd.metadata).to.true;
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