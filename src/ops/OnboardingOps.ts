/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';

export function onboardWithThingID(
    au: APIAuthor, 
    onboardRequest: Object, 
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    return onboard(au, "application/vnd.kii.OnboardingWithThingIDByOwner+json", onboardRequest, onCompletion);
}
export function onboardWithVendorThingID(
    au: APIAuthor, 
    onboardRequest:Object, 
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    return onboard(au, "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json", onboardRequest, onCompletion);
}

function onboard(
    au: APIAuthor,
    contentType: string,
    onboardRequest: Object, 
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    let onboardUrl = `${au.app.getThingIFBaseUrl()}/onboardings`;

    return new Promise<Object>((resolve, reject) => {
        request({
            method: "POST",
            headers:{
                'Content-type': contentType,
                'Authorization': `Bearer ${au.token}`
            },
            url: onboardUrl,
            body: onboardRequest,
        }).then((res:Object)=>{
            resolve(res);
            if (!!onCompletion){
                onCompletion(null, res);
            }
        }).catch((err:Error)=>{
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

