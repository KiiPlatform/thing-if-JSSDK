/// <reference path="../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';

import {App} from './App';
import {Command} from './Command';
import Trigger from './Trigger'
import ServerCodeResult from './ServerCodeResult'
import * as Options from './RequestObjects'

import * as OnboardingOps from './ops/OnboardingOps'
import * as CommandOps from './ops/CommandOps'
import * as TriggerOps from './ops/TriggerOps'
import * as StateOps from './ops/StateOps'
import * as ThingOps from './ops/ThingOps'
import * as PushOps from './ops/PushOps'

/**
 * This callback type is called `onCompletion` and is displayed as a global symbol.
 *
 * @callback onCompletion
 * @param {Error} error
 * @param {Object} responseObject
 */

export class APIAuthor {
    public token: string;
    public app: App;

    constructor(token:string, app: App) {
        this.token = token;
        this.app = app;
    }

    /** Onboard Thing by vendorThingID
     * @param {Object} onboardRequest request body when request onboarding
     * @param {onCompletion} [onCompletion] callback function when completed
     * @return {Promise} promise object
     */
    onboardWithVendorThingID(
        onboardRequest: Options.OnboardWithVendorThingIDRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return OnboardingOps.onboardingThing(this, true, onboardRequest, onCompletion);
    }

