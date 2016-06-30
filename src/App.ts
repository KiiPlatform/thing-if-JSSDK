import {Site} from './Site'
export class App {
  private appID: string;
  private appKey: string;
  private baseURL: string;
  private site: any;

  /** Instantiate Kii App with App Location.
   * If you haven't created Kii Cloud App yet,
   * Please visit https://developer.kii.com and create your app.
   * @param {string} appID ID of the app.
   * @param {stirng} appKey Key of the app.
   * @param {string|number} site Site of the app. Can be url string or [Site]{@link Site}
   */
  constructor(appID: string, appKey: string, site: any){
      this.appID = appID;
      this.appKey = appKey;
      this.site = site;
  }

  /** Get base url of thing-if api
   * @return {string} base url of thing-if api
   */
  getBaseUrl(): string{
    if (typeof this.site === "string") {
      this.baseURL = this.site
      }else if(typeof this.site == "number"){
          switch (this.site) {
              case Site.US:
                this.baseURL = "https://api.kii.com";
              case Site.JP:
                this.baseURL = "https://api-jp.kii.com";
              case Site.CN3:
                this.baseURL = "https://api-cn3.kii.com";
              case Site.SG:
                this.baseURL = "https://api-sg.kii.com";
              case Site.EU:
                this.baseURL = "https://api-eu.kii.com"
          }
      }
      return `${this.baseURL}/thing-if/apps/${this.appID}`;
   }
}
