
import {Promise} from 'es6-promise';

import {App} from './App';
import {Command} from './Command';
import {Trigger} from './Trigger'
import {ServerCodeResult} from './ServerCodeResult'
import * as Options from './RequestObjects'
import {TypedID} from './TypedID'
import {OnboardingResult} from './OnboardingResult'

import OnboardingOps from './ops/OnboardingOps'
import CommandOps from './ops/CommandOps'
import TriggerOps from './ops/TriggerOps'
import StateOps from './ops/StateOps'
import ThingOps from './ops/ThingOps'
import PushOps from './ops/PushOps'
import {QueryResult} from './QueryResult'
import * as PromiseWrapper from './internal/PromiseWrapper'
import { HistoryState, GroupedHistoryStates } from './HistoryState';
import { QueryOps } from './ops/QueryOps';
import * as request from 'popsicle';
import { AggregatedResults } from './AggregatedResult';

/**
 * APIAuthor can consume Thing-IF APIs not just for a specified target.
 */
export class APIAuthor {
    private _token: string;
    private _app: App;
    /**
     * @param {string} token A token can access Thing-IF APIs, which can be admin token or token of
     *  a registered kii user.
     * @param {App} app App instance of existing Kii App. You must create a app in
     * [Kii developer portal]{@link https://developer.kii.com}
    */
    constructor(token:string, app: App) {
        this._token = token;
        this._app = app;
    }

    /** Access token of APIAuthor. */
    get token(): string {
        return this._token;
    }

    /** App instance about Kii App. */
    get app(): App {
        return this._app;
    }

    /** Onboard Thing by vendorThingID
     * @param {Object} onboardRequest request body when request onboarding
     * @param {onCompletion} [function] callback function when completed
     * @return {Promise} promise object
     * @example
     * // Assume user is already exist and you have User ID and Access token.
     * var app = new ThingIF.App("Your AppID", "Your AppKey", ThingIF.Site.US);
     * var author = new ThingIF.APIAuthor("Your user's acess token", app);
     * var vendorThingID = "Your thing's vendor thing ID";
     * var password = "Your thing's password";
     * var owner = new ThingIF.TypedID(ThingIF.Types.User, "Your UserID");
     * var request = new ThingIF.OnboardWithVendorThingIDRequest(vendorThingID, password, owner);
     * author.onboardWithVendorThingID(request).then(function(result){
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    onboardWithVendorThingID(
        onboardRequest: Options.OnboardWithVendorThingIDRequest,
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult>{
        return PromiseWrapper.promise((new OnboardingOps(this)).onboardWithVendorThingID(onboardRequest), onCompletion);
    }

    /** Onboard Thing by thingID for the things already registered on Kii Cloud.
     * @param {Object} onboardRequest Necessary fields when request onboarding
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    onboardWithThingID(
        onboardRequest: Options.OnboardWithThingIDRequest,
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult>{
        return PromiseWrapper.promise((new OnboardingOps(this)).onboardWithThingID(onboardRequest), onCompletion);
    }

    // /** Onboard an Endnode by vendorThingID with an already registered gateway.
    //  * @param {Object} onboardRequest Necessary fields when request onboarding
    //  * @param {onCompletion} [function] Callback function when completed
    //  * @return {Promise} promise object
    //  */
    // onboardEndnodeWithGateway(
    //     onboardRequest: Options.OnboardEndnodeWithGatewayRequest,
    //     onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult>{
    //     return PromiseWrapper.promise((new OnboardingOps(this)).onboardEndnode(onboardRequest), onCompletion);
    // }

