/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {ThingIFAPI} from '../../src/ThingIFAPI'
import {TypedID, Types} from '../../src/TypedID'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import * as Options from '../../src/RequestObjects'
import CommandOps from '../../src/ops/CommandOps'
import * as simple from 'simple-mock';
import {Command} from '../../src/Command'
import {QueryResult} from '../../src/QueryResult'
import { AliasAction, Action } from '../../src/AliasAction';

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");

describe("Small Test command APIs of ThingIFAPI", function() {
    describe("Test ThingIFAPI#postNewCommand", function() {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);
        describe("Return IllegalStateError", function() {
            it("when targe is null, IllegalStateError should be returned(promise)",
                function (done) {
                var cmdRequest = new Options.PostCommandRequest([
                    new AliasAction("alias1", [new Action("turnPower", true)])
                ]);
                thingIFAPI.postNewCommand(cmdRequest)
                .then(()=>{
                    done("should fail");
                }).catch((err)=>{
                    expect(err.name).to.equal(Errors.IlllegalStateError);
                    done();
                })
            })
            it("when targe is null, IllegalStateError should be returned(callback)",
                function (done) {
                var cmdRequest = new Options.PostCommandRequest([
                    new AliasAction("alias1", [new Action("turnPower", true)])
                ]);
                thingIFAPI.postNewCommand(cmdRequest,(err, cmd)=>{
                    try{
                        expect(cmd).to.null;
                        expect(err.name).to.equal(Errors.IlllegalStateError);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
        describe("handle succeeded reponse", function() {
            let target = new TypedID(Types.Thing, "dummy-thing-id");
            let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);

            let cmdRequest = new Options.PostCommandRequest([
                new AliasAction("alias1", [new Action("turnPower", true)])
            ]);
            let expectedCommand = new Command(
                target,
                owner,
                cmdRequest.aliasActions);
            expectedCommand.commandID = "dummy-command-id";

            beforeEach(function() {
                simple.mock(CommandOps.prototype, 'postNewCommand').returnWith(
                    new P<Command>((resolve, reject)=>{
                        resolve(expectedCommand);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.postNewCommand(cmdRequest)
                .then((cmd)=>{
                    expect(cmd).to.be.deep.equal(expectedCommand);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.postNewCommand(cmdRequest,(err, cmd)=>{
                    try{
                        expect(err).to.null;
                        expect(cmd).to.be.deep.equal(expectedCommand);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let target = new TypedID(Types.Thing, "dummy-thing-id");
            let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);

            let cmdRequest = new Options.PostCommandRequest([
                new AliasAction("alias1", [new Action("turnPower", true)])
            ]);
            let expectedError = new HttpRequestError(400, Errors.HttpError, {
                    "errorCode": "WRONG_COMMAND",
                    "message": "At least one action is required"
                })

            beforeEach(function() {
                simple.mock(CommandOps.prototype, 'postNewCommand').returnWith(
                    new P<Command>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.postNewCommand(cmdRequest)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.postNewCommand(cmdRequest,(err, cmd)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(cmd).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })

    describe("Test ThingIFAPI#getCommand", function() {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);
        let commandID = "1234235534ferw"
        describe("Return IllegalStateError", function() {
            it("when targe is null, IllegalStateError should be returned(promise)",
                function (done) {
                thingIFAPI.getCommand(commandID)
                .then(()=>{
                    done("should fail");
                }).catch((err)=>{
                    expect(err.name).to.equal(Errors.IlllegalStateError);
                    done();
                })
            })
            it("when targe is null, IllegalStateError should be returned(callback)",
                function (done) {
                thingIFAPI.getCommand(commandID,(err, cmd)=>{
                    try{
                        expect(cmd).to.null;
                        expect(err.name).to.equal(Errors.IlllegalStateError);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
        describe("handle succeeded reponse", function() {
            let target = new TypedID(Types.Thing, "dummy-thing-id");
            let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);

            let expectedCommand = new Command(
                target,
                owner,
                [
                    new AliasAction("alias1", [new Action("turnPower", true)])
                ]);
            expectedCommand.commandID = commandID;

            beforeEach(function() {
                simple.mock(CommandOps.prototype, 'getCommand').returnWith(
                    new P<Command>((resolve, reject)=>{
                        resolve(expectedCommand);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.getCommand(commandID)
                .then((cmd)=>{
                    expect(cmd).to.be.deep.equal(expectedCommand);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.getCommand(commandID,(err, cmd)=>{
                    try{
                        expect(err).to.null;
                        expect(cmd).to.be.deep.equal(expectedCommand);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let target = new TypedID(Types.Thing, "dummy-thing-id");
            let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);

            let expectedError = new HttpRequestError(404, Errors.HttpError, {
                "errorCode": "COMMAND_NOT_FOUND",
                "message": `Command ${commandID} not found`
                });

            beforeEach(function() {
                simple.mock(CommandOps.prototype, 'getCommand').returnWith(
                    new P<Command>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.getCommand(commandID)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.getCommand(commandID,(err, cmd)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(cmd).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })

    describe("Test ThingIFAPI#listCommands", function() {
        let target = new TypedID(Types.Thing, "dummy-thing-id");
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);

        describe("handle succeeded reponse", function() {
            let cmd1 = new Command(target,owner, [
                new AliasAction("alias1", [new Action("turnPower", true)])
            ]);
            let cmd2 = new Command(target,owner, [
                new AliasAction("alias1", [new Action("turnPower", false)])
            ]);
            let cmd3 = new Command(target,owner, [
                new AliasAction("alias1", [new Action("turnPower", true)])
            ]);
            cmd1.commandID = "id1";
            cmd2.commandID = "id2";
            cmd3.commandID = "id3";
            let expectedResults = new QueryResult<Command>([cmd1, cmd2, cmd3], "200/1");

            beforeEach(function() {
                simple.mock(CommandOps.prototype, 'listCommands').returnWith(
                    new P<QueryResult<Command>>((resolve, reject)=>{
                        resolve(expectedResults);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.listCommands()
                .then((result)=>{
                    expect(result).to.be.deep.equal(expectedResults);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.listCommands(null, (err, results)=>{
                    try{
                        expect(err).to.null;
                        expect(results).to.be.deep.equal(results);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let target = new TypedID(Types.Thing, "dummy-thing-id");
            let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);

            let expectedError = new HttpRequestError(404, Errors.HttpError, {
                    "errorCode": "TARGET_NOT_FOUND",
                    "message": `Target ${target.toString()} not found`
                });

            beforeEach(function() {
                simple.mock(CommandOps.prototype, 'listCommands').returnWith(
                    new P<Command>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                let queryOptions = new Options.ListQueryOptions(1, "200/1");
                thingIFAPI.listCommands(null)
                .then(()=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.listCommands(null,(err, results)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(results).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })
})