    /** Onboard Thing by thingID for the things already registered on Kii Cloud.
     * @param {Object} onboardRequest - Request body when request onboarding
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    onboardWithThingID(
        onboardRequest: Options.OnboardWithThingIDRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return OnboardingOps.onboardingThing(this, false, onboardRequest, onCompletion);
    }

    /** Onboard an Endnode by vendorThingID with an already registered gateway.
     * @param {Object} onboardRequest - Request body when request onboarding
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    onboardEndnodeWithGateway(
        onboardRequest: Options.OnboardEndnodeWithGatewayRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return OnboardingOps.onboardEndnode(this, onboardRequest, onCompletion);
    }

    /** Post a new command.
     * @param {string} tareget - ID of target, where the command to be sent.
     * @param {Object} command - Necessary fields for new command
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    postNewCommand(
        target: string,
        command: Options.PostCommandRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Command>{
        return CommandOps.postNewCommand(this, target, command,onCompletion);
    }

    /** Retrieve command with specified ID.
     * @param {string} tareget - ID of target to be retrieved.
     * @param {string} commandID - Command ID to retrieve.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    getCommand(
        target: string,
        commandID: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Command>{
        return CommandOps.getCommand(this, target, commandID, onCompletion);
    }

    /** Retrieve commands.
     * @param {string} tareget - ID of target to be retrieved.
     * @param {Object} listOpitons - Options to retrieve commands.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    listCommands(
        target: string,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Array<Command>>{
        return CommandOps.listCommands(this, target, listOpitons, onCompletion);
    }

    /** Post a new command trigger.
     * @param {string} tareget - ID of target.
     * @param {Object} requestObject - Necessary fields for new command trigger.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    postCommandTrigger(
        target: string,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.postTrigger(this,target,requestObject, onCompletion);
    }

    /** Post a new servercode trigger.
     * @param {string} tareget - ID of target.
     * @param {Object} requestObject - Necessary fields for new servercode trigger.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    postServerCodeTriggger(
        target: string,
        requestObject: Options.ServerCodeTriggerRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.postTrigger(this,target,requestObject, onCompletion);
    }

    /** Retrieve trigger.
     * @param {string} tareget - ID of target.
     * @param {string} triggerID - ID of trigger.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    getTrigger(
        target: string,
        triggerID: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.getTrigger(this,target,triggerID, onCompletion);
    }

    /** Update a command trigger.
     * @param {string} tareget - ID of target.
     * @param {string} triggerID - ID of trigger.
     * @param {Object} requestObject - The fields of trigger to be updated.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    patchCommandTrigger(
        target: string,
        triggerID: string,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.patchTrigger(this,target,triggerID,requestObject,onCompletion);
    }

    /** Update a servercode trigger.
     * @param {string} tareget - ID of target.
     * @param {string} triggerID - ID of trigger.
     * @param {Object} requestObject - The fields of trigger to be updated.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
   patchServerCodeTrigger(
        target: string,
        triggerID: string,
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.patchTrigger(this,target,triggerID,requestObject,onCompletion);
    }

    /** Enable/Disable a specified trigger.
     * @param {string} tareget - ID of target.
     * @param {string} triggerID - ID of trigger.
     * @param {boolean} enable - true to enable, otherwise, disable the trigger.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    enableTrigger(
        target: string,
        triggerID: string,
        enable: boolean,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.enableTrigger(this,target,triggerID,enable,onCompletion);
    }

    /** Delete a specified trigger.
     * @param {string} tareget - ID of target.
     * @param {string} triggerID - ID of trigger.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    deleteTrigger(
        target: string,
        triggerID: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Trigger>{
        return TriggerOps.deleteTrigger(this,target,triggerID,onCompletion);
    }

    /** Retrive triggers.
     * @param {string} tareget - ID of target, which trigger belonged to.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    listTriggers(
        target: string,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Array<Trigger>>{
        return TriggerOps.listTriggers(this,target,listOpitons,onCompletion);
    }

    /** Retrieve execution results of server code trigger.
     * @param {string} tareget - ID of target.
     * @param {string} triggerID - ID of trigger.
     * @param {Object} listOpitons - Options to retrieve.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    listServerCodeExecutionResults(
        target: string,
        triggerID: string,
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Array<ServerCodeResult>>{
        return TriggerOps.listServerCodeResults(this,target,triggerID,listOpitons,onCompletion);
    }

    /** Get State of specified target.
     * @param {string} tareget - ID of target.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    getState(
        target: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return StateOps.getState(this,target,onCompletion);
    }

    /** Get vendorThingID of specified target
     * @param {string} tareget - ID of target.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    getVendorThingID(
        target: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<string>{
        return ThingOps.getVendorThingID(this,target,onCompletion);
    }

    /** Update vendorThingID of specified target
     * @param {string} tareget - ID of target.
     * @param {string} newVendorThingID - New vendorThingID of target to be updated.
     * @param {string} newPassword - New password of target to be updated.
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object
     */
    updateVendorThingID(
        target: string,
        newVendorThingID: string,
        newPassword: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<string>{
        return ThingOps.updateVendorThingID(this,newVendorThingID,newPassword,target,onCompletion);
    }

    /** Register the id issued by Firebase Cloud Message to Kii cloud for kii user.
     * @param {string} installationRegistrationID The ID of registration that identifies the installation externally.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [onCompletion] Callback function when completed.
     * @return {Promise} promise object.
     */
    installFCM(
        installationRegistrationID:string,
        development: boolean,
        onCompletion?: (err: Error, res:Object)=> void): Promise<string>{
        return PushOps.installFCM(this, installationRegistrationID, development, onCompletion);
    }

    /** Register a MQTT installation to the Kii cloud for kii user.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [onCompletion] Callback function when completed.
     * @return {Promise} promise object.
     */
    installMqtt(
        development: boolean,
        onCompletion?: (err: Error, res:Object)=> void): Promise<string>{
        return PushOps.installMqtt(this, development, onCompletion);
    }

    /** Unregister the push settings by the id(issued by KiiCloud) that is used for installation.
     * @param {string} installationID The ID of the installation issued by KiiCloud.
     * @param {onCompletion} [onCompletion] Callback function when completed
     * @return {Promise} promise object.
     */
    uninstallPush(
        installationID: string,
        onCompletion?: (err: Error, res:Object)=> void): Promise<string>{
        return PushOps.uninstall(this, installationID, onCompletion);
    }
}