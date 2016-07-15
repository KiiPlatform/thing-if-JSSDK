/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe("Large Tests for Push Ops:", function () {

    let user: KiiUser;
    let au: any;

    before(function(done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    after(function(done) {
        apiHelper.deleteKiiUser(user).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    describe('installFCM:', function () {
        let installationRegistrationID = `${new Date()}`

        it("handle success response", function (done) {
            let callbacksCalled = false;
            au.installFCM(installationRegistrationID, true, (err, installID)=>{
                expect(err).to.null;
                expect(installID).to.be.a('string');
                callbacksCalled = true;
            }).then((installID)=>{
                expect(callbacksCalled).to.be.true;
                expect(installID).to.be.a('string');
                // test uninstall
                let callbacksCalled2 = false;
                au.uninstallPush(installID, (err)=>{
                    expect(err).to.null;
                    callbacksCalled2 = true;
                }).then(()=>{
                    expect(callbacksCalled2).to.true;
                    done();
                }).catch((err)=>{
                    done(err);
                })
            }).catch((err)=>{
                done(err);
            })
        });

        it("handle 400 error response", function (done) {
            let callbacksCalled = false;
            au.installFCM(34, true, (err, installID)=>{
                callbacksCalled = true;
                expect(err).not.null;
                expect((<any>err)["status"]).to.equal(400);
                expect(installID).to.be.null;
            }).then((installID)=>{
                done("should fail");
            }).catch((err)=>{
                expect(callbacksCalled).to.true;
                expect(err).not.null;
                expect((<any>err)["status"]).to.equal(400);
                done();
            }).catch((err: Error)=>{
                done(err);
            });
        });
    });

    describe('installMQTT:', function () {

        it("handle success response", function (done) {
            let callbacksCalled = false;
            au.installMqtt(true, (err, result)=>{
                expect(err).to.be.null;
                expect(result.installationID).to.be.a('string');
                callbacksCalled = true;
            }).then((result)=>{
                expect(callbacksCalled).to.be.true;
                expect(result.installationID).to.be.a('string');
                expect(result.installationRegistrationID).to.be.a('string');

                // test uninstall
                let callbacksCalled2 = false;
                au.uninstallPush(result.installationID, (err)=>{
                    expect(err).to.be.null;
                    callbacksCalled2 = true;
                }).then(()=>{
                    expect(callbacksCalled2).to.be.true;
                    done();
                }).catch((err)=>{
                    done(err);
                })
            }).catch((err)=>{
                done(err);
            })
        });

        it("handle 403 error response", function (done) {
            let callbacksCalled = false;
            let invalidAu = new thingIFSDK.APIAuthor(au.token, au.app);
            invalidAu._token = "invalidToken";
            invalidAu.installMqtt(true, (err, result)=>{
                callbacksCalled = true;
                expect(err).not.null;
                expect((<any>err)["status"]).to.equal(403);
                expect(result).to.null;
            }).then((result)=>{
                done("should fail");
            }).catch((err)=>{
                expect(callbacksCalled).to.true;
                expect(err).not.null;
                expect((<any>err)["status"]).to.equal(403);
                done();
            }).catch((err: Error)=>{
                done(err);
            });
        });
    });

    describe('uninstallPush:', function () {

        it("uninstall with non-existing installationID", function (done) {
            let callbacksCalled = false;
            au.uninstallPush(`not-existing-id-${(new Date()).getTime()}`, (err)=>{
                expect(err).not.null;
                expect((<any>err)["status"]).to.equal(404);
                callbacksCalled = true;
            }).then(()=>{
                done("should fail");
            }).catch((err)=>{
                expect(callbacksCalled).to.be.true;
                expect(err).not.null;
                expect((<any>err)["status"]).to.equal(404);
                done();
            }).catch((err: Error)=>{
                done(err);
            });
        });
    });
})