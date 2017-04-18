/**
 * Represent a Server Code of Kii Cloud
 * @prop {string} endpoint Endpoint to call on servercode.
 * @prop {string} executorAccessToken This token will be used to call servercode endpoint. Must be non-empty if provided.
 * @prop {string} targetAppID If provided, servercode endpoint will be called for this appid. Otherwise same appID of trigger is used.
 * @prop {Object} parameters Parameters to pass to the servercode function.
 */
export class ServerCode{
    /**
     * Create a ServerCode.
     * @constructor
     * @param {string} endpoint Endpoint to call on servercode.
     * @param {string} [executorAccessToken] This token will be used to call servercode endpoint. Must be non-empty if provided.
     * @param {string} [targetAppID] If provided, servercode endpoint will be called for this appid. Otherwise same appID of trigger is used.
     * @param {string} [parameters] Parameters to pass to the servercode function.
     */
    constructor(
        public endpoint: string,
        public executorAccessToken?: string,
        public targetAppID?: string,
        public parameters?: Object
    ) {}
}
