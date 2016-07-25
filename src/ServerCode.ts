/** Represent a Server Code of Kii Cloud */
export class ServerCode{
    /**
     * Endpoint to call on servercode.
     * @type {string}
     */
    public endpoint: string;
    /**
     * This token will be used to call servercode endpoint. Must be non-empty if provided.
     * @type {string}
     */
    public executorAccessToken: string;
    /**
     * If provided, servercode endpoint will be called for this appid. Otherwise same appID of trigger is used.
     * @type {string}
     */
    public targetAppID: string;
    /**
     * Parameters to pass to the servercode function.
     * @type {Object}
     */
    public parameters: Object;

    /**
     * Create a ServerCode.
     * @constructor
     * @param {string} endpoint Endpoint to call on servercode.
     * @param {string} [executorAccessToken] This token will be used to call servercode endpoint. Must be non-empty if provided.
     * @param {string} [targetAppID] If provided, servercode endpoint will be called for this appid. Otherwise same appID of trigger is used.
     * @param {string} [parameters] Parameters to pass to the servercode function.
     */
    constructor(
        endpoint: string,
        executorAccessToken?: string,
        targetAppID?: string,
        parameters?: Object
    ) {
        this.endpoint = endpoint;
        this.executorAccessToken = executorAccessToken;
        this.targetAppID = targetAppID;
        this.parameters = parameters;
    }
    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
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
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a ServerCode.
     * @return {ServerCode} ServerCode instance
     */
    static fromJson(obj:any): ServerCode {
        let endpoint = obj.endpoint;
        let executorAccessToken = obj.executorAccessToken ? obj.executorAccessToken : null;
        let targetAppID = obj.targetAppID ? obj.targetAppID : null;
        let parameters = obj.parameters ? obj.parameters : null;
        return new ServerCode(endpoint, executorAccessToken, targetAppID, parameters);
    }
}
