/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

describe("Large Tests for Push Ops(ThingIFAPI):", function () {

    let user: KiiUser;
    let thingIFAPI: any;

    before(function(done) {
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

    after(function(done) {
        apiHelper.deleteKiiThing(thingIFAPI.target.id).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    describe('installFCM with promise:', function () {
        let installationRegistrationID = `${new Date()}`

        it("handle success response", function (done) {
            thingIFAPI.installFCM(installationRegistrationID, true).then((installID)=>{
                expect(installID).to.be.a('string');
                // test uninstall
                let callbacksCalled2 = false;
                thingIFAPI.uninstallPush(installID, (err)=>{
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

    describe('installFCM with callback:', function () {
        let installationRegistrationID = `${new Date()}`

        it("handle success response", function (done) {
            thingIFAPI.installFCM(installationRegistrationID, true, (err, installID)=>{
                try{
                    expect(err).to.null;
                    expect(installID).to.be.a('string');
                    done();
                }catch(err){
                    done(err);
                }
            })
        });
    });
})