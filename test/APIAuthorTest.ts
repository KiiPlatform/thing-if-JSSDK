/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import * as TestApp from './utils/TestApp';

declare var require: any
let thingIFSDK = require('../../dist/thing-if-sdk.js');

describe('onboard', () => {
    describe('#onboardWithVendorThingID', () => {
        it('onboard should success', (done) => {
            let testApp = new thingIFSDK.App(TestApp.APPID, TestApp.APPKEY, TestApp.SITE);
            let request = new thingIFSDK.OnboardWithVendorThingIDRequest("th.myTest4", "password", new thingIFSDK.TypeID(thingIFSDK.Types.USER, TestApp.OWNERID));
            let author = new thingIFSDK.APIAuthor(TestApp.TOKEN, testApp);
            let callbacksCalled = false;
            author.onboardWithVendorThingID(request, (err: Error, res:Object)=>{
                callbacksCalled = true;
            }).then((res)=>{
                if (!callbacksCalled){
                    done("onCompletion is not called");
                }else{
                    done();
                }
            }).catch((err)=>{
                console.log(err);
                done(err);
            })
         });
    });
});