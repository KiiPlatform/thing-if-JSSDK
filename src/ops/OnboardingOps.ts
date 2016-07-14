/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {Response} from './Response'
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {OnboardWithThingIDRequest} from '../RequestObjects'
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
        if (!onboardRequest.thingID) {
            if(!!onCompletion){
                onCompletion(new ThingIFError(Errors.ArgumentError, "thingID is null or empty"), null);
                return;
            }
        }
        if (!onboardRequest.thingPassword) {
            if(!!onCompletion){
                onCompletion(new ThingIFError(Errors.ArgumentError, "thingPassword is null or empty"), null);
                return;
            }
        }
        if (!onboardRequest.owner) {
            if(!!onCompletion){
                onCompletion(new ThingIFError(Errors.ArgumentError, "owner is null or empty"), null);
                return;
            }
        }
        return this.onboard("application/vnd.kii.OnboardingWithThingIDByOwner+json", onboardRequest, onCompletion);
    }
    onboardWithVendorThingID(
        onboardRequest:Object, 
        onCompletion?: (err: ThingIFError, result:OnboardingResult)=> void): Promise<OnboardingResult> {
        return this.onboard("application/vnd.kii.OnboardingWithVendorThingIDByOwner+json", onboardRequest, onCompletion);
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
        onboardRequest: Object, 
        onCompletion?: (err: ThingIFError, result:OnboardingResult)=> void): Promise<OnboardingResult> {
        
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
            request(req, (err: Error, res: Response)=>{
                if (err) {
                    reject(err);
                    if(!!onCompletion){
                        onCompletion(err, null);
                    }
                } else {
                    var result = new OnboardingResult((<any>res).body.thingID, (<any>res).body.accessToken, <MqttEndpoint>(<any>res).body.mqttEndpoint);
                    resolve(result);
                    if (!!onCompletion){
                        onCompletion(null, result);
                    }
                }
            });
        });
    }
}

