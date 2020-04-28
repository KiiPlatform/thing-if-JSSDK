
import {Promise} from 'es6-promise';
import * as request from 'popsicle';
import {App} from '../../../src/App'
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
export class KiiThing {
    constructor(
        public thingID: string,
        public vendorThingID: string,
        public password: string,
        public token: string
    ){}
}

export class APIHelper {
    static adminTokenCache: any = {};
    private kiiCloudBaseUrl: string;
    private thingIFBaseUrl: string;
    constructor(
        public app: App
    ){
        this.kiiCloudBaseUrl = `${this.app.site}/api/apps/${this.app.appID}`
        this.thingIFBaseUrl = `${this.app.site}/thing-if/apps/${this.app.appID}`
    };
    createKiiThing():Promise<KiiThing> {
        let vendorThingID = `testthing_${(new Date()).getTime()}`;
        let password = 'test12345';
        let reqHeader = {
            "X-Kii-AppID": this.app.appID,
            "X-Kii-AppKey": this.app.appKey,
            "Content-Type": "application/vnd.kii.ThingRegistrationAndAuthorizationRequest+json"
        };
        return new Promise<KiiThing>((resolve, reject)=>{
            request.post(<any>{
                url: `${this.kiiCloudBaseUrl}/things`,
                headers: reqHeader,
                body:{
                    _vendorThingID: vendorThingID,
                    _password: password
                }
            })
            .use(request.plugins.parse(['json'], false))
            .then((res:any)=>{
                if(res.status == 201) {
                    resolve(new KiiThing(res.body._thingID, res.body._vendorThingID, password, res.body._accessToken));
                } else {
                    reject(newError(res));
                }
            });
        });
    }
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
            })
            .use(request.plugins.parse(['json'], false))
            .then((res)=>{
                return new Promise<request.Response>((resolve, reject)=>{
                    if(res.status == 201){
                        return request.post(<any>{
                            url: `${this.app.site}/api/oauth2/token`,
                            headers: reqHeader,
                            body: {
                                username: loginName,
                                password: password
                            }
                        })
                        .use(request.plugins.parse(['json'], false))
                        .then((res)=>{
                            resolve(res);
                        });
                    }else {
                        reject(newError(res));
                    }
                });
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
            });
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
                }).use(request.plugins.parse(['json'], false));
            }).then((res)=>{
                if(res.status == 204) {
                    resolve();
                }else{
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    deleteKiiThing(thingID: string): Promise<void> {
        return new Promise<void>((resolve, reject) =>{
            this.getAdminToken()
            .then((adminToken:string)=>{
                return request.del(<any>{
                    url: `${this.kiiCloudBaseUrl}/things/${thingID}`,
                    headers: {
                        "Authorization": `Bearer ${adminToken}`
                    }
                }).use(request.plugins.parse(['json'], false));
            }).then((res)=>{
                if(res.status == 204) {
                    resolve();
                }else{
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    getAdminToken(): Promise<string> {
        var cachedToken = APIHelper.adminTokenCache[this.app.appID];
        if (cachedToken) {
            return new Promise<string>((resolve, reject) =>{
                resolve(cachedToken);
            });
        }
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
            })
            .use(request.plugins.parse(['json'], false))
            .then((res)=>{
                if(res.status == 200){
                    APIHelper.adminTokenCache[this.app.appID] = res.body.access_token;
                    resolve(res.body.access_token);
                }else {
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    deployServerCode(script: string): Promise<void> {
        return new Promise<void>((resolve, reject) =>{
            var adminToken: string;
            this.getAdminToken()
            .then((token:string)=>{
                adminToken = token;
                return request.post(<any>{
                    url: `${this.kiiCloudBaseUrl}/server-code`,
                    headers: {
                        "X-Kii-AppID": this.app.appID,
                        "X-Kii-AppKey": this.app.appKey,
                        "Content-Type": "application/javascript",
                        "Authorization": `Bearer ${adminToken}`
                    },
                    body: script
                }).use(request.plugins.parse(['json'], false));
            }).then((res)=>{
                return request.put(<any>{
                    url: `${this.kiiCloudBaseUrl}/server-code/versions/current`,
                    headers: {
                        "X-Kii-AppID": this.app.appID,
                        "X-Kii-AppKey": this.app.appKey,
                        "Content-Type": "text/plain",
                        "Authorization": `Bearer ${adminToken}`
                    },
                    body: res.body.versionID
                }).use(request.plugins.parse(['json'], false));
            }).then((res)=>{
                if(res.status == 204){
                    resolve();
                }else {
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            });
        });
    };
    updateThingState(typedID:string, state:Object): Promise<void> {
        return new Promise<void>((resolve, reject) =>{
            this.getAdminToken()
            .then((adminToken:string)=>{
                return request.put(<any>{
                    url: `${this.thingIFBaseUrl}/targets/${typedID}/states`,
                    headers: {
                        "Content-Type": "application/vnd.kii.MultipleTraitState+json",
                        "Authorization": `Bearer ${adminToken}`
                    },
                    body: state
                }).use(request.plugins.parse(['json'], false));
            }).then((res)=>{
                if(res.status == 201 || res.status == 204){
                    resolve();
                }else {
                    reject(newError(res));
                }
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    sleep(msec:number):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, msec);
        });
    }
}

export const apiHelper = new APIHelper(TestApp.testApp);
