/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import * as KiiUtil from '../internal/KiiUtilities'
import { Errors, ThingIFError, HttpRequestError } from '../ThingIFError';
export default class ThingOps extends BaseOp {
    private baseUrl: string;
    private thingifUrl: string;
    constructor(
        public au: APIAuthor,
        public thingID: string
    ){
        super(au);
        this.baseUrl = `${this.au.app.getKiiCloudBaseUrl()}/things/${this.thingID}`;
        this.thingifUrl = `${this.au.app.getThingIFBaseUrl()}/things/${this.thingID}`;
    }

    getVendorThingID(): Promise<string> {
        return new Promise<string>((resolve, reject)=>{
            var req = {
                method: "GET",
                headers: this.getHeaders(),
                url: `${this.baseUrl}/vendor-thing-id`
            };
            request(req).then((res)=>{
                resolve((<any>res.body)["_vendorThingID"]);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    updateVendorThingID(
        newVendorThingID: string,
        newPassword: string): Promise<void> {
        return new Promise<void>((resolve, reject)=>{
            if(!newVendorThingID){
                reject(new ThingIFError(Errors.ArgumentError, "newVendorThingID is null or empty"));
                return;
            }else if(!KiiUtil.isString(newVendorThingID)){
                reject(new ThingIFError(Errors.ArgumentError, "newVendorThingID is not string"));
                return;
            }
            if(!newPassword){
                reject(new ThingIFError(Errors.ArgumentError, "newPassword is null or empty"));
                return;
            }else if(!KiiUtil.isString(newPassword)){
                reject(new ThingIFError(Errors.ArgumentError, "newPassword is not string"));
                return;
            }


            var req = {
                method: "PUT",
                headers: this.addHeader("Content-Type","application/vnd.kii.VendorThingIDUpdateRequest+json"),
                url: `${this.baseUrl}/vendor-thing-id`,
                body: {
                    "_vendorThingID": newVendorThingID,
                    "_password": newPassword
                }
            };
            request(req).then((res)=>{
                resolve();
            }).catch((err)=>{
                reject(err);
            });

        })
    }

    updateThingType(thingType: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!thingType) {
                reject(new ThingIFError(Errors.ArgumentError, "thingType is null or empty"));
            } else if (!KiiUtil.isString(thingType)) {
                reject(new ThingIFError(Errors.ArgumentError, "thingType is not string"));
            } else {
                var req = {
                    method: "PUT",
                    headers: this.addHeader("Content-Type", "application/vnd.kii.ThingTypeUpdateRequest+json"),
                    url: `${this.thingifUrl}/thing-type`,
                    body: {
                        "thingType": thingType
                    }
                };
                request(req).then((res) => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }

    getThingType(): Promise<string|null> {
        return new Promise<string|null>((resolve, reject)=>{
            var req = {
                method: "GET",
                headers: this.getHeaders(),
                url: `${this.thingifUrl}/thing-type`
            };
            request(req).then((res)=>{
                resolve((<any>res.body)["thingType"]);
            }).catch((err)=>{
                if (err instanceof HttpRequestError) {
                    if (err.status === 404 && err.body.errorCode === "THING_WITHOUT_THING_TYPE") {
                        resolve(null);
                        return;
                    }
                }
                reject(err);
            });
        });
    }

   updateFirmwareVersion(fwVersion: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!fwVersion) {
                reject(new ThingIFError(Errors.ArgumentError, "firmwareVersion is null or empty"));
            } else if (!KiiUtil.isString(fwVersion)) {
                reject(new ThingIFError(Errors.ArgumentError, "firmwareVersion is not string"));
            } else {
                var req = {
                    method: "PUT",
                    headers: this.addHeader("Content-Type", "application/vnd.kii.ThingFirmwareVersionUpdateRequest+json"),
                    url: `${this.thingifUrl}/firmware-version`,
                    body: {
                        "firmwareVersion": fwVersion
                    }
                };
                request(req).then((res) => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }

    getFirmwareVersion(): Promise<string|null> {
        return new Promise<string|null>((resolve, reject)=>{
            var req = {
                method: "GET",
                headers: this.getHeaders(),
                url: `${this.thingifUrl}/firmware-version`
            };
            request(req).then((res)=>{
                resolve((<any>res.body)["firmwareVersion"]);
            }).catch((err)=>{
                if (err instanceof HttpRequestError) {
                    if (err.status === 404 && err.body.errorCode === "THING_WITHOUT_THING_TYPE") {
                        resolve(null);
                        return;
                    }
                }
                reject(err);
            });
        });
    }
}

