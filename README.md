[![npm version](https://badge.fury.io/js/thing-if.svg)](https://badge.fury.io/js/thing-if)
[![CircleCI](https://circleci.com/gh/KiiPlatform/thing-if-JSSDK/tree/master.svg?style=svg)](https://circleci.com/gh/KiiPlatform/thing-if-JSSDK/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/KiiPlatform/thing-if-JSSDK/badge.svg?branch=master)](https://coveralls.io/github/KiiPlatform/thing-if-JSSDK?branch=master)

Javascript SDK for Kii Thing Interaction Framework.

## Dependecies
- [make-error-cause](https://github.com/blakeembrey/make-error-cause).
- [es6-promise](https://github.com/stefanpenner/es6-promise).
- [popsicle](https://github.com/blakeembrey/popsicle).

## Build SDK

### Install NPM packages

```
$ npm install
```

### Build SDK
thing-if SDK is built as UMD(Universal Module Definition) library.
So your code can load it either with CommonJS style, AMD style or script tag.

#### Normal build

Built with `gulp` command

```
$ npm run build-src
```

If succeeded, library file named `thing-if.js` is available under `./dist/` folder.

## Use thing-if in browser app

**Note**: thing-if SDK uses global Promise, so if the browser doesn't support Promise( like Mircrosoft IE11), it needs to polyfill promise to the browser app.

Basic operations of thing-if SDK are tested and passed on the following browsers: Mozilla Firefox 49.0.1, Safari 9.1.3, Chrome 53.0, and Microsoft Edge 38.

1. Clone this repository

  ```
  $ git clone https://github.com/KiiPlatform/thing-if-JSSDK.git
  ```

2. Bundle library using browserify.

  browserify bundles all the dependencies into a single file.
  ```
  $ cd thing-if-JSSDK
  $ npm install
  $ npm install browserify -g
  $ browserify . -s ThingIF > thing-if.js
  ```

3. Include the bundle file in your browser app

  ```
  <!-- if the browser does not support promise, need to download polyfill promise library(i.e. https://raw.githubusercontent.com/taylorhakes/promise-polyfill/master/promise.js) and import like the following script -->
  <script src="path/to/promise.js"></script>

  <script src="path/to/thing-if.js"></script>
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
You usally need to get user id and token from kii-cloud-sdk, you can simply integrate it with thing-if SDK.

```shell
mkdir MyApp
cd MyApp
npm install kii-cloud-sdk
```

Copy thing-if.js in MyApp direcotry and create
file named Onboarding.js in MyApp directory.

```js
"use strict"
var kiicloud = require("kii-cloud-sdk").create();

var thingIF = require('./thing-if.js');

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
var thingIF = require('./thing-if.js');

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

## Use in Typescript Project

- install thing-if SDK with npm

```
npm install thing-if --save
```

- add reference to your code

```
/// <reference path="./typings/modules/thing-if/index.d.ts" />
import * as ThingIFSDK from 'thing-if'

```

## License

thing-if-JSSDK is released under the Apache 2.0 license. See LICENSE for details.
