/** Represent a Server Code of Kii Cloud */
export class ServerCode{
    constructor(
        public endpoint: string,
        public executorAccessToken?: string,
        public targetAppID?: string,
        public parameters?: Object
    ){}
    toJson(): any {
        var json: any = {endpoint: this.endpoint};
        if (this.executorAccessToken) {
            json["executorAccessToken"] = this.executorAccessToken;
        }
        if (this.targetAppID) {
            json["targetAppID"] = this.targetAppID;
        }
        if (this.parameters) {
            json["parameters"] = this.parameters;
        }
        return json;
    }
    static fromJson(obj:any): ServerCode {
        let endpoint = obj.endpoint;
        let executorAccessToken = obj.executorAccessToken ? obj.executorAccessToken : null;
        let targetAppID = obj.targetAppID ? obj.targetAppID : null;
        let parameters = obj.parameters ? obj.parameters : null;
        return new ServerCode(endpoint, executorAccessToken, targetAppID, parameters);
    }
}
