Javascript SDK for Kii Thing Interaction Framework.

## Dependecies
- [es6-promise](https://github.com/stefanpenner/es6-promise).
- [popsicle](https://github.com/blakeembrey/popsicle).

## Build SDK

### Install NPM packages

```
$ npm install
```

### Install typings

```
$ npm install typings -g
$ typings install
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

#### Use built SDK in browser
You must include the dependencies by yourself. Add them before you import thing-if-js library. Like this:

```
<script src="https://wzrd.in/standalone/popsicle@latest"></script>
<script src="https://wzrd.in/standalone/es6-promise-polyfill@latest"></script>
<script>
    this["es6-promise"]=this.es6PromisePolyfill;
</script>
<script src="path/to/thing-if-sdk.js"></script>

```

## Test

### Configure TestApp
You need to configure `TestApp` as env variable for testing, the format is `[app-id]:[app-key]:[JP|CN3|US|EU|SG]:[client-id]:[client-secret]`

```
$ export TestApp=[app-id]:[app-key]:[JP|CN3|US|EU|SG]:[client-id]:[client-secret]
```

### Run npm test
```
$ npm test
```

## Use cases in nodejs

### Integrate with kii-cloud-sdk
You usally need to get user id and token from kii-cloud-sdk, you can simply integrate it with thing-if-sdk.

```shell
mkdir MyApp
cd MyApp
npm install kii-cloud-sdk
```

Copy thing-if-sdk.js in MyApp direcotry and create
file named Onboarding.js in MyApp directory.

```js
"use strict"
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
            "https://api-jp.kii.com")
    );

    let onboardRequest = new thingIF.OnboardWithVendorThingIDRequest("vendorthing-id", "password", "USER:" + ownerId);
    return apiAuthor.onboardWithVendorThingID(onboardRequest);
}).then(function (res) {
    console.log("onboarded:"+JSON.stringify(res));
}).catch(function (err) {
    console.log(err);
});
```

Execute with node.

```shell
node Onboarding.js
```

### onboard and send command to a thing


Create file named Command.js in YourApp directory.

```js
var thingIF = require('./thing-if-sdk.js');

// <Replace those values>
var appID = "appID";
var appKey = "appKey";
var appSite = thingIF.Site.JP;

var ownerToken = "owner-token";
var ownerID = "owner-id";
var vendorThingID = "th.myTest";
var thingPassword = "password";
// <Replace those values/>

var app = new thingIF.App(appID, appKey, appSite);
var apiAuthor = new thingIF.APIAuthor(ownerToken ,app);
var onboardOptions = new thingIF.OnboardWithVendorThingIDRequest(vendorThingID, thingPassword, ownerID);

// using promise
apiAuthor.onboardWithVendorThingID(onboardOptions).then(function(res){
    var thingID = res.thingID;
    var commandOptions = new thingIF.PostCommandRequest(
        "led-schema",
        1,
        {turnPower:{power: true}},
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
            {turnPower:{power: true}},
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

Execute with node.

```shell
node Command.js
```

