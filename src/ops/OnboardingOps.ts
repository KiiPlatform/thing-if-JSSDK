/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {OnboardingResult} from '../OnboardingResult'
import * as utils from './OpsUtils';

export function onboardWithThingID(
    au: APIAuthor, 
    onboardRequest: Object, 
    onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult> {
    return onboard(au, "application/vnd.kii.OnboardingWithThingIDByOwner+json", onboardRequest, onCompletion);
}
export function onboardWithVendorThingID(
    au: APIAuthor, 
    onboardRequest:Object, 
    onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult> {
    return onboard(au, "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json", onboardRequest, onCompletion);
}

function onboard(
    au: APIAuthor,
    contentType: string,
    onboardRequest: Object, 
    onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult> {
    
    let onboardUrl = `${au.app.getThingIFBaseUrl()}/onboardings`;
console.log("##### onboardUrl=" + onboardUrl);
    return new Promise<OnboardingResult>((resolve, reject) => {
        var headers: any = utils.newHttpHeader(au);
        headers['Content-type'] = contentType;
console.log("##### headers=" + JSON.stringify(headers));
        request({
            method: "POST",
            headers: headers,
            url: onboardUrl,
            body: onboardRequest,
        }).then((res:Object)=>{
console.log("##### res=" + JSON.stringify(res));
            resolve(<OnboardingResult>res);
            if (!!onCompletion){
                onCompletion(null, <OnboardingResult>res);
            }
        }).catch((err:Error)=>{
console.log("##### err=" + JSON.stringify(err));
            reject(err);
            if(!!onCompletion){
                onCompletion(err, null);
            }
        })
    });
}

export function onboardEndnode(
    au: APIAuthor, 
    onboardRequest:Object, 
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

