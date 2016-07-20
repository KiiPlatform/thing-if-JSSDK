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
}
