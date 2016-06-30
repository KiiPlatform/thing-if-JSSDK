/// <reference path="../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';

import {App} from './App';
import * as RequetObjects from './thingif/RequestObjects'
import {onboardingThing, onboardEndnode} from './thingif/Onboarding'

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
    onboardWithVendorThingID(onboardRequest: RequetObjects.OnboardWithVendorThingIDRequest, 
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return onboardingThing(this, true, onboardRequest.getRequestBody, onCompletion);
    }

    /** Onboard Thing by thingID for the things already registered on Kii Cloud.
     * @param {Object} onboardRequest - Request body when request onboarding
     * @param {onCompletion} [onCompletion] - callback function when completed
     * @return {Promise} promise object 
     */
    onboardWithThingID(onboardRequest: RequetObjects.OnboardWithThingIDRequest, 
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return onboardingThing(this, false, onboardRequest.getRequestBody, onCompletion);
    }

    onboardEndnodeWithGateway(onboardRequest: RequetObjects.OnboardEndnodeWithGatewayRequest, 
        onCompletion?: (err: Error, res:Object)=> void): Promise<Object>{
        return onboardEndnode(this, onboardRequest.getRequestBody(), onCompletion);
    }
}