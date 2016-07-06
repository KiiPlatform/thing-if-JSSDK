import {Site} from './Site'
/** Represents Kii Cloud Application */
export class App {

  /** Instantiate Kii App with App Location.
   * If you haven't created Kii Cloud App yet,
   * Please visit https://developer.kii.com and create your app.
   * @param {string} appID ID of the app.
   * @param {stirng} appKey Key of the app.
   * @param {string|number} site Site of the app. Can be url string or [Site]{@link Site}
   */
  constructor(public appID: string, public appKey: string, public site: any){}

  /** Get base url of thing-if api
   * @return {string} base url of thing-if api
   */
  getThingIFBaseUrl(): string{
    return `${this.getRootPath()}/thing-if/apps/${this.appID}`;
  }

  /** Get base url of kii cloud api
   * @return {string} base url of kii cloud api
   */
  getKiiCloudBaseUrl(): string{
     return `${this.getRootPath()}/api/apps/${this.appID}`;
  }

  private getRootPath(): string{
    if (typeof this.site === "string") {
      return this.site
    }else if(typeof this.site == "number"){
      switch (this.site) {
        case Site.US:
          return "https://api.kii.com";
        case Site.JP:
          return "https://api-jp.kii.com";
        case Site.CN3:
          return "https://api-cn3.kii.com";
        case Site.SG:
          return "https://api-sg.kii.com";
        case Site.EU:
          return "https://api-eu.kii.com"
      }
    }
    return null;
  }
}