    /** Post a new command.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {Object} command Necessary fields for new command
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * var issuerID = new ThingIF.TypedID(ThingIF.Types.User, "Your UserID");
     * var request = new ThingIF.PostCommandRequest("led", 1, [{turnPower: {power:true}}], issuerID);
     * author.postNewCommand(targetID, request).then(function(command) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    postNewCommand(
        target: TypedID,
        command: Options.PostCommandRequest,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        return PromiseWrapper.promise((new CommandOps(this, target)).postNewCommand(command),onCompletion);
    }

    /** Retrieve command with specified ID.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} commandID Command ID to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.getCommand(targetID, "CommandID").then(function(command) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getCommand(
        target: TypedID,
        commandID: string,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        return PromiseWrapper.promise((new CommandOps(this, target)).getCommand(commandID), onCompletion);
    }

    /** Retrieve commands.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {Object} listOptions Options to retrieve commands.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.listCommands(targetID).then(function(queryResult) {
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
        target: TypedID,
        listOptions?: Options.ListQueryOptions,
        onCompletion?: (err: Error, commands:QueryResult<Command>)=> void): Promise<QueryResult<Command>>{
        return PromiseWrapper.promise((new CommandOps(this, target)).listCommands(listOptions), onCompletion);
    }

    /** Post a new command trigger.
     * When condition described by predicate is met, a registered command sends to thing related to target.
     * `target` property and commandTarget in requestObject must belong to same owner.
     *
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {Object} requestObject Necessary fields for new command trigger.
     *   IssuerID is required in requestObject. If requestObject.command.targetID is not provide or null, `target` parameter will be used.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * // commandTargetID can be different with targetID.
     * var commandTargetID = new ThingIF.TypedID(ThingIF.Types.Thing, "another thing to receive command");
     * var issuerID = new ThingIF.TypedID(ThingIF.Types.User, "Your UserID");
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false"));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var triggerCommandObject = new ThingIF.TriggerCommandObject("Schema name", 1, [{turnPower: {power:true}}], commandTargetID, issuerID);
     * var request = new ThingIF.PostCommandTriggerRequest(triggerCommandObject, statePredicate);
     * author.postCommandTrigger(targetID, request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    postCommandTrigger(
        target: TypedID,
        requestObject: Options.PostCommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).postCommandTrigger(requestObject), onCompletion);
    }

    /** Post a new servercode trigger.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {PostServerCodeTriggerRequest} requestObject Necessary fields for new servercode trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * var serverCode = new ThingIF.ServerCode("function_name", null, null, {param1: "hoge"});
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false"));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var request = new ThingIF.ServerCodeTriggerRequest(serverCode, statePredicate);
     * author.postServerCodeTrigger(targetID, request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    postServerCodeTrigger(
        target: TypedID,
        requestObject: Options.PostServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).postServerCodeTrigger(requestObject), onCompletion);
    }

    /** Retrieve trigger.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.getTrigger(targetID, "TriggerID").then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getTrigger(
        target: TypedID,
        triggerID: string,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).getTrigger(triggerID), onCompletion);
    }

    /** Update a command trigger.
     * When condition described by predicate is met, a registered command sends to thing related to target.
     * `target` property and commandTarget in requestObject must belong to same owner.
     *
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * // if commandTargetID can be different with targetID
     * var commandTargetID = new ThingIF.TypedID(ThingIF.Types.Thing, "another thing to receive command");
     * var issuerID = new ThingIF.TypedID(ThingIF.Types.User, "Your UserID");
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false"));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var triggerCommandObject = new ThingIF.TriggerCommandObject("led2", 2, [{setBrightness: {brightness:50}}], commandTargetID, issuerID);
     * var request = new ThingIF.PatchCommandTriggerRequest(triggerCommandObject, statePredicate);
     * author.patchCommandTrigger(targetID, "Trigger ID", request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    patchCommandTrigger(
        target: TypedID,
        triggerID: string,
        requestObject: Options.PatchCommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).patchCommandTrigger(triggerID, requestObject), onCompletion);
    }

    /** Update a servercode trigger.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {PatchServerCodeTriggerRequest} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * var serverCode = new ThingIF.ServerCode("function_name", null, null, {param1: "hoge"});
     * var condition = new ThingIF.Condition(new ThingIF.Equals("power", "false"));
     * var statePredicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
     * var request = new ThingIF.PatchServerCodeTriggerRequest(serverCode, statePredicate);
     * author.patchServerCodeTrigger(targetID, "Trigger ID", request).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
   patchServerCodeTrigger(
        target: TypedID,
        triggerID: string,
        requestObject: Options.PatchServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).patchServerCodeTrigger(triggerID, requestObject), onCompletion);
    }

    /** Enable/Disable a specified trigger.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {boolean} enable True to enable, otherwise, disable the trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.enableTrigger(targetID, "Trigger ID", true).then(function(trigger) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    enableTrigger(
        target: TypedID,
        triggerID: string,
        enable: boolean,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).enableTrigger(triggerID, enable), onCompletion);
    }

    /** Delete a specified trigger.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.deleteTrigger(targetID, "Trigger ID").then(function(deletedTriggerID) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    deleteTrigger(
        target: TypedID,
        triggerID: string,
        onCompletion?: (err: Error, triggerID:string)=> void): Promise<string>{
        return PromiseWrapper.promise((new TriggerOps(this, target)).deleteTrigger(triggerID), onCompletion);
    }

    /** Retrive triggers.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.listTriggers(targetID).then(function(queryResult) {
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
        target: TypedID,
        listOptions?: Options.ListQueryOptions,
        onCompletion?: (err: Error, triggers:QueryResult<Trigger>)=> void): Promise<QueryResult<Trigger>>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).listTriggers(listOptions), onCompletion);
    }

    /** Retrieve execution results of server code trigger.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {Object} listOptions Options to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.listServerCodeExecutionResults(targetID, "Trigger ID").then(function(queryResult) {
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
        target: TypedID,
        triggerID: string,
        listOptions?: Options.ListQueryOptions,
        onCompletion?: (err: Error, results:QueryResult<ServerCodeResult>)=> void): Promise<QueryResult<ServerCodeResult>>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).listServerCodeResults(triggerID, listOptions), onCompletion);
    }

    /** Get State of specified target.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {string} [alias] Trait alias of state to query. If provided, only states of the specified alias returned.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * var targetID = new ThingIF.TypedID(ThingIF.Types.Thing, "Thing ID for target");
     * author.getState(targetID).then(function(state) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getState(
        target: TypedID,
        alias?: string,
        onCompletion?: (err: Error, state:Object)=> void): Promise<Object>{
        return PromiseWrapper.promise((new StateOps(this, target)).getState(alias), onCompletion);
    }

    /** Get vendorThingID of specified target
     * @param {string} thingID ID of thing.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * author.getVendorThingID("Thing ID for target").then(function(vendorThingID) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    getVendorThingID(
        thingID: string,
        onCompletion?: (err: Error, vendorThingID:string)=> void): Promise<string>{
        return PromiseWrapper.promise((new ThingOps(this, thingID)).getVendorThingID(),onCompletion);
    }

    /** Update vendorThingID of specified target
     * @param {string} thingID ID of thing.
     * @param {string} newVendorThingID New vendorThingID of target to be updated.
     * @param {string} newPassword New password of target to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     * @example
     * author.updateVendorThingID("Thing ID for target", "New vendor thing ID", "New Password").then(function() {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    updateVendorThingID(
        thingID: string,
        newVendorThingID: string,
        newPassword: string,
        onCompletion?: (err: Error)=> void): Promise<void>{
        return PromiseWrapper.voidPromise((new ThingOps(this, thingID)).updateVendorThingID(newVendorThingID, newPassword), onCompletion);
    }

    /** Install Firebase Cloud Message(FCM) notification to receive notification from IoT Cloud.
     * IoT Cloud will send notification when the Target replies to the Command. Application can
     * receive the notification and check the result of Command fired by Application or registered Trigger.
     * @param {string} installationRegistrationID The ID of registration that identifies the installation externally.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [function] Callback function when completed.
     * @return {Promise} promise object.
     * @example
     * author.installFCM("Registration ID", false).then(function(installationID) {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    installFCM(
        installationRegistrationID:string,
        development: boolean,
        onCompletion?: (err: Error, installationID:string)=> void): Promise<string>{
        return PromiseWrapper.promise((new PushOps(this)).installFCM(installationRegistrationID, development), onCompletion);
    }

    /** Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param {string} installationID The ID of the installation issued by KiiCloud.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object.
     * @example
     * author.uninstallPush("Installation ID").then(function() {
     *   // Do something
     * }).catch(function(err){
     *   // Error handling
     * });
     */
    uninstallPush(
        installationID: string,
        onCompletion?: (err: Error)=> void): Promise<void>{
        return PromiseWrapper.voidPromise((new PushOps(this)).uninstall(installationID), onCompletion);
    }

