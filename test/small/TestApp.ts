import {App} from '../../src/App'
export default class TestApp {
    public appID = "abcde";
    public appKey = "1234567abcdedg";
    public site = "https://test.com";
    public app: App;
    constructor(){
        this.app = new App(this.appID, this.appKey, this.site);
    }
}