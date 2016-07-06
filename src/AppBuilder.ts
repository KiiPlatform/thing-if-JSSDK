import {Site} from './Site'
import {App} from './App'

/** Factory of [App]{@link App} */
export namespace AppBuilder{

    /** Create App instace by Site
     * @param {string} appID AppID of Kii App.
     * @param {string} appKey AppKey of Kii App.
     * @param {any} site Site of the app. Can be url string or [Site]{@link Site}.
     * @return {App} App instance.
     */
    export function buildWithSite(appID: string, appKey: string, site: any): App {
        return new App(appID, appKey, site);
    }

    /** Create App instance by hostname.
     * @param {string} appID AppID of Kii App.
     * @param {string} appKey AppKey of Kii App.
     * @param {string} hostname Hostname of Kii App(e.g. api-jp.kii.com)
     * @param {string} urlSchema https by default.
     * @return {App} App instance.
     */
    export function buildWithHostname(appID: string, appKey: string, hostname: string, urlSchema = "https") {
        return new App(appID, appKey, `${urlSchema}://${hostname}`);
    }
}