    /** Query history states of specified target.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param  {QueryHistoryStatesRequest} request parameters to do query.
     * @param  {function} [onCompletion] Callback function when completed
     * @return {Promise} promise object.
     */
    query(
        target: TypedID,
        request: Options.QueryHistoryStatesRequest,
        onCompletion?: (err: Error, results: QueryResult<HistoryState>) => void
    ): Promise<QueryResult<HistoryState>> {
        return PromiseWrapper.promise(new QueryOps(this, target).ungroupedQuery(request), onCompletion);
    }

    /**
     * Query grouped history states of specified target based on data grouping intervals.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {QueryGroupedHistoryStatesRequest} request request object.
     * @param {fuction} [onCompletion] Callback function when completed.
     * @return {Promise} promise object.
     */
    groupedQuery(
        target: TypedID,
        request: Options.QueryGroupedHistoryStatesRequest,
        onCompletion?: (err: Error, results: Array<GroupedHistoryStates>) => void
    ): Promise<Array<GroupedHistoryStates>> {
        return PromiseWrapper.promise(new QueryOps(this, target).groupedQuery(request), onCompletion);
    }

    /**
     * Aggregate history states of specified target.
     * @param {TypedID} target TypedID of target, only Types.THING is supported now.
     * @param {AggregateGroupedHistoryStatesRequest} request request object.
     * @param {function} [onCompletion] Callback function when completed.
     * @return {Promise} promise object.
     */
    aggregate(
        target: TypedID,
        request: Options.AggregateGroupedHistoryStatesRequest,
        onCompletion?: (err: Error, results: Array<AggregatedResults>) => void
        ): Promise<Array<AggregatedResults>>{
        return PromiseWrapper.promise(new QueryOps(this, target).aggregateQuery(request), onCompletion);
    }

