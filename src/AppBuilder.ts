import {Site} from './Site'
import {App} from './App'
export namespace AppBuilder{

    export function buildWithSite(appID: string, appKey: string, site: Site): App {
        return new App(appID, appKey, site);
    }

    export function buildWithHostname(appID: string, appKey: string, hostname: string, urlSchema = "https") {
        return new App(appID, appKey, `${urlSchema}://${hostname}`);
    }
}