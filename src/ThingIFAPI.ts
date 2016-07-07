/// <reference path="../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';

import {App} from './App';
import {Command} from './Command';
import Trigger from './Trigger'
import ServerCodeResult from './ServerCodeResult'
import * as Options from './RequestObjects'
import {TypedID} from './TypedID'
import {OnboardingResult} from './OnboardingResult'
import {APIAuthor} from './APIAuthor'

/** ThingIFAPI represent an API instance to access Thing-IF APIs for a specified target */
export default class ThingIFAPI {
    private _token: string;
    private _app: App;
    private _target: TypedID;
    private _au: APIAuthor;

    /**
     * @param {string} token A token can access Thing-IF APIs, which can be admin token or token of
     *  a registered kii user.
     * @param {App} app App instance of existing Kii App. You must create a app in
     *  [Kii developer portal]{@link https://developer.kii.com}
     * @param {TypedID} [target] TypedID for a specified target.
    */
    constructor(token:string, app: App, target?: TypedID) {
        this._token = token;
        this._app = app;
        this._target = target;
        this._au = new APIAuthor(token, app);
    }

    /** Access token of APIAuthor. */
    get token(): string {
        return this._token;
    }

    /** App instance about Kii App. */
    get app(): App {
        return this._app;
    }

    /** TypeID of target. */
    get target(): TypedID {
        return this._target;
    }

    /** Onboard Thing by vendorThingID
     * @param {Object} onboardRequest request body when request onboarding
     * @param {onCompletion} [function] callback function when completed
     * @return {Promise} promise object
     */
    onboardWithVendorThingID(
        onboardRequest: Options.OnboardWithVendorThingIDRequest,
        onCompletion?: (err: Error, res:OnboardingResult)=> void): Promise<Object>{
        return new Promise<Object>((resolve, reject) =>{
            this._au.onboardWithVendorThingID(onboardRequest, onCompletion)
            .then((result)=>{
                // this._target = new TypedID(Types.Thing, <string>result["thingID"]);
                resolve(result);
             }).catch((err)=>{
                 reject(err);
             })
        })
    }

    /** Onboard Thing by thingID for the things already registered on Kii Cloud.
     * @param {Object} onboardRequest Necessary fields when request onboarding
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    onboardWithThingID(
        onboardRequest: Options.OnboardWithThingIDRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return this._au.onboardWithThingID(onboardRequest, onCompletion);
    }

    /** Onboard an Endnode by vendorThingID with an already registered gateway.
     * @param {Object} onboardRequest Necessary fields when request onboarding
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    onboardEndnodeWithGateway(
        onboardRequest: Options.OnboardEndnodeWithGatewayRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return this._au.onboardEndnodeWithGateway(onboardRequest, onCompletion);
    }

    /** Post a new command.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {Object} command Necessary fields for new command
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postNewCommand(
        command: Options.PostCommandRequest,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        return this._au.postNewCommand(this.target, command, onCompletion);
    }

    /** Retrieve command with specified ID.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} commandID Command ID to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getCommand(
        commandID: string,
        onCompletion?: (err: Error, command:Command)=> void): Promise<Command>{
        return this._au.getCommand(this.target, commandID, onCompletion);
    }

    /** Retrieve commands.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {Object} listOpitons Options to retrieve commands.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listCommands(
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, commands:Array<Command>)=> void): Promise<Array<Command>>{
        return this._au.listCommands(this.target, listOpitons, onCompletion);
    }

    /** Post a new command trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {Object} requestObject Necessary fields for new command trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postCommandTrigger(
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.postCommandTrigger(this.target, requestObject, onCompletion);
    }

    /** Post a new servercode trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {Object} requestObject Necessary fields for new servercode trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postServerCodeTriggger(
        requestObject: Options.ServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.postServerCodeTriggger(this.target, requestObject, onCompletion);
    }

    /** Retrieve trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getTrigger(
        triggerID: string,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.getTrigger(this.target, triggerID, onCompletion);
    }

    /** Update a command trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    patchCommandTrigger(
        triggerID: string,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.patchCommandTrigger(this.target, triggerID, requestObject, onCompletion);
    }

    /** Update a servercode trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {Object} requestObject The fields of trigger to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
   patchServerCodeTrigger(
        triggerID: string,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.patchServerCodeTrigger(this.target, triggerID, requestObject, onCompletion);
    }

    /** Enable/Disable a specified trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {boolean} enable True to enable, otherwise, disable the trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    enableTrigger(
        triggerID: string,
        enable: boolean,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.enableTrigger(this.target, triggerID, enable, onCompletion);
    }

    /** Delete a specified trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    deleteTrigger(
        triggerID: string,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.deleteTrigger(this.target, triggerID, onCompletion);
    }

    /** Retrive triggers.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listTriggers(
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, triggers:Array<Trigger>)=> void): Promise<Array<Trigger>>{
        return this._au.listTriggers(this.target, listOpitons, onCompletion);
    }

    /** Retrieve execution results of server code trigger.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} triggerID ID of trigger.
     * @param {Object} listOpitons Options to retrieve.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listServerCodeExecutionResults(
        triggerID: string,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, results:Array<ServerCodeResult>)=> void): Promise<Array<ServerCodeResult>>{
        return this._au.listServerCodeExecutionResults(this.target, triggerID, listOpitons, onCompletion);
    }

    /** Get State of specified target.
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getState(
        onCompletion?: (err: Error, state:Object)=> void): Promise<Object>{
        return this._au.getState(this.target, onCompletion);
    }

    /** Get vendorThingID of specified target
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    getVendorThingID(
        onCompletion?: (err: Error, vendorThingID:string)=> void): Promise<string>{
        return this._au.getVendorThingID(this.target.id, onCompletion);
    }

    /** Update vendorThingID of specified target
     *
     * **Note**: Please onboard first, or provide a target when constructor ThingIFAPI.
     *  Otherwise, error will be returned.
     * @param {string} newVendorThingID New vendorThingID of target to be updated.
     * @param {string} newPassword New password of target to be updated.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    updateVendorThingID(
        newVendorThingID: string,
        newPassword: string,
        onCompletion?: (err: Error)=> void): Promise<void>{
        return this._au.updateVendorThingID(newVendorThingID, newPassword, this.target.id, onCompletion);
    }

    /** Register the id issued by Firebase Cloud Message to Kii cloud for kii user.
     * @param {string} installationRegistrationID The ID of registration that identifies the installation externally.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [function] Callback function when completed.
     * @return {Promise} promise object.
     */
    installFCM(
        installationRegistrationID:string,
        development: boolean,
        onCompletion?: (err: Error, installationID:string)=> void): Promise<string>{
        return this._au.installFCM(installationRegistrationID, development, onCompletion);
    }

    /** Register a MQTT installation to the Kii cloud for kii user.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [function] Callback function when completed.
     * @return {Promise} promise object.
     */
    installMqtt(
        development: boolean,
        onCompletion?: (err: Error, installationID:string)=> void): Promise<string>{
        return this._au.installMqtt(development, onCompletion);
    }

    /** Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param {string} installationID The ID of the installation issued by KiiCloud.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object.
     */
    uninstallPush(
        installationID: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<string>{
        return this._au.uninstallPush(installationID, onCompletion);
    }
}