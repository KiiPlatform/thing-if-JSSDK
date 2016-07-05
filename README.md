Javascript SDK for Kii Thing Interaction Framework.

## Build SDK

### Install NPM packages

```
$ cd thing-if-sdk
$ npm install
```

### Install typings

```
$ npm install typings -g
$ typings install es6-promise
```

### Build SDK
thing-if-sdk is built as UMD(Universal Module Definition) library.
So your code can load it either with CommonJS style, AMD style or script tag.

#### Normal build

Built with `gulp` command

```
$ gulp
```

If succeeded, library file named `thing-if-sdk.js` is available under `./dist/` folder.

#### Uglify build
Built with `--u` option.

```
$ gulp --u
```

If succeeded, uglified library file named `thing-if-sdk.min.js` is available under `./dist/` folder.

## Test

### Install typyings for test framework
We use Mocha together with Chai for unit-testing.

```
$ typings install env~mocha --global
$ typings install dt~chai --global
```

### Run npm test
```
$ npm test
```

## Use cases in nodejs

### Integrate with kii-cloud-sdk
You usally need to get user id and token from kii-cloud-sdk, you can simply integrate it with thing-if-sdk.

```js
require("jquery-xhr"); // necessary for kii-cloud-sdk
var kiicloud = require("kii-cloud-sdk").create();

var thingIF = require('./thing-if-sdk.js');

var appid = "****",
    appkey = "****",
    site = kiicloud.KiiSite.JP;

kiicloud.Kii.initializeWithSite(appid, appkey, site);

// an already registered kii user
var username = "user-name";
var pass = "pass";

kiicloud.KiiUser.authenticate(username, pass).then(function (authedUser) {
    var token = authedUser.getAccessToken();
    var ownerId = authedUser.getID();

    var apiAuthor = new thingIF.APIAuthor(
        token,
        new thingIF.App(
            kiicloud.Kii.getAppID(),
            kiicloud.Kii.getAppKey(),
            kiicloud.Kii.getBaseURL())
    );

    let onboardRequest = new thingIF.OnboardWithVendorThingIDRequest("vendorthing-id", "password", ownerId);
    return apiAuthor.onboardWithVendorThingID(onboardRequest);
}).then(function (res) {
    console.log("onboarded:"+JSON.stringify(res));
}).catch(function (err) {
    console.log(err);
});
```
### onboard and send command to a thing

```js
var thingIF = require('./thing-if-sdk.js');
var app = new thingIF.App("app-id", "app-key", ThingIF.Site.JP);
var apiAuthor = new thingIF.APIAuthor("owner-token",app);
var onboardOptions = new thingIF.OnboardWithVendorThingIDRequest("th.myTest", "password", "owner-id");

// using promise
apiAuthor.onboardWithVendorThingID(onboardOptions).then(function(res){
    var thingID = res.thingID;
    var commandOptions = new thingIF.PostCommandRequest(
        "led-schema",
        1,
        {turnPower:{power: true}}
        "issuer-id", // user id of issuer for this command
        "command-target-id" // thingID of thing to send this command
    );
    return apiAuthor.postNewCommand(thingID, commandOptions);
}).then(function(command){
    console.log("command created:"+command.commandID);
}).catch(function(err){
    console.log(err);
});

// using callbacks
apiAuthor.onboardWithVendorThingID(onboardOptions,
    function(err, res){
        if (err == null || err == undefined) {
            cosnole.log("onboard failed:" + err);
            // handling err
            return;
        }
        var thingID = res.thingID;
        var commandOptions = new thingIF.PostCommandRequest(
            "led-schema",
            1,
            {turnPower:{power: true}}
            "issuer-id", // user id of issuer for this command
            "command-target-id" // thingID of thing to send this command
        );
        apiAuthor.postNewCommand(thingID, commandOptions,
            function(err, command){
                if (err == null || err == undefined) {
                    cosnole.log("post command failed:" + err);
                    // handling err
                    return;
                }
                console.log("command created:"+command.commandID);
            }
        );
    }
);
```
##TODO
- Declaration File for SDK