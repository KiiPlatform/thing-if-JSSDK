
import {Predicate} from './Predicate'
import {ServerCode} from './ServerCode'
import {TypedID} from './TypedID'

/** OnboardWithVendorThingIDRequest contains necessary fields to request onboarding
 * with vendorThingID with owner
 */
export class OnboardWithVendorThingIDRequest {
    public owner: string;
    constructor(
        public vendorThingID: string,
        public thingPassword: string,
        ownerType: TypedID,
        public thingType?:string,
        public thingProperties?:Object){
            if (!!ownerType) {
                this.owner = ownerType.toString();
            }
        }
}

/** OnboardWithThingIDRequest contains necessary fields to request onboarding
 * with thingID with owner
 */
export class OnboardWithThingIDRequest {
    public owner: string;
    constructor(
        public thingID: string,
        public thingPassword: string,
        ownerType: TypedID){
            if (!!ownerType) {
                this.owner = ownerType.toString();
            }
        }
}

/** OnboardEndnodeWithGatewayRequest contains necessary fields to request onboarding
 * endnode with gateway
 */
export class OnboardEndnodeWithGatewayRequest {
    public owner: string;
    constructor(
        public gatewayThingID: string,
        public endNodeVendorThingID: string,
        public endNodePassword: string,
        ownerType: TypedID,
        public thingType?:string,
        public thingProperties?:Object){
            this.owner = ownerType.toString();
        }
}

/** PostCommandRequest contains necessary fields to request post new command
 */
export class PostCommandRequest {
    public issuer: string;
    constructor(
        public schema: string,
        public schemaVersion: number,
        public actions: Array<Object>,
        issuerID: TypedID,
        public title?: string,
        public description?: string,
        public metaData?: Object){
            if(!!issuerID && !!issuerID.id && !!issuerID.type){
                this.issuer = issuerID.toString();
            }
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