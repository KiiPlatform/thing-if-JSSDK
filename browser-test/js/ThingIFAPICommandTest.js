
var user;
var owner;
var api;
var targetThingID;
var testApp = new ThingIF.App(TestApp.AppID, TestApp.AppKey, TestApp.BaseURL);

QUnit.module("TriggerTest", {
    beforeEach: function(assert) {
        // 1. create KiiUser
        // 2. onboard thing
        var done = assert.async();
        TestHelper.createKiiUser().then(function(newUser) {
            user = newUser;
            owner = new ThingIF.TypedID(ThingIF.Types.User, newUser.userID);
            api = new ThingIF.ThingIFAPI(owner, newUser._accessToken, testApp);
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new ThingIF.OnboardWithVendorThingIDRequest(vendorThingID, password, owner, "MyAirConditioner", "v1");
            return api.onboardWithVendorThingID(request);
        }).then(function(result) {
            targetThingID = result.thingID;
            done();
        }).catch(function(err) {
            console.log("[ERR]" + JSON.stringify(err));
            done(err);
        });
    },
    afterEach: function(assert) {
    }
});
QUnit.test("Large Tests for Command Trigger on the Web Browser", function(assert) {
    var done = assert.async();

    var postCommandRequest =
        new ThingIF.PostCommandRequest(
            [
                new ThingIF.AliasAction("AirConditionerAlias", [
                    new ThingIF.Action("turnPower", true),
                    new ThingIF.Action("setPresetTemperature", 23)
                ]),
                new ThingIF.AliasAction("HumidityAlias", [
                    new ThingIF.Action("setPresetHumidity", 45)
                ])
            ]);
    var postCommandRequest2 = new ThingIF.PostCommandRequest([
        new ThingIF.AliasAction("AirConditionerAlias", [
            new ThingIF.Action("turnPower", false)
        ])
    ]);
    var command1;
    var command2;
    api.postNewCommand(postCommandRequest).then(function(cmd) {
        // test postNewCommand
        assert.ok(cmd);
        assert.ok(cmd.commandID);
        assert.equal(cmd.schema, postCommandRequest.schema);
        assert.equal(cmd.schemaVersion, postCommandRequest.schemaVersion);
        assert.deepEqual(cmd.actions, postCommandRequest.actions);
        assert.notOk(cmd.modified);
        assert.notOk(cmd.created);
        assert.notOk(cmd.commandState);
        assert.notOk(cmd.title);
        assert.notOk(cmd.description);
        assert.notOk(cmd.metadata);
        assert.notOk(cmd.firedByTriggerID);
        return api.getCommand(cmd.commandID);
    }).then(function(cmd) {
        command1 = cmd;
        // tet getCommand
        assert.ok(cmd);
        assert.ok(cmd.commandID);
        assert.equal(cmd.schema, postCommandRequest.schema);
        assert.equal(cmd.schemaVersion, postCommandRequest.schemaVersion);
        assert.deepEqual(cmd.actions, postCommandRequest.actions);
        assert.ok(cmd.modified);
        assert.ok(cmd.created);
        assert.equal(cmd.commandState, "SENDING");
        assert.notOk(cmd.title);
        assert.notOk(cmd.description);
        assert.notOk(cmd.metadata);
        assert.notOk(cmd.firedByTriggerID);
        return api.postNewCommand(postCommandRequest2);
    }).then(function(cmd) {
        return api.getCommand(cmd.commandID);
    }).then(function(cmd) {
        command2 = cmd;
        return api.listCommands()
    }).then(function(result) {
        // test listCommands
        var commands = result.results;
        assert.equal(commands.length, 2);
        for(var i in commands){
            var cmd = commands[i];
            if(cmd.commandID == command1.commandID){
                assert.deepEqual(cmd, command1);
            }else{
                assert.deepEqual(cmd, command2);
            }
        }
        assert.notOk(result.hasNext);
        assert.notOk(result.paginationKey);
        done();
    }).catch(function(err) {
        done(err);
    });
});