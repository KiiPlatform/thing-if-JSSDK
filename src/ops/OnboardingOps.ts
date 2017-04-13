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
import * as KiiUtil from '../internal/KiiUtilities'
import {LayoutPosition} from '../LayoutPosition'

import BaseOp from './BaseOp'
export default class OnboardingOps extends BaseOp {
    constructor(public au: APIAuthor){
        super(au);
    }
    onboardWithThingID(onboardRequest: OnboardWithThingIDRequest): Promise<OnboardingResult> {

        return new Promise<OnboardingResult>((resolve, reject)=>{
            if (!onboardRequest.thingID) {
                reject(new ThingIFError(Errors.ArgumentError, "thingID is null or empty"));
                return;
            } else if (!KiiUtil.isString(onboardRequest.thingID)) {
                reject(new ThingIFError(Errors.ArgumentError, "thingID is not string"));
                return;
            }
            if (!onboardRequest.thingPassword) {
                reject(new ThingIFError(Errors.ArgumentError, "thingPassword is null or empty"));
                return;
            } else if (!KiiUtil.isString(onboardRequest.thingPassword)) {
                reject(new ThingIFError(Errors.ArgumentError, "thingPassword is not string"));
                return;
            }
            if (!onboardRequest.owner) {
                reject(new ThingIFError(Errors.ArgumentError, "owner is null"));
                return;
            }
            if (onboardRequest.layoutPosition){

                var layoutPosition = onboardRequest.layoutPosition;
                if(!KiiUtil.isString(layoutPosition)){
                    reject(new ThingIFError(Errors.ArgumentError, "layoutPosition is not string"));
                    return;
                }else{
                    if(!KiiUtil.isValueOfObject(layoutPosition, LayoutPosition)){
                        reject(new ThingIFError(Errors.ArgumentError,
                            "layoutPosition is invalid, should equal to one of values of LayoutPosition"));
                        return;
                    }
                }
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
    onboardWithVendorThingID(onboardRequest:OnboardWithVendorThingIDRequest): Promise<OnboardingResult> {

        return new Promise<OnboardingResult>((resolve, reject)=>{
            if (!onboardRequest.vendorThingID) {
                reject(new ThingIFError(Errors.ArgumentError, "vendorThingID is null or empty"));
                return;
            } else if (!KiiUtil.isString(onboardRequest.vendorThingID)) {
                reject(new ThingIFError(Errors.ArgumentError, "vendorThingID is not string"));
                return;
            }
            if (!onboardRequest.thingPassword) {
                reject(new ThingIFError(Errors.ArgumentError, "thingPassword is null or empty"));
                return;
            } else if (!KiiUtil.isString(onboardRequest.thingPassword)) {
                reject(new ThingIFError(Errors.ArgumentError, "thingPassword is not string"));
                return;
            }
            if (!onboardRequest.owner) {
                reject(new ThingIFError(Errors.ArgumentError, "owner is null"));
                return;
            }
            if (onboardRequest.thingType){
                if(!KiiUtil.isString(onboardRequest.thingType)){
                    reject(new ThingIFError(Errors.ArgumentError, "thingType is not string"));
                    return;
                }
            }
            if (onboardRequest.thingProperties){
                if(!KiiUtil.isObject(onboardRequest.thingProperties)){
                    reject(new ThingIFError(Errors.ArgumentError, "thingProperties is not object"));
                    return;
                }
            }
            if (onboardRequest.firmwareVersion){
                var firmwareVersion = onboardRequest.firmwareVersion;
                if(!KiiUtil.isString(firmwareVersion)){
                    reject(new ThingIFError(Errors.ArgumentError, "firmwareVersion is not string"));
                    return;
                }
            }
            if (onboardRequest.layoutPosition){

                var layoutPosition = onboardRequest.layoutPosition;
                if(!KiiUtil.isString(layoutPosition)){
                    reject(new ThingIFError(Errors.ArgumentError, "layoutPosition is not string"));
                    return;
                }else{
                    if(!KiiUtil.isValueOfObject(layoutPosition, LayoutPosition)){
                        reject(new ThingIFError(Errors.ArgumentError,
                            "layoutPosition is invalid, should equal to one of values of LayoutPosition"));
                        return;
                    }
                }
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
    // onboardEndnode(onboardRequest:Object): Promise<Object> {
    //     //TODO: implment me
    //     return new Promise<Object>((resolve, reject)=>{
    //         resolve({});
    //     })
    // }

    private onboard(
        contentType: string,
        onboardRequest: Object): Promise<OnboardingResult> {
        let onboardUrl = `${this.au.app.getThingIFBaseUrl()}/onboardings`;
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

