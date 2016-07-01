
import Predicate from './Predicate'
import ServerCode from './ServerCode'

/** OnboardWithVendorThingIDRequest contains necessary fields to request onboarding 
 * with vendorThingID with owner
 */
export class OnboardWithVendorThingIDRequest {

    constructor(
        public vendorThingID: string, 
        public thingPassword: string, 
        public ownerID: string, 
        public thingType?:string, 
        public thingProperties?:Object){}
 
    getRequestBody(): Object {
        let requestBody = <any>{
            vendorThingID: this.vendorThingID,
            thingPassword: this.thingPassword,
            owner: `user:${this.ownerID}`
        };
        if(!!this.thingType) {
            requestBody['thingType'] = this.thingType;
        }
        if(!!this.thingProperties) {
            requestBody['thingProperties'] = this.thingProperties;
        }
        return requestBody;
    }  
}

/** OnboardWithThingIDRequest contains necessary fields to request onboarding 
 * with thingID with owner
 */
export class OnboardWithThingIDRequest {

    constructor(
        public thingID: string, 
        public thingPassword: string, 
        public ownerID: string){}
 
    getRequestBody(): Object {
        let requestBody = <any>{
            thingID: this.thingID,
            thingPassword: this.thingPassword,
            owner: `user:${this.ownerID}`
        };
         return requestBody;
    }  
}

/** OnboardEndnodeWithGatewayRequest contains necessary fields to request onboarding 
 * endnode with gateway
 */
export class OnboardEndnodeWithGatewayRequest {

    constructor(
        public gatewayThingID: string, 
        public endNodeVendorThingID: string,
        public endNodePassword: string, 
        public ownerID: string,
        public thingType?:string, 
        public thingProperties?:Object){}
 
    getRequestBody(): Object {
        let requestBody = <any>{
            gatewayThingID: this.gatewayThingID,
            endNodeVendorThingID: this.endNodeVendorThingID,
            endNodePassword: this.endNodePassword,
            owner: `user:${this.ownerID}`
        };
        if(!!this.thingType) {
            requestBody['thingType'] = this.thingType;
        }
        if(!!this.thingProperties) {
            requestBody['thingProperties'] = this.thingProperties;
        }
         return requestBody;
    }  
}

/** PostCommandRequest contains necessary fields to request post new command
 */
export class PostCommandRequest {
    constructor(
        public schemaName: string, 
        public schemaVersion: number,
        public actions: Object,
        public issuer: string,
        public targetID: string,
        public title?: string,
        public description?: string,
        public metaData?: Object){}

    getRequestBody(): Object {
        //TODO: implement me
        return {}
    }
}

/** ListQueryOptions contains the optional parameters when request list of endpoints */
export class ListQueryOptions {
    constructor(
        public bestEffortLimit?: number,
        public paginationKey?: string
    ){}
}

export class CommandTriggerRequest{
    constructor(
        public schemaName: string,
        public schemaVersion: number,
        public actions: Object,
        public predicate: Predicate
    ){}
}

export class ServerCodeTriggerRequest{
    constructor(
        public serverCode: ServerCode,
        public predicate: Predicate
    ){}
}