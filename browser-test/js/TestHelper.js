(function(root) {
    function TestHelper(){};
    TestHelper.getKiiCloudBaseUrl = function() {
        return TestApp.BaseURL + "/api/apps/" + TestApp.AppID;
    }
    TestHelper.getKiiThingIFBaseUrl = function() {
        return TestApp.BaseURL + "/thing-if/apps/" + TestApp.AppID;
    }
    TestHelper.getAdminToken = function() {
        let reqHeader = {
            "X-Kii-AppID": TestApp.AppID,
            "X-Kii-AppKey": TestApp.AppKey,
            "Content-Type": "application/json"
        };
        return new Promise(function(resolve, reject) {
            popsicle.post({
                "url": TestApp.BaseURL + "/api/oauth2/token",
                "headers": reqHeader,
                "body":{
                    "grant_type": "client_credentials",
                    "client_id": TestApp.ClientID,
                    "client_secret": TestApp.ClientSecret
                }
            }).then(function(res) {
                if (res.status == 200){
                    resolve(res.body.access_token);
                } else {
                    reject(res.body);
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    }
    TestHelper.createKiiUser = function() {
        //
        var loginName = "testuser_" + new Date().getTime();
        var password = 'test12345';
        var reqHeader = {
            "X-Kii-AppID": TestApp.AppID,
            "X-Kii-AppKey": TestApp.AppKey,
            "Content-Type": "application/vnd.kii.RegistrationAndAuthorizationRequest+json"
        };
        return new Promise(function(resolve, reject) {
            popsicle.post({
                "url": TestHelper.getKiiCloudBaseUrl() + "/users",
                "headers": reqHeader,
                "body":{
                    "loginName": loginName,
                    "password": password
                }
            }).then(function(res) {
                if(res.status == 201){
                    resolve(res.body);
                }else {
                    reject(res.body);
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    }
    TestHelper.createKiiThing = function() {
        var vendorThingID = "testthing_" + new Date().getTime();
        var password = 'test12345';
        var reqHeader = {
            "X-Kii-AppID": TestApp.AppID,
            "X-Kii-AppKey": TestApp.AppKey,
            "Content-Type": "application/vnd.kii.ThingRegistrationAndAuthorizationRequest+json"
        };
        return new Promise(function(resolve, reject) {
            popsicle.post({
                "url": TestHelper.getKiiCloudBaseUrl() + "/things",
                "headers": reqHeader,
                "body":{
                    "_vendorThingID": vendorThingID,
                    "_password": password
                }
            }).then(function(res) {
                if(res.status == 201) {
                    resolve(res.body);
                } else {
                    reject(res.body);
                }
            }).catch(function(err) {
                reject(err);
            });
        });

    }
    TestHelper.deployServerCode = function(script) {
        return new Promise(function(resolve, reject) {
            var adminToken;
            TestHelper.getAdminToken()
            .then(function(token) {
                adminToken = token;
                return popsicle.post({
                    url: TestHelper.getKiiCloudBaseUrl() + "/server-code",
                    headers: {
                        "X-Kii-AppID": TestApp.AppID,
                        "X-Kii-AppKey": TestApp.AppKey,
                        "Content-Type": "application/javascript",
                        "Authorization": "Bearer " + adminToken
                    },
                    body: script
                });
            }).then(function(res) {
                return popsicle.put({
                    url: `${this.kiiCloudBaseUrl}/server-code/versions/current`,
                    headers: {
                        "X-Kii-AppID": TestApp.AppID,
                        "X-Kii-AppKey": TestApp.AppKey,
                        "Content-Type": "text/plain",
                        "Authorization": "Bearer " + adminToken
                    },
                    body: res.body.versionID
                });
            }).then(function(res) {
                if(res.status == 204){
                    resolve();
                }else {
                    reject(res.body);
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    }
    TestHelper.updateThingState = function(typedID, state) {
        return new Promise(function(resolve, reject) {
            this.getAdminToken()
            .then(function(adminToken) {
                return popsicle.put({
                    url: TestHelper.getKiiThingIFBaseUrl() + "/targets/" + typedID + "/states",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + adminToken
                    },
                    body: state
                });
            }).then(function(res) {
                if(res.status == 201 || res.status == 204){
                    resolve();
                }else {
                    reject(newError(res));
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    }
    TestHelper.sleep = function(msec) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve()
            }, msec);
        });
    }
    if (typeof module !== 'undefined' && module.exports) {
        // For Node.js
        module.exports = TestHelper;
    } else {
        // For Web Browser
        root.TestHelper = TestHelper;
    }
})(this);