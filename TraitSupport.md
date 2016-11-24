Trait is introduced from version 1.0.0.
This document lists usages of SDK for supporting trait based on use cases. An example system is used to better understand.

The snippets follow ECMAScript 6 standard.

# Table of Contents

  * [Example System](#example-system)
    * [Version 1: Non trait based system](#version-1-non-trait-based-system)
    * [Version 2: Introduce trait and firmware version](#version-2-introduce-trait-and-firmware-version)
    * [Version 3: Add capability](#version-3-add-capability)
    * [Version 4: Remove capability](#version-4-remove-capability)
  * [Use Cases](#use-cases)
    * [1 Introduce trait to existing service](#1-introduce-trait-to-existing-service)
      * [1.1 Expected Usage](#11-expected-usage)
        * [1.1.1 Define thing type, firmware version, trait, trait version and trait alias](#111-define-thing-type-firmware-version-trait-trait-version-and-trait-alias)
        * [1.1.2 Onboarding](#112-onboarding)
        * [1.1.3 Update thing type and firmware version for thing](#113-update-thing-type-and-firmware-version-for-thing)
        * [1.1.4 Send command](#114-send-command)
        * [1.1.5 Create Trigger](#115-create-trigger)
        * [1.1.6 Query all ungrouped history state to draw most detailed graph](#116-query-all-ungrouped-history-state-to-draw-most-detailed-graph)
        * [1.1.7 Query all grouped history states to draw other graphs](#117-query-all-grouped-history-states-to-draw-other-graphs)
        * [1.1.8 Fetch current states](#118-fetch-current-states)
      * [1.2 Unexpected Usage](#12-unexpected-usage)
        * [1.2.1 Mobile App not updated, firmware version of thing updated(by thing app)](#121-mobile-app-not-updated-firmware-version-of-thing-updatedby-thing-app)
        * [1.2.2 Mobile app not update, thing app is not updated.](#122-mobile-app-not-update-thing-app-is-not-updated)
        * [1.2.3 Mobile app updated, firmware version of thing is not updated](#123-mobile-app-updated-firmware-version-of-thing-is-not-updated)
        * [1.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.](#124-mobile-app-updated-and-firmware-version-of-thing-updated-but-wrong-format-is-applied)
        * [1.2.5 Command trigged by old trigger(v1)](#125-command-trigged-by-old-triggerv1)
    * [2 Update Firmware Version](#2-update-firmware-version)
      * [2.1 Expected Usage](#21-expected-usage)
        * [2.1.1 Update firmware version, and define trait, trait version, and trait alias](#211-update-firmware-version-and-define-trait-trait-version-and-trait-alias)
        * [2.1.2 Onboarding](#212-onboarding)
        * [2.1.3 Update firmware version using SDK](#213-update-firmware-version-using-sdk)
        * [2.1.4 send command with new trait](#214-send-command-with-new-trait)
        * [2.1.5 Create trigger with new trait](#215-create-trigger-with-new-trait)
        * [2.1.6 Query all ungrouped history state to draw most detailed graph](#216-query-all-ungrouped-history-state-to-draw-most-detailed-graph)
        * [2.1.7 Query all grouped history states to draw other graphs](#217-query-all-grouped-history-states-to-draw-other-graphs)
        * [2.1.8 Fetch current states](#218-fetch-current-states)
      * [2.2 Unexpected Usage](#22-unexpected-usage)
        * [2.2.1 Mobile App not updated, firmware version of thing updated(by thing app)](#221-mobile-app-not-updated-firmware-version-of-thing-updatedby-thing-app)
        * [2.2.2 Mobile app not update, thing app is not updated](#222-mobile-app-not-update-thing-app-is-not-updated)
        * [2.2.3 Mobile app updated, firmware version of thing is not updated](#223-mobile-app-updated-firmware-version-of-thing-is-not-updated)
        * [2.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.](#224-mobile-app-updated-and-firmware-version-of-thing-updated-but-wrong-format-is-applied)
        * [2.2.5 Command trigged by old trigger(v2)](#225-command-trigged-by-old-triggerv2)
    * [3 Deprecate existing capability](#3-deprecate-existing-capability)
      * [3.1 Expected Usage](#31-expected-usage)
        * [3.1.1 Remove action from trait in new trait version](#311-remove-action-from-trait-in-new-trait-version)
        * [3.1.2 Define firmware version, trait alias](#312-define-firmware-version-trait-alias)
        * [3.1.3 Onboarding](#313-onboarding)
        * [3.1.4 Update firmware version using SDK](#314-update-firmware-version-using-sdk)
        * [3.1.5 Send command](#315-send-command)
        * [3.1.6 Create trigger](#316-create-trigger)
        * [3.1.7 Fetch current states](#317-fetch-current-states)
      * [3.2 Unexpected Usage](#32-unexpected-usage)
        * [3.2.1 Mobile App not updated, firmware version of thing updated(by thing app)](#321-mobile-app-not-updated-firmware-version-of-thing-updatedby-thing-app)
        * [3.2.2 Mobile app not update, thing app is not updated](#322-mobile-app-not-update-thing-app-is-not-updated)
        * [3.2.3 Mobile app updated, firmware version of thing is not updated](#323-mobile-app-updated-firmware-version-of-thing-is-not-updated)
        * [3.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.](#324-mobile-app-updated-and-firmware-version-of-thing-updated-but-wrong-format-is-applied)
        * [3.2.5 Command trigged by old trigger(v3)](#325-command-trigged-by-old-triggerv3)

# Example System
The example used in this documentation is an air conditioner system under the home environment. A mobile app of this system enables end user to send command to change the environment data of the room(like temperature, humidity, and etc.) and manage triggers, which can trig command based on the state of air conditioner(for example, to keep temperature of the room to 27 degree, need a trigger can trigger a command to change temperature 27 degree, when temperature of room is greater than that value sensing by the air conditioner).  A thing app of this system is running on the air conditioner, which can directly connect to kii server and is waiting for the command or updating its sates (temperature/humidity) periodically.

## Version 1: Non-trait based system
This system was developed without trait in version 1. In this version, mobile app can send command `turnPower` and/or `setPresetTemperature` to air conditioner. The state of air conditioner has `power`, and `currentTemperature`. The mobile app retrieves history states of temperature and show it in different graphs: most detailed graph; average temperature every fifteen minutes graph; max temperature every fifteen minutes graph; min temperature every fifteen minutes graph.
In version 1, thingType and firmware version were not assigned to things.

## Version 2: Introduce trait and firmware version
Since trait can provide better way to describe capability of thing, and can validate the actions and state in server. This system introduced trait in version 2.

## Version 3: Add capability
This system added new feature to enable users to set humidity of the room through air conditioner in version 3. Action `setPresetHumidity` and state `currentHumidity` were added. Mobile app add new graph for humidity: most detail graph; average humidity every thirty minutes; max humidity every thirty minutes; min humidity every thirty minutes.

## Version 4: Remove capability
For some season the system disabled the action `turnPower`, the user needs to turn on/off power manually in version 4. Action `turnPower` and state `power` were removed in this version.

# Use cases

## 1 Introduce Trait to existing service
For the system didn't use trait for thing and is starting to use trait in new version, it falls into this use case. Like version 2 of air conditioner system.

### 1.1 Expected usage
In this section list the exception steps for this use case.

#### 1.1.1 Define thing type, firmware version, trait, trait version and trait alias

In the example system version 2, developer defined thing type `MyAirConditioner`, and firmware version `v2`.

Then defined trait `AirConditioner` and trait version `1`, with the following actions and states

```javascript
{
      "dataGroupingInterval": "15_MINUTES",
      "actions": [
        {
          "turnPower": {
            "description": "Turn the power on/off",
            "payloadSchema": {
              "type": "boolean"
            }
          }
        },
        {
          "setPresetTemperature": {
            "description": "Configure the preset temperature",
            "payloadSchema": {
              "maximum": 40,
              "type": "integer",
              "minimum": 10
            }
          }
        }
      ],
      "states": [
        {
          "currentTemperature": {
            "description": "The current temperature of the room",
            "payloadSchema": {
              "maximum": 60,
              "type": "integer",
              "minimum": -20
            }
          }
        }
      ]
}
```

Then defined a trait alias `AirConditionerAlias` with thing type `MyAirConditioner`, firmware version `v2`, trait `AirConditioner` and trait version `1`.

#### 1.1.2 Onboarding
The thingType and firmwareVersion past to onboarding function, only affect the new thing. For the thing which were onboarded once in old system, thingType and firmwareVersion are ignored during onboarding.

```javascript
let owner = new ThingIF.TypedID(ThingIF.Types.User, "your user id");
let app = new ThingIF.App("your appID", "your app key", ThingIF.Site.US);
let api = new ThingIF.ThingIFAPI(owner, "your user's access token", app);
let vendorThingID = "your thing's vendor thing ID";
let password = "your thing's password";
let request = new ThingIF.OnboardWithVendorThingIDRequest(
    vendorThingID,
    password,
    owner,
    "MyAirConditioner",
    null,
    "v2"
);
api.onboardWithVendorThingID(request).then(result => {
    // handle the result
}).catch(err => {
    // handle the err
});
```

#### 1.1.3 Update thing type and firmware version for thing

For the things which were onboarded once in old system, need to involve this step to update their thingType and firmwareVersion to start using trait. This step is not needed for new thing.

```javascript
api.updateThingType("MyAirConditioner").then(() => {
    return api.updateFirmwareVersion("v2");
}).then(() => {
    // following operations
}).catch(error => {
    // handle error
});
```

#### 1.1.4 Send command

```javascript
// already finished to onboard
let traitAlias = "AirConditionerAlias";
let actions = [{
    AirConditionerAlias: [{
        "turnPower": true
    }]
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {
    // Do something
}).catch(err => {
    // Error handling
});
```

#### 1.1.5 Create Trigger

```javascript
let traitAlias = "AirConditionerAlias";
let actions = [{
    AirConditionerAlias: [{
        "setPresetTemperature": 25
    }]
}];
let condition = new ThingIF.Condition(
    new ThingIF.GreaterThan("currentTemperature", 30, traitAlias));
let statePredicate = new ThingIF.StatePredicate(
    condition,
    ThingIF.TriggersWhen.CONDITION_CHANGED);
let triggerCommandObject = new ThingIF.TriggerCommandObject(actions);
let request = new ThingIF.PostCommandTriggerRequest(
    triggerCommandObject,
    statePredicate);
api.postCommandTrigger(request).then(trigger => {
    // Do something
}).catch(err => {
    // Error handling
});
```

#### 1.1.6 Query all ungrouped history state to draw most detailed graph

In server, the history state is stored in different time series bucket with the ones after using trait, need to call query history state separately.

In example system, in version 1, there were a lot of history states stored in server, so also need to combine these datas with the ones updated in new version.

```javascript
let dateFrom // Date instance
let dateTo // Date instance
let timeRange = new ThingIF.TimeRange(dateFrom, dateTo);
let request1 = new ThingIF.QueryHistoryStatesRequest(timeRange);
let request2 = new ThingIF.QueryHistoryStatesRequest(timeRange, null, null,
    "AirConditionerAlias")
let historyStatesV1 = null;

// query history state of version 1
api.queryStates(request1).then(historyResults => {
    historyStatesV1 = historyResults.getResults();
    // query history state of version 2
    return api.queryStates(request2);
}).then(historyResultsV2 => { // history state of version 2
    // combine historyResultsV2 with historyStatesV1
}).catch(err => {
    // handle the error
});
```

#### 1.1.7 Query all grouped history states to draw other graphs

Aggregation method(MAX, MIN, COUNT, MEAN, SUM) can be applied to grouped history state results for drawing statistics graph.
- draw graph to show average graph

  In example system, mobile app draw graph to show average temperature in every 15 minutes. Also need to combine states of version 1 with new version's.

```javascript
let dateFrom // Date instance
let dateTo // Date instance
let timeRange = new ThingIF.TimeRange(dateFrom, dateTo);
let aggregation = new ThingIF.Aggregation(ThingIF.AggregationType.MEAN,
    "average", "currentTemperature", "integer");
let request1 = new ThingIF.QueryHistoryStatesRequest(timeRange, true, aggregation)
let request2 = new ThingIF.QueryHistoryStatesRequest(timeRange, true, aggregation,
    "AirConditionerAlias")
let historyStatesV1 = null;

// query history state of version 1
api.queryStates(request1).then(historyResults => {
    historyStatesV1 = historyResults.getResults();
    // query history state of version 2
    return api.queryStates(request2);
}).then(historyResultsV2 => { // history state of version 2
    // combine historyResultsV2 with historyStatesV1
}).catch(err => {
    // handle the error
});
```
- draw graph to show max value of state graph

  In example system, mobile app draw graph to show max temperature in every 15 minutes. Also need to combine states of version 1 with new version's. Snippets similar to average graph, so not listed here.

- draw graph to show min value of state graph

  In example system, mobile app draw graph to show min temperature in every 15 minutes. Also need to combine states of version 1 with new version's. Snippets similar to average graph, so not listed here.

- draw graph to show count of state graph

  In example system, COUNT aggregation is not used. For the system may need to use this aggregation, the snippet is similar to average graph.

- draw graph to show sum of value of states graph

  In example system, SUM aggregation is not used. For the system may need to use this aggregation, the snippet is similar to average graph.

#### 1.1.8 Fetch current states

It is common to periodically fetch current states of thing to show status of device to user. There are 2 ways to fetch current states of thing.

- Simple fetch states

  Call `api.getState` without providing any parameter, the response state can have 3 possibilities of state: empty state if the thing never update yet; old format if thing doesn't update state after the thing app was updated; new format if the thing updated its state after thing app was updated. Need to handle the different format.

```javascript
api.getState().then(state => {
    let alias = "AirConditionerAlias";
    if (Object.keys(state).length == 0) {
        // handle empty state
    } else if (state.hasOwnProperty(alias)) {
        // handle power/temperature
        let power = state[alias]["power"];
        let temperature = state[alias]["currentTemperature"];
    } else { // state like {"power": true, "currentTemperature": 30}
        // handle non trait format state
    }
}).catch(err => {
    //handle error
});

```

- Fetch state by trait alias

  Call `api.getState` providing with trait alias, can get states specified for the trait alias. In version 2 of example system, using this way can get the states, which were updated by thing app of new version.

```javascript

api.getState("AirConditionerAlias").then(state => {
    if (Object.keys(state).length == 0) {
        // handle empty state
    } else {
        // handle power/temperature
        let power = state["power"];
        let temperature = state["currentTemperature"];
    }
}).catch(err => {
    //handle error
});
```
### 1.2 Unexpected usage

#### 1.2.1 Mobile App not updated, firmware version of thing updated(by thing app).

In example system, the mobile app was not updated, still in version 1(non trait system). And thing app was already updated to version 2 and updated firmware version of the thing.

- send command from mobile app

  Command sent from mobile app was without trait alias, server would return error.

```javascript
let actions = [{
    "setPresetTemperature": 27
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {}).catch(err => {
    // Error handling
    if (err.name == ThingIF.Errors.HttpError) {
        if (err.body.errorCode == "COMMAND_TRAIT_VALIDATION") {
            let targetFwVersion = err.body.targetFirmwareVersion;
            // if targetFwVersion is later than current firmware version
            // (assumed hard coded in mobile app).
            // Must inform user to update mobile app
        } else {
            // handle the other error
        }
    } else {
        // handle other error
    }
});
```

- send command trigger from mobile app

  Command and condition in trigger were without trait, server would return error.

```javascript
let actions = [{
    "setPresetTemperature": 27
}];
let clause = new ThingIF.Clause.GreaterThan("currentTemperature": 27);
let condition = new ThingIF.Condition(clause);
let statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen
    .CONDITION_CHANGED);
let triggerCommandObject = new ThingIF.TriggerCommandObject(actions,
    commandTargetID);
let request = new ThingIF.PostCommandTriggerRequest(triggerCommandObject,
    statePredicate);
api.postCommandTrigger(request).then(trigger => {
    // should not be here
}).catch(err => {
    // Error handling
    if (err.name == ThingIF.Errors.HttpError) {
        if (err.body.errorCode == "COMMAND_TRAIT_VALIDATION") {
            let targetFirmwareVersion = err.body.targetFirmwareVersion;
            // if targetFirmwareVersion is later than current firmware version
            // (assume hard coded in mobile app).
            // Inform user to update mobile app
        } else {
            // handle other error
        }
    } else {
        // handle other error
    }
});
```

#### 1.2.2 Mobile app not update, thing app is not updated.
It is fine in this case.

#### 1.2.3 Mobile app updated, firmware version of thing is not updated

Mobile app was updated, so command and trigger using trait format. The firmware version of thing should be updated after onboard thing by mobile app( Since the firmware version is string, which is difficult to judge which is version is earlier or later. Mobile app should take care it). But for some reasons, the new version of mobile app didn't update the firmware version of existing thing from neither mobile app nor thing app.

- send command from mobile app

  Since the `Content-Type` header of trait command is `application/vnd.kii.CommandCreationRequest+json`, which require validation from defined, server will response error if the thing is not assigned with thingType, firmware version and trait. Mobile app must recognise this error and perform update of thing type and firmware version.

```javascript

// already finished to onboard
let actions = [{
   "AirConditionerAlias": [{
        "turnPower": true
    }]
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {
}).catch(err => {
    if (err.body.errorCode == "THING_WITHOUT_THING_TYPE") {
      // then the firmware version of thing must not be updated yet.
      // mobile app should update firmware version of the thing
    }
});
```

- send command trigger from mobile app

  Trait alias is contained in clause and command, server will response error if the target thing is not configured with trait alias. Mobile app must recognise this error and perform update of thing type and firmware version.

```javascript
let traitAlias = "AirConditionerAlias";
let actions = [{
    AirConditionerAlias: [{
        "setPresetTemperature": 25
    }]
}];
let condition = new ThingIF.Condition(
    new ThingIF.GreaterThan("currentTemperature", 30, traitAlias));
let statePredicate = new ThingIF.StatePredicate(
    condition,
    ThingIF.TriggersWhen.CONDITION_CHANGED);
let triggerCommandObject = new ThingIF.TriggerCommandObject(actions);
let request = new ThingIF.PostCommandTriggerRequest(
    triggerCommandObject,
    statePredicate);
api.postCommandTrigger(request).then(trigger => {
}).catch(err => {
    if (err.body.errorCode == "STATE_PREDICATE_TRAIT_VALIDATION" &&
        err.body.targetFirmwareVersion == null) {
    // then the firmware version of thing must not be updated yet.
    // must update firmware version of thing.
  }
});
```

#### 1.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.

Following cases can cause error:
- Send command with invalid alias

  If invalid alias is contained in command, like not existing alias, server response error.

```javascript
// already finished to onboard
let traitAlias = "NotExistingAlias";
let actions = [{
    traitAlias: [{
        "turnPower": true
    }]
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {
}).catch(err => {
    if(err.body.errorCode == "COMMAND_TRAIT_VALIDATION"){
         let targetFirmwareVersion = err.body.targetFirmwareVersion;
         let hardCodedFirmwareVersion // the current firmware version of mobile app
         if (targetFirmwareVersion == hardCodedFirmwareVersion) {
              // must be the mistake by developer, should fix the code
         }else{
              // if targetFirmwareVersion earlier than hardCodedFirmwareVersion
              // must update firmwareVersion of the thing.

              // if targetFirmwareVersion later than hardCodedFirmwareVersion
              // must inform user to update mobile app
         }
    }
});
```
- Send command with invalid actions
- Create trigger with invalid alias in command
- Create trigger with invalid actions in command
- Create trigger with invalid alias in condition
- Create trigger with invalid state in condition

#### 1.2.5 Command trigged by old trigger(v1)

When thing app is updated, and the firmware version of thing is updated. Old command trigger in version 1, if the predicate(condition satisfied or scheduled), the command will not be sent to thing app, since the command format is invalid(without trait alias), then server will disable this trigger. The disabled trigger must be informed to user, when user is checking the trigger list for the status of trigger.

```javascript
api.listTriggers().then(queryResult => {
    let triggers = queryResult.results;
    for (let i in triggers) {
        let trigger = triggers[i];
        if (trigger.disabled) {
            let disabledReason = trigger.disabledReason;
            if (disabledReason == "COMMAND_TRAIT_VALIDATION") {
                 // Then the reason must be caused the old trigger,
                 // inform user to modified trigger
            }else {
                 // handle other errors
            }
        }
    }
});
```

## 2 Update Firmware Version
This use case for existing system is using trait, and the next update just add new capabilities to the things. The example is air condition system version 3.
### 2.1 Expected usage
#### 2.1.1 Update firmware version, and define trait, trait version, and trait alias
Developer must update both mobile app and thing app. In the example system, when the air conditioner system is updated to version 3, a new feature introduced to allow user control the humidity of the room.

Developer updates the firmware version(`v3`), define new trait, trait version and trait alias for the thing type `MyAirCondition`.

Humidity data will be grouped by thirty minutes, so need to create a new trait for humidity `HumidityController` and trait version `1`

```javascript
{
      "dataGroupingInterval": "30_MINUTES",
      "actions": [
        {
          "setPresetHumidity": {
            "description": "Set the humidity of room",
            "payloadSchema": {
              "type": "integer"
            }
          }
        }
      ],
      "states": [
        {
          "currentHumidity": {
            "description": "The current humidity of the room",
            "payloadSchema": {
              "maximum": 0,
              "type": "integer",
              "minimum": 100
            }
          }
        }
      ]
}
```

Developer defined trait alias `HumidityAlias` with trait `HumidityController`, trait version `1` for firmware version `v3`

Developer defined trait alias `AirConditionerAlias` with trait `AirConditioner`, trait version `1` for firmware version `v3`

#### 2.1.2 Onboarding
The thingType and firmwareVersion past to onboarding function, only affect the new thing. For the thing which were onboarded once in old system, thingType and firmwareVersion are ignored during onboarding.
```javascript
let owner = new ThingIF.TypedID(ThingIF.Types.User, "your user id");
let app = new ThingIF.App("your appID", "your app key", ThingIF.Site.US);
let api = new ThingIF.ThingIFAPI(owner, "your user's access token", app);
let vendorThingID = "your thing's vendor thing ID";
let password = "your thing's password";
let request = new ThingIF.OnboardWithVendorThingIDRequest(vendorThingID,
    password, owner, "MyAirConditioner", null, "v3");
api.onboardWithVendorThingID(request).then(result => {
    // handle the result
}).catch(err => {
    // handle the err
});
```

#### 2.1.3 Update firmware version using SDK
For those thing, which were onboarded once in old system, must update firmware version separately.

```javascript
api.updateFirmwareVersion("v3").then(() => {
    // Do something
}).catch(error => {
    // handle error
})
```

#### 2.1.4 send command with new trait

```javascript
// already finished to onboard
let traitAlias = "HumidityAlias";
let actions = [{
    AirConditionerAlias: [{
        "setPresetHumidity": 50
    }]
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {
    // Do something
}).catch(err => {
    // Error handling
});
```

#### 2.1.5 Create trigger with new trait

```javascript
let airConditionerAlias = "AirConditionerAlias";
let humidityAlias = "HumidityAlias";
let humidityActions = {
    HumidityAlias: [{
        "setPresetHumidity": 50
    }]
};
let clause1 = new ThingIF.Equals("power", "true", airConditionerAlias);
let clause2 = new ThingIF.Range.GreaterThan("currentHumidity", 70,
    humidityAlias);
let and = new ThingIF.And(clause1, clause2);
let condition = new ThingIF.Condition(and);
let statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen
    .CONDITION_TRUE);
let triggerCommandObject = new ThingIF.TriggerCommandObject([humidityActions]);
let request = new ThingIF.PostCommandTriggerRequest(triggerCommandObject,
    statePredicate);
api.postCommandTrigger(request).then(trigger => {
    // Do something
}).catch(err => {
    // Error handling
});
```

#### 2.1.6 Query all ungrouped history state to draw most detailed graph

This use case shows querying trait enabled state.

In the example system of version 3, when drawing graphs for `currentHumidity`, since this state was added in trait enabled version. Not need to query non trait history state for it. In version 3, still need to query state of `currentTemperature`, it is same as [1.1.6 Query all ungrouped history state to draw most detailed graph](#116-query-all-ungrouped-history-state-to-draw-most-detailed-graph). The following snippet only shows query history state of `currentHumidity`.

```javascript
let dateFrom // Date instance
let dateTo // Date instance
let timeRange = new ThingIF.TimeRange(dateFrom, dateTo);
let request = new ThingIF.QueryHistoryStatesRequest(timeRange, null, null,
    "HumidityAlias")

let api.queryStates(request).then(historyResults => {
    historyStates = historyResults.getResults();
    // consume the historyStates to draw graph
}).catch(err => {
    // handle the error
});
```

#### 2.1.7 Query all grouped history states to draw other graphs
Aggregation method(MAX, MIN, COUNT, MEAN, SUM) can be applied to grouped history state results for drawing statistics graph.

In the example system of version 3, when drawing graphs for `currentHumidity`, since this state was added in trait enabled version. Not need to query non trait history state for it. In version 3, still need to query state of `currentTemperature`, it is same as [1.1.7 Query all grouped history states to draw other graphs](#117-query-all-grouped-history-states-to-draw-other-graphs). The following snippets only shows query history state of `currentHumidity`.

- draw graph to show average graph

  In example system, mobile app draw graph to show average humidity in every thirty minutes.

```javascript
let dateFrom // Date instance
let dateTo // Date instance
let timeRange = new ThingIF.TimeRange(dateFrom, dateTo);
let aggregation = new ThingIF.Aggregation(ThingIF.AggregationType.MEAN,
    "average", "currentHumidity", "integer");
let request = new ThingIF.QueryHistoryStatesRequest(timeRange, true, aggregation,
    "HumidityAlias")

let api.queryStates(request).then(historyResults => {
    historyStates = historyResults.getResults();
    // consume historyStates
}).catch(err => {
    // handle the error
});
```
- draw graph to show max value of state graph

  In example system, mobile app draw graph to show max humidity in every thirty minutes. Snippets similar to average graph, so not listed here.

- draw graph to show min value of state graph

  In example system, mobile app draw graph to show min humidity in every thirty minutes. Snippets similar to average graph, so not listed here.

- draw graph to show count of state graph

  In example system, COUNT aggregation is not used. For the system may need to use this aggregation, the snippet is similar to average graph.

- draw graph to show sum of value of states graph

  In example system, SUM aggregation is not used. For the system may need to use this aggregation, the snippet is similar to average graph.

#### 2.1.8 Fetch current states

It is common to periodically fetch current states of thing to show status of device to user. There are 2 ways to fetch current states of thing.

- Simple fetch states

  Call `api.getState` without providing any parameter, need to handle different formats.

  In version 3 of example system, the states from earlier version system, possible from version 1(non trait format), version 2(trait format).

```javascript
api.getState().then(state => {
    let airConditionerAlias = "AirConditionerAlias";
    let humidityControllerAlias = "HumidityControllerAlias";
    if (Object.keys(state).length == 0) {
        // handle empty state
    } else if (state.hasOwnProperty(airConditionerAlias)) {
        // handle power or temperature
        let power = state[airConditionerAlias]["power"];
        let temperature = state[airConditionerAlias][
            "currentTemperature"
        ];
    } else if (state.hasOwnProperty(humidityControllerAlias)) {
        // handle humidity
        let humidity = state[humidityControllerAlias]["currentHumidity"];
    } else { // state of version 1 like {"power": true, "currentTemperature": 30}
        // handle non trait format state
    }
}).catch(err => {
    //handle error
});
```

- Fetch state by trait alias

  Call `api.getState` providing with trait alias, can get states specified for the trait alias. The following snippet shows handling `currentHumidity`. To get states `power` and `currentTemperature` is similar.

```javascript

api.getState("HumidityAlias").then(state => {
    if (Object.keys(state).length == 0) {
        // handle empty state
    } else {
        // handle humidity
        let temperature = state["currentHumidity"];
    }
}).catch(err => {
    //handle error
});
```

### 2.2 Unexpected usage

#### 2.2.1 Mobile App not updated, firmware version of thing updated(by thing app).
The mobile app was not updated, still in version 2(non trait system). And thing app was already updated to version 3 and firmware version of the thing was already updated by thing app.

- send command from mobile app

  Action in command can have 3 possibilities:
  - Action is not disabled in existing trait in new firmware version, like `setPresetTemperature` or `turnPower` from trait `AirConditioner`, version 1.
  - Action is from new trait's defined in new firmware version, like `setPresetHumidity` from trait `HumidityController`, version 1.
  - Action is disabled in existing trait in new firmware version. Example will in next section(Deprecate existing capability)

  In the example system, the non updated mobile app(version 2) can only send the first kind of action. So there must not be error response from server.

- send command trigger from mobile app

 State in condition of command trigger has the same possibilities as action's:
  - State is still existing in existing trait in new firmware version, like `currentTemperature` or `power` from trait `AirConditioner`, version 1.
  - State is from new trait's defined in new firmware version, like `currentHumidity` from trait `HumidityController`, version 1.
  - State is removed in existing trait in new firmware version. Example will in next section(Deprecate existing capability)

  In the example system, the non updated mobile app(version 2) can only send the first kind of action and state. So there must not be error response from server, when the thing is updated to firmware version 3.

#### 2.2.2 Mobile app not update, thing app is not updated.
It is fine in this case.

#### 2.2.3 Mobile app updated, firmware version of thing is not updated

The firmware version of thing must be updated after onboard thing by mobile app( SDK doesn't take care automatically update of thing, since the firmware version is string, which is difficult to judge which is version is earlier or later. Should take care by developer). But for some reasons, the new version of mobile app didn't update the firmware version of existing thing from neither mobile app nor thing app.

- send command from mobile app

  As list in 2.2.1, there are 3 possibility for action in new firmware version. And because mobile app is already updated. So if the action in command include 2nd kind of action, the server must response error.

```javascript
// already finished to onboard
let traitAlias = "HumidityAlias";
let actions = [{
    HumidityAlias: [{
        "setPresetHumidity": 50
    }]
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {}).catch(err => {
    if (err.body.errorCode == "COMMAND_TRAIT_VALIDATION") {
        let targetFirmwareVersion = err.body.targetFirmwareVersion;
        // targetFirmwareVersion is earlier than the firmware version of mobile app
        // (assume mobile app hard coded the firmware version, can be used for check).
        // Must call api.updateFirmwareVersion
    } else {
        // handle the error
    }
});
```

- send command trigger from mobile app

  As list in 2.2.1, there are 3 possibility for state/action in condition in new firmware version. And because mobile app is already updated. So if the action/action in command/condition include 2nd kind of action, the server must response error.
 Mobile app must recognise this error and perform update of thing type and firmware version.

#### 2.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.

Same as [1.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.](#124-mobile-app-updated-and-firmware-version-of-thing-updated-but-wrong-format-is-applied)

#### 2.2.5 Command trigged by old trigger(v2)

If command trigged by old trigger created in version 2, since all defined actions in version2 existing in version 3, it will be fine.

## 3 Deprecate existing capability

For existing system, it is not so command to remove capability, but still need to be considered.

Like version 4 in example system.
### 3.1 Expected usage

#### 3.1.1 Remove action from trait in new trait version

Define trait version `2` for trait `AirConditioner`
```javascrpit
{
      "dataGroupingInterval": "15_MINUTES",
      "actions": [
        {
          "turnPower": {
            "description": "Turn the power on/off",
            "payloadSchema": {
              "type": "boolean"
            },
            "removed": true
          }
        },
        {
          "setPresetTemperature": {
            "description": "Configure the preset temperature",
            "payloadSchema": {
              "maximum": 40,
              "type": "integer",
              "minimum": 10
            }
          }
        }
      ],
      "states": [
        {
          "currentTemperature": {
            "description": "The current temperature of the room",
            "payloadSchema": {
              "maximum": 60,
              "type": "integer",
              "minimum": -20
            }
          }
        }
      ]
}
```
#### 3.1.2 Define firmware version, trait alias

Define firmware version `v4`.
Define trait alias `AirConditionerAlias` with firmware version `v4`, trait `AirConditioner`, and trait version `2`
Define trait alias `HumidityAlias` with firmware version `v4`, trait `HumidityTrait`, and trait version `1`

#### 3.1.3 Onboarding

The thingType and firmwareVersion past to onboarding function, only affect the new thing. For the thing which were onboarded once in old system, thingType and firmwareVersion are ignored during onboarding.

```javascript
let owner = new ThingIF.TypedID(ThingIF.Types.User, "your user id");
let app = new ThingIF.App("your appID", "your app key", ThingIF.Site.US);
let api = new ThingIF.ThingIFAPI(owner, "your user's access token", app);
let vendorThingID = "your thing's vendor thing ID";
let password = "your thing's password";
let request = new ThingIF.OnboardWithVendorThingIDRequest(vendorThingID,
    password, owner, "MyAirConditioner", null, "v4");
api.onboardWithVendorThingID(request).then(result => {
    // handle the result
}).catch(err => {
    // handle the err
});
```

#### 3.1.4 Update firmware version using SDK

For those thing, which were onboarded once in old system, must update firmware version separately.

```javascript
api.updateFirmwareVersion("v4").then(() => {
    // Do something
}).catch(error => {
    // handle error
})
```
#### 3.1.5 Send command

The command sent to thing, must not contain removed actions.

```javascript
// already finished to onboard
let traitAlias = "HumidityAlias";
let actions = [{
    HumidityAlias: [{
        "setPresetHumidity": 50
    }]
}];
let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {
    // Do something
}).catch(err => {
    // Error handling
});
```

#### 3.1.6 Create trigger

Trigger must not neither contain removed actions in command nor contain deleted states in the condition.

```javascript
let traitAlias = "AirConditionerAlias";
let actions = [{
    AirConditionerAlias: [{
        "setPresetTemperature": 25
    }]
}];
let condition = new ThingIF.Condition(new ThingIF.GreaterThan(
    "currentTemperature", 30, traitAlias));
let statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen
    .CONDITION_CHANGED);
let triggerCommandObject = new ThingIF.TriggerCommandObject(actions);
let request = new ThingIF.PostCommandTriggerRequest(triggerCommandObject,
    statePredicate);
api.postCommandTrigger(request).then(trigger => {
    // Do something
}).catch(err => {
    // Error handling
});
```
#### 3.1.7 Fetch current states
It is same as [2.1.8 Fetch current states](#218-fetch-current-states)
### 3.2 Unexpected usage
#### 3.2.1 Mobile App not updated, firmware version of thing updated(by thing app).

The mobile app was not updated, still in version 2. And thing app was already updated to version 3 and firmware version of the thing was already updated by thing app.

- send command from mobile app

  As listed in 2.2.1, there are 3 kinds of actions, in the example system. If command only contain existing actions, it will be fine.  

  If mobile app send command container the removed action, server will response error. Mobile app must recognise this error, and inform user to update the mobile app. The following snippet is for this case:

```javascript
let airConditionerAlias = "AirConditionerAlias";
let actions = {
    AirConditionerAlias: [{
        "turnPower": false
    }]
};

let request = new ThingIF.PostCommandRequest(actions);
api.postNewCommand(request).then(command => {}).catch(err => {
    if (err.body.errorCode == "COMMAND_TRAIT_VALIDATION") {
        let targetFirmwareVersion = err.body.targetFirmwareVersion; // should be v3
        // targetFirmwareVersion is later than the firmware version of mobile app
        // (assume mobile app hard coded the firmware version, can be used for check).
        // Must inform user to update mobile app.
    } else {
        // handle the error
    }
});

```
- send command trigger from mobile app

  If mobile app send trigger only contains existing of action/state, it will be fine.

  If mobile app send trigger contains removed action/state, server will response error. Mobile app must recognise this error, and inform user to update the mobile app. The following snippet is for this case:

```javascript
let traitAlias = "AirConditionerAlias";
let actions = [{
    AirConditionerAlias: [{
        "turnPower": false
    }]
}];
let clause1 = new ThingIF.GreaterThan("currentTemperature", 20, traitAlias);
let clause2 = new ThingIF.LessThan("currentTemperature", 26, traitAlias)
let condition = new ThingIF.Condition(new ThingIF.And(clause1, clause2));
let statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen
    .CONDITION_TRUE);
let triggerCommandObject = new ThingIF.TriggerCommandObject(actions);
let request = new ThingIF.PostCommandTriggerRequest(triggerCommandObject,
    statePredicate);
api.postCommandTrigger(request).then(trigger => {}).catch(err => {
    if (err.body.errorCode == "COMMAND_TRAIT_VALIDATION") {
        let targetFirmwareVersion = err.body.targetFirmwareVersion; // should be v3
        // targetFirmwareVersion is later than the firmware version of mobile app
        // (assume mobile app hard coded the firmware version, can be used for check).
        // Must inform user to update mobile app.
    } else {
        // handle the error
    }

});
```

#### 3.2.2 Mobile app not update, thing app is not updated.
It is fine in this case.

#### 3.2.3 Mobile app updated, firmware version of thing is not updated
Same as [2.2.3 Mobile app updated, firmware version of thing is not updated](#223-mobile-app-updated-firmware-version-of-thing-is-not-updated).
#### 3.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.
Same as [1.2.4 Mobile app updated, and firmware version of thing updated but wrong format is applied.](#124-mobile-app-updated-and-firmware-version-of-thing-updated-but-wrong-format-is-applied)
#### 3.2.5 Command trigged by old trigger(v3)
If after the firmware version of thing is updated to v4, commands trigged by the trigger of previous version containing the removed action(like `turnPower`). Since this kind of commands can not pass the validation of trait(like trait `AirConditioner` version 2), the trigger will be disabled by server.
The disabled trigger must be informed to user, when user is checking the trigger list for the status of trigger. Snippet is same as [1.2.5 Command trigged by old trigger(v1)](#125-command-trigged-by-old-triggerv1)
