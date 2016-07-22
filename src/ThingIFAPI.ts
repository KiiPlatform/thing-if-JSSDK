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
import MqttInstallationResult from './MqttInstallationResult'
import * as PromiseWrapper from './internal/PromiseWrapper'
import {ThingIFError, Errors} from './ThingIFError'

import OnboardingOps from './ops/OnboardingOps'
import CommandOps from './ops/CommandOps'
import TriggerOps from './ops/TriggerOps'
import StateOps from './ops/StateOps'
import ThingOps from './ops/ThingOps'
import PushOps from './ops/PushOps'
import {QueryResult} from './QueryResult'

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
     * @param {Object} listOpitons Options to retrieve commands.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    listCommands(
        listOpitons?: Options.ListQueryOptions,
        onCompletion?: (err: Error, commands:QueryResult<Command>)=> void): Promise<QueryResult<Command>>{
        let orgPromise = new Promise<QueryResult<Command>>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new CommandOps(this._au, this._target)).listCommands(listOpitons).then((result)=>{
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
     * @param {Object} requestObject Necessary fields for new command trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postCommandTrigger(
        requestObject: Options.CommandTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        let orgPromise = new Promise<Trigger>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
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
     * @param {Object} requestObject Necessary fields for new servercode trigger.
     * @param {onCompletion} [function] Callback function when completed
     * @return {Promise} promise object
     */
    postServerCodeTrigger(
        requestObject: Options.ServerCodeTriggerRequest,
        onCompletion?: (err: Error, trigger:Trigger)=> void): Promise<Trigger>{
        return this._au.postServerCodeTrigger(this.target, requestObject, onCompletion);
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
        requestObject: Options.ServerCodeTriggerRequest,
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
        onCompletion?: (err: Error, triggerID:string)=> void): Promise<string>{
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
        onCompletion?: (err: Error, triggers:QueryResult<Trigger>)=> void): Promise<QueryResult<Trigger>>{
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
        onCompletion?: (err: Error, results:QueryResult<ServerCodeResult>)=> void): Promise<QueryResult<ServerCodeResult>>{
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

    /** Register a MQTT installation to the Kii cloud for kii user.
     * @param {boolean} development Indicates if the installation is for development or production environment.
     * @param {onCompletion} [function] Callback function when completed.
     * @return {Promise} promise object.
     */
    installMqtt(
        development: boolean,
        onCompletion?: (err: Error, result:MqttInstallationResult)=> void): Promise<MqttInstallationResult>{
        let orgPromise = new Promise<MqttInstallationResult>((resolve, reject)=>{
            if(!this._target){
                reject(new ThingIFError(Errors.IlllegalStateError, "target is null, please onboard first"));
                return;
            }
            (new PushOps(this._au)).installMqtt(development)
            .then((result)=>{
                resolve(result);
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