/// <reference path="../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';

import {App} from './App';
import {Command} from './Command';
import {Trigger} from './Trigger'
import {ServerCodeResult} from './ServerCodeResult'
import * as Options from './RequestObjects'
import {TypedID} from './TypedID'
import {OnboardingResult} from './OnboardingResult'
import MqttInstallationResult from './MqttInstallationResult'

import OnboardingOps from './ops/OnboardingOps'
import CommandOps from './ops/CommandOps'
import TriggerOps from './ops/TriggerOps'
import StateOps from './ops/StateOps'
import ThingOps from './ops/ThingOps'
import PushOps from './ops/PushOps'
import {QueryResult} from './QueryResult'
import * as PromiseWrapper from './internal/PromiseWrapper'

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

    /** Onboard an Endnode by vendorThingID with an already registered gateway.
     * @param {Object} onboardRequest Necessary fields when request onboarding
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    onboardEndnodeWithGateway(
        onboardRequest: Options.OnboardEndnodeWithGatewayRequest,
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<OnboardingResult>{
        return PromiseWrapper.promise((new OnboardingOps(this)).onboardEndnode(onboardRequest), onCompletion);
    }

    /** Post a new command.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {Object} command Necessary fields for new command
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postNewCommand(
        target: TypedID,
        command: Options.PostCommandRequest,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        return PromiseWrapper.promise((new CommandOps(this, target.toString())).postNewCommand(command),onCompletion);
    }

    /** Retrieve command with specified ID.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} commandID Command ID to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getCommand(
        target: TypedID,
        commandID: string,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        return PromiseWrapper.promise((new CommandOps(this, target.toString())).getCommand(commandID), onCompletion);
    }

    /** Retrieve commands.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {Object} listOpitons Options to retrieve commands.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listCommands(
        target: TypedID,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, commands:QueryResult<Command>)=> void): Promise<QueryResult<Command>>{
        return PromiseWrapper.promise((new CommandOps(this, target.toString())).listCommands(listOpitons), onCompletion);
    }

    /** Post a new command trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {Object} requestObject Necessary fields for new command trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postCommandTrigger(
        target: TypedID,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).postCommandTrigger(requestObject), onCompletion);
    }

    /** Post a new servercode trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {Object} requestObject Necessary fields for new servercode trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postServerCodeTriggger(
        target: TypedID,
        requestObject: Options.ServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).postServerCodeTriggger(requestObject), onCompletion);
    }

    /** Retrieve trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getTrigger(
        target: TypedID,
        triggerID: string,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).getTrigger(triggerID), onCompletion);
    }

    /** Update a command trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    patchCommandTrigger(
        target: TypedID,
        triggerID: string,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).patchCommandTrigger(triggerID, requestObject), onCompletion);
    }

    /** Update a servercode trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
   patchServerCodeTrigger(
        target: TypedID,
        triggerID: string,
        requestObject: Options.ServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).patchServerCodeTrigger(triggerID, requestObject), onCompletion);
    }

    /** Enable/Disable a specified trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {boolean} enable True to enable, otherwise, disable the trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    enableTrigger(
        target: TypedID,
        triggerID: string,
        enable: boolean,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).enableTrigger(triggerID, enable), onCompletion);
    }

    /** Delete a specified trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    deleteTrigger(
        target: TypedID,
        triggerID: string,
        onCompletion?: (err: Error, triggerID:string)=> void): Promise<string>{
        return PromiseWrapper.promise((new TriggerOps(this, target)).deleteTrigger(triggerID), onCompletion);
    }

    /** Retrive triggers.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listTriggers(
        target: TypedID,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, triggers:QueryResult<Trigger>)=> void): Promise<QueryResult<Trigger>>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).listTriggers(listOpitons), onCompletion);
    }

    /** Retrieve execution results of server code trigger.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {string} triggerID ID of trigger.
     * @param {Object} listOpitons Options to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listServerCodeExecutionResults(
        target: TypedID,
        triggerID: string,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, results:QueryResult<ServerCodeResult>)=> void): Promise<QueryResult<ServerCodeResult>>{
        return PromiseWrapper.promise((new TriggerOps(this,target)).listServerCodeResults(triggerID, listOpitons), onCompletion);
    }

    /** Get State of specified target.
     * @param {TypedID} tareget TypedID of target, only Types.THING is supported now.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getState(
        target: TypedID,
        onCompletion?: (err: Error, state:Object)=> void): Promise<Object>{
        return PromiseWrapper.promise((new StateOps(this, target.toString())).getState(), onCompletion);
    }

    /** Get vendorThingID of specified target
     * @param {string} thingID ID of thing.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
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
     */
    installFCM(
        installationRegistrationID:string,
        development: boolean,
        onCompletion?: (err: Error, installationID:string)=> void): Promise<string>{
        return PromiseWrapper.promise((new PushOps(this)).installFCM(installationRegistrationID, development), onCompletion);
    }

    /** Install MQTT notification to receive notification from IoT Cloud.
     * IoT Cloud will send notification when the Target replies to the Command. Application can
     * receive the notification and check the result of Command fired by Application or registered Trigger.     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [function] Callback function when completed.
     * @return {Promise} promise object.
     */
    installMqtt(
        development: boolean,
        onCompletion?: (err: Error, result:MqttInstallationResult)=> void): Promise<MqttInstallationResult>{
        return PromiseWrapper.promise((new PushOps(this)).installMqtt(development), onCompletion);
    }

    /** Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param {string} installationID The ID of the installation issued by KiiCloud.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object.
     */
    uninstallPush(
        installationID: string,
        onCompletion?: (err: Error)=> void): Promise<void>{
        return PromiseWrapper.voidPromise((new PushOps(this)).uninstall(installationID), onCompletion);
    }
}