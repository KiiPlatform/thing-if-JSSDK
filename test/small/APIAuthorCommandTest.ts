/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {APIAuthor} from '../../src/APIAuthor'
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
let au = new APIAuthor("dummy-token", testApp.app);
let target = new TypedID(Types.Thing, "dummy-thing-id");

describe("Small Test command APIs of APIAuthor", function() {
    describe("Test APIAuthor#postNewCommand", function() {

        describe("handle succeeded reponse", function() {
            let cmdRequest = new Options.PostCommandRequest([
                new AliasAction("alias1", [new Action("turnPower", true)])
            ], owner);
            let expectedCommand = new Command(
                target,
                owner,
                cmdRequest.aliasActions);
            expectedCommand.commandID = "dummy-id";

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
                au.postNewCommand(target, cmdRequest)
                .then((cmd)=>{
                    expect(cmd).to.be.deep.equal(expectedCommand);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.postNewCommand(target, cmdRequest,(err, cmd)=>{
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

            let cmdRequest = new Options.PostCommandRequest([
                new AliasAction("alias1", [new Action("turnPower", true)])
                ], owner);
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
                au.postNewCommand(target, cmdRequest)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.postNewCommand(target, cmdRequest,(err, cmd)=>{
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

    describe("Test APIAuthor#getCommand", function() {
        let commandID = "1234235534ferw"

        describe("handle succeeded reponse", function() {

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
                au.getCommand(target, commandID)
                .then((cmd)=>{
                    expect(cmd).to.be.deep.equal(expectedCommand);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.getCommand(target, commandID,(err, cmd)=>{
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
                au.getCommand(target, commandID)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.getCommand(target, commandID,(err, cmd)=>{
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

    describe("Test APIAuthor#listCommands", function() {

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
                au.listCommands(target)
                .then((result)=>{
                    expect(result).to.be.deep.equal(expectedResults);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.listCommands(target, null, (err, results)=>{
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
                au.listCommands(target, null)
                .then(()=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.listCommands(target, null,(err, results)=>{
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

