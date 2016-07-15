/// <reference path="../../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../../typings/modules/popsicle/index.d.ts" />

import {Promise} from 'es6-promise';
import * as request from 'popsicle';
import {App} from '../../../src/App'
import {RequestOptions} from '~popsicle/dist/request';
import * as TestApp from './TestApp'

function newError(res:Object): Error{
    let status = (<any>res).status;
    let body = (<any>res).body;
    let err = new Error();
    let msgObject: any = {};
    if (!!status){
        msgObject.status = status;
    }
    if (!!body){
        msgObject.body = body;
    }
    err.message = JSON.stringify(msgObject);
    return err;
}
export class KiiUser {
    constructor(
        public userID: string,
        public loginName: string,
        public token: string
    ){}
}

export class APIHelper {
    private kiiCloudBaseUrl: string;
    constructor(
        public app: App
    ){
        this.kiiCloudBaseUrl = `${this.app.site}/api/apps/${this.app.appID}`
    };

    createKiiUser():Promise<KiiUser> {
        let loginName = `testuser_${(new Date()).getTime()}`;
        let password = 'test12345';
        let reqHeader = {
            "X-Kii-AppID": this.app.appID,
            "X-Kii-AppKey": this.app.appKey,
            "Content-Type": "application/json"
        };
        return new Promise<KiiUser>((resolve, reject)=>{
            request.post(<any>{
                url: `${this.kiiCloudBaseUrl}/users`,
                headers: reqHeader,
                body:{
                    loginName: loginName,
                    password: password
                }
            }).then((res)=>{
                if(res.status == 201){
                    return request.post(<any>{
                        url: `${this.app.site}/api/oauth2/token`,
                        headers: reqHeader,
                        body: {
                            username: loginName,
                            password: password
                        }
                    })
                }else {
                    reject(newError(res));
                }
            }).then((res)=>{
                if(res.status == 200){
                    let userID = (<any>res.body)["id"];
                    let token = (<any>res.body)["access_token"];
                    resolve(new KiiUser(userID, loginName, token));
                }else {
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            })
        });
    }
    deleteKiiUser(user: KiiUser): Promise<void> {
        return new Promise<void>((resolve, reject) =>{
            this.getAdminToken()
            .then((adminToken:string)=>{
                return request.del(<any>{
                    url: `${this.kiiCloudBaseUrl}/users/${user.userID}`,
                    headers: {
                        "Authorization": `Bearer ${adminToken}`
                    }
                });
            }).then((res)=>{
                if(res.status == 204) {
                    resolve();
                }else{
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            })
        });
    }
    getAdminToken(): Promise<string> {
        let reqHeader = {
            "X-Kii-AppID": this.app.appID,
            "X-Kii-AppKey": this.app.appKey,
            "Content-Type": "application/json"
        };
        return new Promise<string>((resolve, reject) =>{
            request.post(<any>{
                url: `${this.kiiCloudBaseUrl}/oauth2/token`,
                headers: reqHeader,
                body:{
                    grant_type: "client_credentials",
                    client_id: TestApp.CLIENT_ID,
                    client_secret: TestApp.CLIENT_SECRET
                }
            }).then((res)=>{
                if(res.status == 200){
                    resolve(res.body.access_token);
                }else {
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            })
        });
    }
}

export const apiHelper = new APIHelper(TestApp.testApp);
