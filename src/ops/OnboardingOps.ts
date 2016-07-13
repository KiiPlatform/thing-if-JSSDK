/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {OnboardingResult} from '../OnboardingResult'
import * as utils from './OpsUtils';

import BaseOp from './BaseOp'
export default class OnboardingOps extends BaseOp {
    constructor(public au: APIAuthor){
        super(au);
    }
    onboardWithThingID(
        onboardRequest: Object, 
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult> {
        return this.onboard("application/vnd.kii.OnboardingWithThingIDByOwner+json", onboardRequest, onCompletion);
    }
    onboardWithVendorThingID(
        onboardRequest:Object, 
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult> {
        return this.onboard("application/vnd.kii.OnboardingWithVendorThingIDByOwner+json", onboardRequest, onCompletion);
    }
    onboardEndnode(
        onboardRequest:Object, 
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
        //TODO: implment me
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        })
    }
    private onboard(
        contentType: string,
        onboardRequest: Object, 
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult> {
        
        let onboardUrl = `${this.au.app.getThingIFBaseUrl()}/onboardings`;
        return new Promise<OnboardingResult>((resolve, reject) => {
            var headers: any = this.addHeader("Content-Type", contentType);
            // var headers: any = this.addHeaders({"Content-type": contentType});
            // var headers: any = this.getHeaders();
            request({
                method: "POST",
                headers: headers,
                url: onboardUrl,
                body: onboardRequest,
            }).then((res:Object)=>{
                resolve(<OnboardingResult>res);
                if (!!onCompletion){
                    onCompletion(null, <OnboardingResult>res);
                }
            }).catch((err:Error)=>{
                reject(err);
                if(!!onCompletion){
                    onCompletion(err, null);
                }
            })
        });
    }
}

