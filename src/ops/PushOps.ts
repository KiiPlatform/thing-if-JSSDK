
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'
import {Response} from './Response'
import BaseOp from './BaseOp'
import * as KiiUtil from '../internal/KiiUtilities'

export default class CommandOps extends BaseOp {
    constructor(
        public au: APIAuthor
    ){
        super(au);
    }

    private installPush(
        requestBody: Object
        ): Promise<Response> {

        let url = `${this.au.app.getKiiCloudBaseUrl()}/installations`;
        return new Promise<Response>((resolve, reject) => {
            let headers = this.addHeaders({'Content-Type': 'application/vnd.kii.InstallationCreationRequest+json'});
            request({
                method: "POST",
                headers: headers,
                url: url,
                body: requestBody,
            }).then((res:Response)=>{
                resolve(res);
            }).catch((err:Error)=>{
                reject(err);
            })
        });
    }

    installFCM(
        installationRegistrationID: string,
        development: boolean
        ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!installationRegistrationID){
                reject(new ThingIFError(Errors.ArgumentError, "installationRegistrationID is null or empty"));
                return;
            }else if (!KiiUtil.isString(installationRegistrationID)){
                reject(new ThingIFError(Errors.ArgumentError, "installationRegistrationID is not a string"));
                return;
            }
            if (!development){
                reject(new ThingIFError(Errors.ArgumentError, "development is null"));
                return;
            }else if (!KiiUtil.isBoolean(development)){
                reject(new ThingIFError(Errors.ArgumentError, "development is not boolean"));
                return;
            }
            let requestBody = {
                installationRegistrationID: installationRegistrationID,
                deviceType: "ANDROID",
                development: development
            };
            this.installPush(requestBody).then((res)=>{
                let body = res.body
                let installationID = (<any>body).installationID;
                resolve(installationID);
            }).catch((err)=>{
                reject(err);
            })
        });
    }

    uninstall(installationID: string): Promise<void> {
        let url = `${this.au.app.getKiiCloudBaseUrl()}/installations/${installationID}`;
        return new Promise<void>((resolve, reject) => {
            if (!installationID){
                reject(new ThingIFError(Errors.ArgumentError, "installationID is null or empty"));
                return;
            }else if(!KiiUtil.isString(installationID)){
                reject(new ThingIFError(Errors.ArgumentError, "installationID is not string"));
                return;
            }
            request({
                method: "DELETE",
                headers: this.getHeaders(),
                url: url,
            }).then((res:Object)=>{
                resolve();
            }).catch((err:Error)=>{
                reject(err);
            })
        });
    }
}