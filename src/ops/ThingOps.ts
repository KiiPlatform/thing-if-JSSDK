/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import * as KiiUtil from '../internal/KiiUtilities'
import {Errors, ThingIFError} from '../ThingIFError'
export default class ThingOps extends BaseOp {
    private baseUrl: string;
    constructor(
        public au: APIAuthor,
        public thingID: string
    ){
        super(au);
        this.baseUrl = `${this.au.app.getKiiCloudBaseUrl()}/things/${this.thingID}`;
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

    updateFirmwareVersion(newFwVersion: string): Promise<void> {
        return new Promise<void>((resolve, reject)=>{
            if(!newFwVersion){
                reject(new ThingIFError(Errors.ArgumentError, "newFwVersion is null or empty"));
                return;
            }else if(!KiiUtil.isString(newFwVersion)){
                reject(new ThingIFError(Errors.ArgumentError, "newFwVersion is not string"));
                return;
            }

            var req = {
                method: "PUT",
                headers: this.addHeader("Content-Type","application/vnd.kii.ThingFirmwareVersionUpdateRequest+json"),
                url: `${this.baseUrl}/firmware-version`,
                body: {
                    "firmwareVersion": newFwVersion
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
        return new Promise<void>((resolve, reject)=>{
            if(!thingType){
                reject(new ThingIFError(Errors.ArgumentError, "thingType is null or empty"));
                return;
            }else if(!KiiUtil.isString(thingType)){
                reject(new ThingIFError(Errors.ArgumentError, "thingType is not string"));
                return;
            }

            var req = {
                method: "PUT",
                headers: this.addHeader("Content-Type","application/vnd.kii.ThingTypeUpdateRequest+json"),
                url: `${this.baseUrl}/thing-type`,
                body: {
                    "thingType": thingType
                }
            };
            request(req).then((res)=>{
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        })
    }
}

