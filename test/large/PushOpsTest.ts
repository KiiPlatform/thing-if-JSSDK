/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {testApp} from './utils/TestApp';
import {APIHelper, KiiUser} from './utils/APIHelper';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');

describe('Test installFCM', function () {
    let installationRegistrationID = `${new Date()}`
    let au: any;
    let apiHelper = new APIHelper(testApp);

    beforeEach(function(done) {
        apiHelper.createKiiUser().then(
            (user: KiiUser) => {
                au = thingIFSDK.APIAuthor(user.token, testApp);
                done();
            }
        ).catch(
            (err)=>{
                done(err);
        }
        )
    });

    it("handle success response", function (done) {
        console.log(au);
        au.installFCM(installationRegistrationID, true).then((installID)=>{
            expect(installID).not.null;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 400 error response", function (done) {

        au.installFCM("", true).then((installID)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(400);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});