    /** Get thingType to use trait for specified target thing.
     * If thing type is not set, then null is resolved.
     * @param {string} thingID ID of thing.
     * @param {function} [onCompletion] Callback function when completed
     * @return {Promise} promise object.
     */
    getThingType(thingID: string, onCompletion?: (err: Error, thingType: string|null)=> void): Promise<string|null>{
        return PromiseWrapper.promise(new ThingOps(this, thingID).getThingType(), onCompletion);
    }

    /** Update thingType to use trait for a specified target thing.
     * @param {string} thingID ID of thing.
     * @param {string} thingType Name of ThingType, which should be already defined.
     * @param {function} [onCompletion] Callback function when completed
     * @return {Promise} promise object.
     */
    updateThingType(
        thingID: string,
        thingType: string,
        onCompletion?: (err: Error)=> void): Promise<void>{
        return PromiseWrapper.voidPromise(new ThingOps(this, thingID).updateThingType(thingType), onCompletion);
    }

    /** Get firmware version of specified target thing. If firmware versoin is not set, then null is resolved.
     * @param {string} thingID ID of thing.
     * @param {function} [onCompletion] Callback function when completed
     * @return {Promise} promise object.
     */
    getFirmwareVersion(thingID: string, onCompletion?: (err: Error, firmwareVersion: string | null) => void): Promise<string> {
        return PromiseWrapper.promise(new ThingOps(this, thingID).getFirmwareVersion(), onCompletion);
    }

    /** Update firmware version of specified target thing.
     * @param {string} thingID ID of thing.
     * @param {string} firmwareVersion New firmware version.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object.
     */
    updateFirmwareVersion(
        thingID: string,
        firmwareVersion: string,
        onCompletion?: (err: Error) => void): Promise<void> {
        return PromiseWrapper.voidPromise(new ThingOps(this, thingID).updateFirmwareVersion(firmwareVersion), onCompletion);
    }
}
