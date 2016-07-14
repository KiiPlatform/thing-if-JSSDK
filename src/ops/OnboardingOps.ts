/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {Response} from './Response'
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {OnboardWithThingIDRequest, OnboardWithVendorThingIDRequest} from '../RequestObjects'
import {OnboardingResult} from '../OnboardingResult'
import {MqttEndpoint} from '../OnboardingResult'
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'

import BaseOp from './BaseOp'
export default class OnboardingOps extends BaseOp {
    constructor(public au: APIAuthor){
        super(au);
    }
    onboardWithThingID(
        onboardRequest: OnboardWithThingIDRequest,
        onCompletion?: (err: ThingIFError, result:OnboardingResult)=> void): Promise<OnboardingResult> {

        return new Promise<OnboardingResult>((resolve, reject)=>{
            if (!onboardRequest.thingID) {
                reject(new ThingIFError(Errors.ArgumentError, "thingID is null or empty"));
            }
            if (!onboardRequest.thingPassword) {
                reject(new ThingIFError(Errors.ArgumentError, "thingPassword is null or empty"));
            }
            if (!onboardRequest.owner) {
                reject(new ThingIFError(Errors.ArgumentError, "owner is null or empty"));
            }
            this.onboard(
                "application/vnd.kii.OnboardingWithThingIDByOwner+json",
                onboardRequest
            ).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        });
    }
    onboardWithVendorThingID(
        onboardRequest:OnboardWithVendorThingIDRequest,
        onCompletion?: (err: ThingIFError, result:OnboardingResult)=> void): Promise<OnboardingResult> {

        return new Promise<OnboardingResult>((resolve, reject)=>{
            if (!onboardRequest.vendorThingID) {
                reject(new ThingIFError(Errors.ArgumentError, "vendorThingID is null or empty"));
            }
            if (!onboardRequest.thingPassword) {
                reject(new ThingIFError(Errors.ArgumentError, "thingPassword is null or empty"));
            }
            if (!onboardRequest.owner) {
                reject(new ThingIFError(Errors.ArgumentError, "owner is null or empty"));
            }
            this.onboard(
                "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json",
                onboardRequest
            ).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        });
    }
    onboardEndnode(
        onboardRequest:Object,
        onCompletion?: (err: ThingIFError, result:Object)=> void): Promise<Object> {
        //TODO: implment me
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        })
    }

    private onboard(
        contentType: string,
        onboardRequest: Object): Promise<OnboardingResult> {
        let onboardUrl = `${this.au.app.getThingIFBaseUrl()}/onboardings`;
        var callbackCalled = false;
        return new Promise<OnboardingResult>((resolve, reject) => {
            var headers: Object = this.addHeader("Content-Type", contentType);
            var req = {
                method: "POST",
                headers: headers,
                url: onboardUrl,
                body: onboardRequest,
            };
            request(req).then((res: Response)=>{
                var result = new OnboardingResult(
                    (<any>res).body.thingID,
                    (<any>res).body.accessToken,
                    <MqttEndpoint>(<any>res).body.mqttEndpoint);
                resolve(result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }
}

