import {Site} from './Site';

export class KiiApp {
  private appID: string;
  private appKey: string;
  private baseURL: string;

  /** Instantiate Kii App with App Location.
   * If you haven't created Kii Cloud App yet,
   * Please visit https://developer.kii.com and create your app.
   * @param appID ID of the app.
   * @param appKey Key of the app.
   * @param site Site of the app.
   */
  constructor(appID: string, appKey: string, site: any){
      this.appID = appID;
      this.appKey = appKey;
      if (typeof site === "string") {
        this.baseURL = site
      }else if(typeof site == "Site"){
        this.baseURL = Site.getBaseUrl(site);
      }
  }
}
