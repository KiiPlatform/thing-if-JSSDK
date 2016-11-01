/// <reference path="../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';

import {App} from './App';
import {Command} from './Command';
import {Trigger} from './Trigger'
import {ServerCodeResult} from './ServerCodeResult'
import * as Options from './RequestObjects'
import {TypedID, Types} from './TypedID'
import {OnboardingResult} from './OnboardingResult'
import {APIAuthor} from './APIAuthor'
import * as PromiseWrapper from './internal/PromiseWrapper'
import {ThingIFError, Errors} from './ThingIFError'

import OnboardingOps from './ops/OnboardingOps'
import CommandOps from './ops/CommandOps'
import TriggerOps from './ops/TriggerOps'
import StateOps from './ops/StateOps'
import ThingOps from './ops/ThingOps'
import PushOps from './ops/PushOps'
import {QueryResult} from './QueryResult'

import {State} from './State'

/** ThingIFAPI represent an API instance to access Thing-IF APIs for a specified target */
export class ThingIFAPI {
    private _owner: TypedID;
    private _au: APIAuthor;
    private _target: TypedID;

    /**
     * @param {string} owner Specify who uses the ThingIFAPI
     * @param {string} token A token can access Thing-IF APIs, which can be admin token or token of
     *  a registered kii user.
     * @param {App} app App instance of existing Kii App. You must create a app in
     *  [Kii developer portal]{@link https://developer.kii.com}
     * @param {TypedID} [target] TypedID for a specified target.
    */
    constructor(owner:TypedID, token:string, app: App, target?: TypedID) {
        this._owner = owner;
        this._au = new APIAuthor(token, app);
        this._target = target;
    }

    /** Access token. */
    get token(): string {
        return this._au.token;
    }

    /** App instance about Kii App. */
    get app(): App {
        return this._au.app;
    }

    /** TypeID of target. */
    get target(): TypedID {
        return this._target;
    }

    /** Onboard Thing by vendorThingID
     * @param {Object} onboardRequest request body when request onboarding
     * @param {onCompletion} [function] callback function when completed
     * @return {Promise} promise object
     * @example
     * // Assume user is already exist and you have User ID and Access token.
     * var owner = new ThingIF.TypedID(ThingIF.Types.User, "Your UserID");
     * var app = new ThingIF.App("Your AppID", "Your AppKey", ThingIF.Site.US);
     * var api = new ThingIF.ThingIFAPI(owner, "Your user's acess token", app);
     * var vendorThingID = "Your thing's vendor thing ID";
     * var password = "Your thing's password";
     * var request = new ThingIF.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
     * api.onboardWithVendorThingID(request).then(function(result){
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    onboardWithVendorThingID(
        onboardRequest: Options.OnboardWithVendorThingIDRequest,
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult>{

        if (!onboardRequest.owner) {
            onboardRequest.owner = this._owner.toString();
        }
        let orgPromise = new Promise<OnboardingResult>((resolve, reject) => {
            (new OnboardingOps(this._au)).onboardWithVendorThingID(onboardRequest).then((result:OnboardingResult)=>{
                this._target = new TypedID(Types.Thing, result.thingID);
                resolve(result);
            }).catch((err:Error)=>{
                reject(err);
            });
        });
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Onboard Thing by thingID for the things already registered on Kii Cloud.
     * @param {Object} onboardRequest Necessary fields when request onboarding
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var owner = new ThingIF.TypedID(ThingIF.Types.User, "Your UserID");
     * var app = new ThingIF.App("Your AppID", "Your AppKey", ThingIF.Site.US);
     * var api = new ThingIF.ThingIFAPI(owner, "Your user's acess token", app);
     * var thingID = "Your thing's ID";
     * var password = "Your thing's password";
     * var request = new ThingIF.OnboardWithThingIDRequest(thingID, password, owner);
     * api.onboardWithThingID(request).then(function(result){
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    onboardWithThingID(
        onboardRequest: Options.OnboardWithThingIDRequest,
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult>{

        if (!onboardRequest.owner) {
            onboardRequest.owner = this._owner.toString();
        }
        let orgPromise = new Promise<OnboardingResult>((resolve, reject) => {
            (new OnboardingOps(this._au)).onboardWithThingID(onboardRequest).then((result:OnboardingResult)=>{
                this._target = new TypedID(Types.Thing, result.thingID);
                resolve(result);
            }).catch((err:Error)=>{
                reject(err);
            });
        });
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    // /**Onboard an Endnode by vendorThingID with an already registered gateway.
    //  * @param {Object} onboardRequest Necessary fields when request onboarding
    //  * @param {onCompletion} [function] Callback function when completed
    //  * @return {Promise} promise object
    //  * @example
    //  */
    // onboardEndnodeWithGateway(
    //     onboardRequest: Options.OnboardEndnodeWithGatewayRequest,
    //     onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
    //     return this._au.onboardEndnodeWithGateway(onboardRequest, onCompletion);
    // }

