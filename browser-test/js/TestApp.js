(function(root) {
    var TestApp = {
        "AppID": "YOUR APP ID",
        "AppKey": "YOUR APP KEY",
        "ClientID": "YOUR CLIENT ID",
        "ClientSecret": "YOUR CLIENT SECRET",
        "BaseURL": "https://api-jp.kii.com"
    }
    if (typeof module !== 'undefined' && module.exports) {
        // For Node.js
        module.exports = TestApp;
    } else {
        // For Web Browser
        root.TestApp = TestApp;
    }
})(this);

