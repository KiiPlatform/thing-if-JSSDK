import {Site} from './Site'
/**
 * Represents Kii Cloud Application
 * @prop {string} appID ID of the app.
 * @prop {string} appKey Key of the app.
 * @prop {string} site Url string
 * */
export class App {

    public appID: string;
    public appKey: string;
    public site: string;

    /** Instantiate Kii App with App Location.
     * If you haven't created Kii Cloud App yet,
     * Please visit https://developer.kii.com and create your app.
     * @constructor
     * @param {string} appID ID of the app.
     * @param {stirng} appKey Key of the app.
     * @param {string} site Site of the app. Can be url string or [Site]{@link Site}
     */
    constructor(appID: string, appKey: string, site: string) {
        this.appID = appID;
        this.appKey = appKey;
        this.site = site;
    }

    /** Get base url of thing-if api
     * @return {string} base url of thing-if api
     */
    getThingIFBaseUrl(): string {
        return `${this.site}/thing-if/apps/${this.appID}`;
    }

    /** Get base url of kii cloud api
     * @return {string} base url of kii cloud api
     */
    getKiiCloudBaseUrl(): string {
        return `${this.site}/api/apps/${this.appID}`;
    }

}