    /** Post a new command.
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {Object} command Necessary fields for new command
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var traitAlias = "BasicFeatureAlias";
     * var actions = [{traitAlias: [{"turnPower": true}]}];
     * var request = new ThingIF.PostCommandRequest(actions);
     * api.postNewCommand(request).then(function(command) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    postNewCommand(
        command: Options.PostCommandRequest,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{

        let orgPromise = new Promise<Command>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            if (!command.issuer) {
                command.issuer = this._owner.toString();
            }
            (new CommandOps(this._au, this._target)).postNewCommand(command).then((cmd)=>{
                resolve(cmd);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Retrieve command with specified ID.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} commandID Command ID to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.getCommand("CommandID").then(function(command) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getCommand(
        commandID: string,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        let orgPromise = new Promise<Command>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new CommandOps(this._au, this._target)).getCommand(commandID).then((cmd)=>{
                resolve(cmd);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Retrieve commands.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {Object} listOptions Options to retrieve commands.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.listCommands().then(function(queryResult) {
     *   if (queryResult.hasNext) {
     *     // Handle more results
     *   }
     *   // Do something
     *   var commands = queryResult.results;
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    listCommands(
        listOptions?: Options.ListQueryOptions,
        onCompletion?: (err: Error, commands:QueryResult<Command>)=> void): Promise<QueryResult<Command>>{
        let orgPromise = new Promise<QueryResult<Command>>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new CommandOps(this._au, this._target)).listCommands(listOptions).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Post a new command trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     *
     * When thing related to this ThingIFAPI instance meets condition described by predicate,
     * A registered command sends to thing related to target.
     *
     * `target` property and commandTarget in requestObject must belong to same owner.
     *
     * @param {Object} requestObject Necessary fields for new command trigger.
     *   `_owner` property is used as IssuerID. So even if IssuerID is provided in requestObject, it will be ignored.
     *   If requestObject.command.targetID is not provide or null, `_target` property will be used by default.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * // commandTargetID can be different with api.target.
     * var traitAlias = "BasicFeatureAlias";
     * var actions = [{traitAlias: [{"turnPower": true}]}];
     * var commandTargetID = new ThingIF.TypedID(ThingIF.Types.Thing, "another thing to receive command");
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false", traitAlias));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var triggerCommandObject = new ThingIF.TriggerCommandObject(actions, commandTargetID);
     * var request = new ThingIF.PostCommandTriggerRequest(triggerCommandObject, statePredicate);
     * api.postCommandTrigger(request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    postCommandTrigger(
        requestObject: Options.PostCommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            if(!this._owner){
                reject(new ThingIFError(Errors.IlllegalStateError, "_owner is null when ThingIFAPI is initialized"));
                return;
            }
            requestObject.command.issuerID = this._owner;
            (new TriggerOps(this._au, this._target)).postCommandTrigger(requestObject)
            .then((trigger)=>{
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Post a new servercode trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {PostServerCodeTriggerRequest} requestObject Necessary fields for new servercode trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var traitAlias = "BasicFeatureAlias";
     * var serverCode = new ThingIF.ServerCode("function_name", null, null, {param1: "hoge"});
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false", traitAlias));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var request = new ThingIF.ServerCodeTriggerRequest(serverCode, statePredicate);
     * api.postServerCodeTrigger(request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    postServerCodeTrigger(
        requestObject: Options.PostServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).postServerCodeTrigger(requestObject)
            .then((trigger)=>{
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Retrieve trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.getTrigger("TriggerID").then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getTrigger(
        triggerID: string,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).getTrigger(triggerID)
            .then((trigger)=>{
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Update a command trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * When thing related to this ThingIFAPI instance meets condition described by predicate,
     * A registered command sends to thing related to target.
     *
     * `target` property and commandTarget in requestObject must belong to same owner.
     *
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var traitAlias = "BasicFeatureAlias";
     * var actions = [{traitAlias:[{"turnPower": true}]}];
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false", traitAlias));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * // if commandTargetID can be different with api.target
     * var commandTargetID = new ThingIF.TypedID(ThingIF.Types.Thing, "another thing to receive command");
     * var triggerCommandObject = new ThingIF.TriggerCommandObject(actions, commandTargetID);
     * var request = new ThingIF.PatchCommandTriggerRequest(triggerCommandObject, statePredicate);
     * api.patchCommandTrigger("Trigger ID", request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    patchCommandTrigger(
        triggerID: string,
        requestObject: Options.PatchCommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            if(!this._owner){
                reject(new ThingIFError(Errors.IlllegalStateError, "_owner is null when ThingIFAPI is initialized"));
                return;
            }
            requestObject.command.issuerID = this._owner;
            (new TriggerOps(this._au, this._target)).patchCommandTrigger(triggerID, requestObject)
            .then((trigger)=>{
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Update a servercode trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var traitAlias = "BasicFeatureAlias";
     * var serverCode = new ThingIF.ServerCode("function_name", null, null, {param1: "hoge"});
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false", traitAlias));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var request = new ThingIF.ServerCodeTriggerRequest(serverCode, statePredicate);
     * api.patchServerCodeTrigger("Trigger ID", request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
   patchServerCodeTrigger(
        triggerID: string,
        requestObject: Options.PatchServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).patchServerCodeTrigger(triggerID, requestObject)
            .then((trigger)=>{
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Enable/Disable a specified trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {boolean} enable True to enable, otherwise, disable the trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.enableTrigger("Trigger ID", true).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    enableTrigger(
        triggerID: string,
        enable: boolean,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).enableTrigger(triggerID, enable)
            .then((trigger)=>{
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Delete a specified trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.deleteTrigger("Trigger ID").then(function(deletedTriggerID) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    deleteTrigger(
        triggerID: string,
        onCompletion?: (err: Error, triggerID:string)=> void): Promise<string>{
        let orgPromise = new Promise<string>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).deleteTrigger(triggerID)
            .then((triggerID)=>{
                resolve(triggerID);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Retrive triggers.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {ListQueryOptions} listOptions instance to ListQueryOptions.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.listTriggers().then(function(queryResult) {
     *   if (queryResult.hasNext) {
     *     // Handle more results
     *   }
     *   // Do something
     *   var triggers = queryResult.results;
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    listTriggers(
        listOptions?: Options.ListQueryOptions,
        onCompletion?: (err: Error, triggers:QueryResult<Trigger>)=> void): Promise<QueryResult<Trigger>>{
        let orgPromise = new Promise<QueryResult<Trigger>>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).listTriggers(listOptions)
            .then((triggers)=>{
                resolve(triggers);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Retrieve execution results of server code trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {Object} listOptions Options to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.listServerCodeExecutionResults("Trigger ID").then(function(queryResult) {
     *   if (queryResult.hasNext) {
     *     // Handle more results
     *   }
     *   // Do something
     *   var executionResults = queryResult.results;
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    listServerCodeExecutionResults(
        triggerID: string,
        listOptions?: Options.ListQueryOptions,
        onCompletion?: (err: Error, results:QueryResult<ServerCodeResult>)=> void): Promise<QueryResult<ServerCodeResult>>{
        let orgPromise = new Promise<QueryResult<ServerCodeResult>>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new TriggerOps(this._au, this._target)).listServerCodeResults(triggerID, listOptions)
            .then((results)=>{
                resolve(results);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Get State of specified target.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.getState().then(function(state) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getState(
        onCompletion?: (err: Error, state:State)=> void): Promise<State>{
        let orgPromise = new Promise<Object>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new StateOps(this._au, this._target)).getState().then((state)=>{
                resolve(state);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Get vendorThingID of specified target
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.getVendorThingID().then(function(vendorThingID) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getVendorThingID(
        onCompletion?: (err: Error, vendorThingID:string)=> void): Promise<string>{
        let orgPromise = new Promise<string>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new ThingOps(this._au, this._target.id)).getVendorThingID().then((vendorThingID)=>{
                resolve(vendorThingID);
            }).catch((err)=>{
                reject(err);
            })
        });
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Update vendorThingID of specified target
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} newVendorThingID New vendorThingID of target to be updated.
     * @param {string} newPassword New password of target to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * api.updateVendorThingID("New vendor thing ID", "New Password").then(function() {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    updateVendorThingID(
        newVendorThingID: string,
        newPassword: string,
        onCompletion?: (err: Error)=> void): Promise<void>{

        let orgPromise = new Promise<void>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new ThingOps(this._au, this._target.id)).updateVendorThingID(newVendorThingID, newPassword).then(()=>{
                resolve();
            }).catch((err)=>{
                reject(err);
            })
        });
        return PromiseWrapper.voidPromise(orgPromise, onCompletion);
    }

    /** Register the id issued by Firebase Cloud Message to Kii cloud for kii user.
     * @param {string} installationRegistrationID The ID of registration that identifies the installation externally.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [function] Callback function when completed.
     * @return {Promise} promise object.
     * @example
     * api.installFCM("Registration ID", false).then(function(installationID) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    installFCM(
        installationRegistrationID:string,
        development: boolean,
        onCompletion?: (err: Error, installationID:string)=> void): Promise<string>{
        let orgPromise = new Promise<string>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new PushOps(this._au)).installFCM(installationRegistrationID, development)
            .then((installationID)=>{
                resolve(installationID);
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.promise(orgPromise, onCompletion);
    }

    /** Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param {string} installationID The ID of the installation issued by KiiCloud.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object.
     * @example
     * api.uninstallPush("Installation ID").then(function() {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    uninstallPush(
        installationID: string,
        onCompletion?: (err: Error)=> void): Promise<void>{
        let orgPromise = new Promise<void>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new PushOps(this._au)).uninstall(installationID)
            .then(()=>{
                resolve();
            }).catch((err)=>{
                reject(err);
            })
        })
        return PromiseWrapper.voidPromise(orgPromise, onCompletion);
    }
}
