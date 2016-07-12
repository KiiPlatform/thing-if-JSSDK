/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import {ErrorBase, HttpRequestError} from '../ThingIFError'
import MqttInstallationResult from '../MqttInstallationResult'
import {Response} from './Response'

function installPush(
    au: APIAuthor,
    requestBody: Object
    ): Promise<Response> {

    let url = `${au.app.getKiiCloudBaseUrl()}/installations`;
    return new Promise<Response>((resolve, reject) => {
        request({
            method: "POST",
            headers:{
                'Content-type': 'application/vnd.kii.InstallationCreationRequest+json',
                'Authorization': `Bearer ${au.token}`
            },
            url: url,
            body: requestBody,
        }).then((res:Response)=>{
            resolve(res);
        }).catch((err:Error)=>{
            reject(err);
        })
    });
}

export function installFCM(
    au: APIAuthor,
    installationRegistrationID: string,
    development: boolean,
    onCompletion?: (err:Error, res:string)=>void): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let requestBody = {
            installationRegistrationID: installationRegistrationID,
            deviceType: "ANDROID",
            development: development
        };
        installPush(au, requestBody).then((res)=>{
            let body = res.body
            let installationID = (<any>body).installationID;
            if(!!installationID) {
                resolve(installationID);
                if (!!onCompletion) {
                    onCompletion(null, installationID);
                }
            }else{
                let err = new Error();
                err.name = "InvalidResponse"
                err.message = "No installationID in response: "+ JSON.stringify(res);
                reject(err);
                if (!!onCompletion) {
                    onCompletion(err, null);
                }
            }
        }).catch((err)=>{
            reject(err);
            if(!!onCompletion) {
                onCompletion(err, null);
            }
        })
    });
}

export function installMqtt(
    au:APIAuthor,
    development: boolean,
    onCompletion?: (err:Error, res:MqttInstallationResult)=>void): Promise<MqttInstallationResult> {

    return new Promise<MqttInstallationResult>((resolve, reject) => {
        let requestBody = {
            deviceType: "MQTT",
            development: development
        };
        installPush(au, requestBody).then((res)=>{
            let body = res.body;
            let installationID = (<any>body).installationID;
            let installationRegistrationID = (<any>body).installationRegistrationID;
            if(!!installationID && !! installationRegistrationID) {
                let result = new MqttInstallationResult(installationID, installationRegistrationID);
                resolve(result);
                if (!!onCompletion) {
                    onCompletion(null, result);
                }
            }else{
                let err = new Error();
                err.name = "InvalidResponse"
                err.message = "No installationID or installationRegistrationID in response: "+ JSON.stringify(res);
                reject(err);
                if (!!onCompletion) {
                    onCompletion(err, null);
                }
            }
        }).catch((err)=>{
            reject(err);
            if(!!onCompletion) {
                onCompletion(err, null);
            }
        })
    });
}

export function uninstall(
    au: APIAuthor,
    installationID: string,
    onCompletion?: (err:Error)=>void): Promise<void> {

    let url = `${au.app.getKiiCloudBaseUrl()}/installations/${installationID}`;
    return new Promise<void>((resolve, reject) => {
        request({
            method: "DELETE",
            headers:{
                'Authorization': `Bearer ${au.token}`
            },
            url: url,
        }).then((res:Object)=>{
            resolve();
            if (!!onCompletion){
                onCompletion(null);
            }
        }).catch((err:Error)=>{
            reject(err);
            if(!!onCompletion){
                onCompletion(err);
            }
        })
    });
}