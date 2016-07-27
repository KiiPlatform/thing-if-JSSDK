
var user;
var owner;
var api;
var adminToken;
var targetThingID;
var testApp = new ThingIF.App(TestApp.AppID, TestApp.AppKey, TestApp.BaseURL);

QUnit.module("TriggerTest", {
    beforeEach: function(assert) {
        // 1. create KiiUser
        // 2. get AdminToken
        // 3. onboard thing
        var done = assert.async();
        TestHelper.createKiiUser().then(function(newUser) {
            user = newUser;
            owner = new ThingIF.TypedID(ThingIF.Types.User, newUser.userID);
            api = new ThingIF.ThingIFAPI(owner, newUser._accessToken, testApp);
            return TestHelper.getAdminToken();
        }).then(function(token) {
            adminToken = token;
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new ThingIF.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
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

    var triggerID1;
    var triggerID2;
    var schema = "led";
    var schemaVersion = 1;
    var actions = [{turnPower: {power:true}}, {setColor: {color: [255,0,255]}}];
    var issuerID = new ThingIF.TypedID(ThingIF.Types.User, user.userID);
    var targetID = api.target;
    var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false"));
    var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
    var request = new ThingIF.CommandTriggerRequest(schema, schemaVersion, actions, statePredicate, issuerID);

    // 1. create command trigger with StatePredicate
    api.postCommandTrigger(request).then(function(trigger) {

        triggerID1 = trigger.triggerID;
        assert.ok(triggerID1);
        assert.notOk(trigger.disabled);
        assert.equal(trigger.predicate.getEventSource(), "STATES");
        assert.equal(trigger.predicate.triggersWhen, "CONDITION_CHANGED");
        assert.deepEqual(trigger.predicate.condition, condition);
        assert.equal(trigger.command.schema, schema);
        assert.equal(trigger.command.schemaVersion, schemaVersion);
        assert.deepEqual(trigger.command.actions, actions);
        assert.deepEqual(trigger.command.targetID, targetID);
        assert.deepEqual(trigger.command.issuerID, issuerID);
        assert.notOk(trigger.serverCode);

        // 2. create command trigger with SchedulePredicate
        var schedulePredicate = new ThingIF.SchedulePredicate("0 12 1 * *");
        request = new ThingIF.CommandTriggerRequest(schema, schemaVersion, actions, schedulePredicate, issuerID);
        // Admin token is needed when allowCreateTaskByPrincipal=false
        api._au._token = adminToken;
        return api.postCommandTrigger(request);
    }).then(function(trigger) {
        triggerID2 = trigger.triggerID;
        assert.ok(triggerID2);
        assert.notOk(trigger.disabled);
        assert.equal(trigger.predicate.schedule, "0 12 1 * *");
        assert.equal(trigger.command.schema, schema);
        assert.equal(trigger.command.schemaVersion, schemaVersion);
        assert.deepEqual(trigger.command.actions, actions);
        assert.deepEqual(trigger.command.targetID, targetID);
        assert.deepEqual(trigger.command.issuerID, issuerID);
        assert.notOk(trigger.serverCode);

        // 3. disable trigger
        return api.enableTrigger(triggerID2, false);
    }).then(function(trigger) {
        assert.equal(trigger.triggerID, triggerID2);
        assert.ok(trigger.disabled);
        assert.equal(trigger.predicate.schedule, "0 12 1 * *");
        assert.equal(trigger.command.schema, schema);
        assert.equal(trigger.command.schemaVersion, schemaVersion);
        assert.deepEqual(trigger.command.actions, actions);
        assert.deepEqual(trigger.command.targetID, targetID);
        assert.deepEqual(trigger.command.issuerID, issuerID);
        assert.notOk(trigger.serverCode);
        
        // 4. list triggers
        api._au._token = user._accessToken;
        return api.listTriggers(new ThingIF.ListQueryOptions());
    }).then(function(queryResult) {
        assert.equal(queryResult.results.length, 2);
        assert.notOk(queryResult.paginationKey);
        assert.notOk(queryResult.hasNext);
        var trigger1 = queryResult.results[0];
        for (var i = 0; i < queryResult.results.length; i++) {
            var trigger = queryResult.results[i];
            if (trigger.triggerID == triggerID1) {
                assert.notOk(trigger.disabled);
                assert.equal(trigger.predicate.getEventSource(), "STATES");
                assert.equal(trigger.predicate.triggersWhen, "CONDITION_CHANGED");
                assert.deepEqual(trigger.predicate.condition, condition);
                assert.equal(trigger.command.schema, schema);
                assert.equal(trigger.command.schemaVersion, schemaVersion);
                assert.deepEqual(trigger.command.actions, actions);
                assert.deepEqual(trigger.command.targetID, targetID);
                assert.deepEqual(trigger.command.issuerID, issuerID);
                assert.notOk(trigger.serverCode);
            } else if (trigger.triggerID == triggerID2) {
                assert.ok(trigger.disabled);
                assert.equal(trigger.predicate.schedule, "0 12 1 * *");
                assert.equal(trigger.command.schema, schema);
                assert.equal(trigger.command.schemaVersion, schemaVersion);
                assert.deepEqual(trigger.command.actions, actions);
                assert.deepEqual(trigger.command.targetID, targetID);
                assert.deepEqual(trigger.command.issuerID, issuerID);
                assert.notOk(trigger.serverCode);
            } else {
                done("Unexpected TriggerID");
            }
        }
        // 5. update trigger
        request = new ThingIF.CommandTriggerRequest("led2", 2, [{setBrightness: {brightness:50}}], statePredicate, issuerID);
        return api.patchCommandTrigger(triggerID1, request);
    }).then(function(trigger) {
        assert.equal(trigger.triggerID, triggerID1);
        assert.notOk(trigger.disabled);
        assert.equal(trigger.predicate.getEventSource(), "STATES");
        assert.equal(trigger.predicate.triggersWhen, "CONDITION_CHANGED");
        assert.deepEqual(trigger.predicate.condition, condition);
        assert.equal(trigger.command.schema, "led2");
        assert.equal(trigger.command.schemaVersion, 2);
        assert.deepEqual(trigger.command.actions, [{setBrightness: {brightness:50}}]);
        assert.deepEqual(trigger.command.targetID, targetID);
        assert.deepEqual(trigger.command.issuerID, issuerID);
        assert.notOk(trigger.serverCode);
        // 6. delete trigger
        api._au._token = adminToken;
        return api.deleteTrigger(triggerID2);
    }).then(function(deletedTriggerID) {
        assert.equal(deletedTriggerID, triggerID2);
        // 7. list triggers
        return api.listTriggers(new ThingIF.ListQueryOptions());
    }).then(function(queryResult) {
        assert.equal(queryResult.results.length, 1);
        assert.notOk(queryResult.paginationKey);
        assert.notOk(queryResult.hasNext);
        assert.equal(queryResult.results[0].triggerID, triggerID1);
        assert.notOk(queryResult.results[0].disabled);
        assert.equal(queryResult.results[0].predicate.getEventSource(), "STATES");
        assert.equal(queryResult.results[0].predicate.triggersWhen, "CONDITION_CHANGED");
        assert.deepEqual(queryResult.results[0].predicate.condition, condition);
        assert.equal(queryResult.results[0].command.schema, "led2");
        assert.equal(queryResult.results[0].command.schemaVersion, 2);
        assert.deepEqual(queryResult.results[0].command.actions, [{setBrightness: {brightness:50}}]);
        assert.deepEqual(queryResult.results[0].command.targetID, targetID);
        assert.deepEqual(queryResult.results[0].command.issuerID, issuerID);
        assert.notOk(queryResult.results[0].serverCode);
        done();
    }).catch(function(err) {
        done(err);
    });
});
