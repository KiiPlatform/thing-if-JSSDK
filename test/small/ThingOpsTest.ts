/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import ThingOps from '../../src/ops/ThingOps'
import {default as request} from '../../src/ops/Request'
import {APIAuthor} from '../../src/APIAuthor'
import {Errors, HttpRequestError, ThingIFError} from '../../src/ThingIFError'

import * as nock from 'nock'
let scope : nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let thingID = "th.7b3f20b00022-414b-6e11-0374-03ab0cf8";
let thingOp = new ThingOps(au, thingID);

describe('Test ThingOps#getVendorThingID', function () {
    let path = `/api/apps/${testApp.appID}/things/${thingID}/vendor-thing-id`;
    let reqHeaders = {
        "Authorrization": `Bearer ${au.token}`
    };
    let expectedVendorThingID = "myID";

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .get(path)
            .reply(
                200,
                {"_vendorThingID": expectedVendorThingID},
                {"Content-Type": "application/vnd.kii.VendorThingIDRetrievalResponse+json"}
            );

        thingOp.getVendorThingID().then((vendorThingID)=>{
            expect(vendorThingID).to.equal(expectedVendorThingID);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 404 error response", function (done) {
        let errResponse = {
            "errorCode": "THING_NOT_FOUND",
            "message": `Thing with thingID ${thingID} was not found`,
            "value": thingID,
            "field": "thingID",
            "appID": testApp.appID
        };

        scope = nock(testApp.site, <any>reqHeaders)
            .get(path)
            .reply(
                404,
                errResponse,
                {"Content-Type": "application/vnd.kii.ThingNotFoundException+json"}
            );

        thingOp.getVendorThingID().then((installID)=>{
            done("should fail");
        }).catch((err:HttpRequestError)=>{
            expect(err).not.be.null;
            expect(err.status).to.equal(404);
            expect(err.name).to.equal(Errors.HttpError);
            expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
            expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
            expect(err.body.message).to.be.equal(errResponse.message);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});

describe('Test ThingOps#updateVendorThingID', function () {
    let path = `/api/apps/${testApp.appID}/things/${thingID}/vendor-thing-id`;
    let reqHeaders = {
        "Content-Type": "application/vnd.kii.VendorThingIDUpdateRequest+json",
        "Authorrization": `Bearer ${au.token}`
    };
    let newVendorThingID = "myID";
    let newPassword = "pass";
    describe("handle ArgumentError", function() {
        class TestCase {
            constructor(
                public newVendorThingID: any,
                public newPassword: any,
                public expectedError: string
            ){}
        }
        let tests = [
            new TestCase(null, null, Errors.ArgumentError),
            new TestCase("", "", Errors.ArgumentError),
            new TestCase(null, "pass", Errors.ArgumentError),
            new TestCase("", "pass", Errors.ArgumentError),
            new TestCase("testID", null, Errors.ArgumentError),
            new TestCase("testID", "", Errors.ArgumentError)
        ];

        tests.forEach(function(test) {
            it("when newVendorThingID="+test.newVendorThingID+", "
                +"newPassword="+test.newPassword+", "+ test.expectedError+" should be returned",
                function(done) {
                thingOp.updateVendorThingID(test.newVendorThingID, test.newPassword)
                .then(()=>{
                    done("should fail");
                }).catch((err)=>{
                    expect(err.name).to.be.equal(Errors.ArgumentError);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
        })
    })

    describe("handle http response", function() {

        beforeEach(function() {
            nock.cleanAll();
        });

        it("handle success response", function (done) {
            scope = nock(testApp.site, <any>reqHeaders)
                .put(path, {
                    "_vendorThingID": newVendorThingID,
                    "_password": newPassword
                })
                .reply(201);

            thingOp.updateVendorThingID(newVendorThingID, newPassword).then(()=>{
                done();
            }).catch((err)=>{
                done(err);
            })
        });

        it("handle 404 error response", function (done) {
            let errResponse = {
                "errorCode": "THING_NOT_FOUND",
                "message": `Thing with thingID ${thingID} was not found`,
                "value": thingID,
                "field": "thingID",
                "appID": testApp.appID
            };

            scope = nock(testApp.site, <any>reqHeaders)
                .put(path, {
                    "_vendorThingID": newVendorThingID,
                    "_password": newPassword
                })
                .reply(
                    404,
                    errResponse,
                    {"Content-Type": "application/vnd.kii.ThingNotFoundException+json"}
                );

            thingOp.updateVendorThingID(newVendorThingID, newPassword).then((installID)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(err).not.be.null;
                expect(err.status).to.equal(404);
                expect(err.name).to.equal(Errors.HttpError);
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                done();
            }).catch((err: Error)=>{
                done(err);
            });
        });
    })
});
