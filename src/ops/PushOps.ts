/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {HttpRequestError} from '../ThingIFError'
import MqttInstallationResult from '../MqttInstallationResult'
import {Response} from './Response'
import BaseOp from './BaseOp'

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

    installMqtt(development: boolean): Promise<MqttInstallationResult> {

        return new Promise<MqttInstallationResult>((resolve, reject) => {
            let requestBody = {
                deviceType: "MQTT",
                development: development
            };
            this.installPush(requestBody).then((res)=>{
                let body = res.body;
                let installationID = (<any>body).installationID;
                let installationRegistrationID = (<any>body).installationRegistrationID;
                if(!!installationID && !! installationRegistrationID) {
                    let result = new MqttInstallationResult(installationID, installationRegistrationID);
                    resolve(result);
                }else{
                    let err = new Error();
                    err.name = "InvalidResponse"
                    err.message = "No installationID or installationRegistrationID in response: "+ JSON.stringify(res);
                    reject(err);
                }
            }).catch((err)=>{
                reject(err);
            })
        });
    }

    uninstall(installationID: string): Promise<void> {

        let url = `${this.au.app.getKiiCloudBaseUrl()}/installations/${installationID}`;
        return new Promise<void>((resolve, reject) => {
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