Javascript SDK for Kii Thing Interaction Framework.

## Build SDK

### Install NPM packages

```
$ cd thing-if-sdk
$ npm install
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
$ npm install typings -g
$ typings install env~mocha --global
$ typings install dt~chai --global
```

### Run npm test
```
$ npm test
```

## Use cases in nodejs
### onboard and send command to a thing

```js
var ThingIF = require('./thing-if-sdk.js');
var app = new ThingIF.KiiApp("app-id", "app-key", ThingIF.Site.JP);
var onboardOptions = new ThingIF.OnboardWithVendorThingIDRequest("th.myTest", "password", "owner-id");
var apiAuthor = new ThingIF.APIAuthor("owner-token",app);

// by promise
apiAuthor.onboardWithVendorThingID(onboardOptions).then(function(res){
    var thingID = res.thingID;
    var commandOptions = new ThingIF.PostCommandRequest(
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

// by callbacks
apiAuthor.onboardWithVendorThingID(onboardOptions,
    function(err, res){
        if (err == null || err == undefined) {
            cosnole.log("onboard failed:" + err);
            // handling err
            return;
        }
        var thingID = res.thingID;
        var commandOptions = new ThingIF.PostCommandRequest(
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