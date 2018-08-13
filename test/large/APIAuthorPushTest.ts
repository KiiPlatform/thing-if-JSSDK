/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

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
    });
})