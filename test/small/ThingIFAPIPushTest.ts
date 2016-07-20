/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import TestApp from './TestApp'
import {expect} from 'chai';
import {ThingIFAPI} from '../../src/ThingIFAPI'
import {TypedID, Types} from '../../src/TypedID'
import {Errors} from '../../src/ThingIFError'

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);

describe("Test IllegalStateError for push APIs of ThingIFAPI", function() {
    describe("Test APIAuthor#installFCM", function() {
        it("when targe is null, IllegalStateError should be returned",
            function (done) {
            thingIFAPI.installFCM("dummyID", true)
            .then(()=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })
    describe("Test APIAuthor#installMqtt", function() {
        it("when targe is null, IllegalStateError should be returned",
            function (done) {
            thingIFAPI.installMqtt(true)
            .then(()=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("Test APIAuthor#uninstallPush", function() {
        it("when targe is null, IllegalStateError should be returned",
            function (done) {
            thingIFAPI.uninstallPush("dummyID")
            .then(()=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })
})