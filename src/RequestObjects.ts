
import Predicate from './Predicate'
import ServerCode from './ServerCode'
import {TypeID} from './TypeID'

/** OnboardWithVendorThingIDRequest contains necessary fields to request onboarding
 * with vendorThingID with owner
 */
export class OnboardWithVendorThingIDRequest {

    constructor(
        public vendorThingID: string,
        public thingPassword: string,
        public owner: TypeID,
        public thingType?:string,
        public thingProperties?:Object){}
}

/** OnboardWithThingIDRequest contains necessary fields to request onboarding
 * with thingID with owner
 */
export class OnboardWithThingIDRequest {

    constructor(
        public thingID: string,
        public thingPassword: string,
        public owner: TypeID){}
}

/** OnboardEndnodeWithGatewayRequest contains necessary fields to request onboarding
 * endnode with gateway
 */
export class OnboardEndnodeWithGatewayRequest {

    constructor(
        public gatewayThingID: string,
        public endNodeVendorThingID: string,
        public endNodePassword: string,
        public owner: TypeID,
        public thingType?:string,
        public thingProperties?:Object){}
}

/** PostCommandRequest contains necessary fields to request post new command
 */
export class PostCommandRequest {
    constructor(
        public schemaName: string,
        public schemaVersion: number,
        public actions: Object,
        public issuer: TypeID,
        public title?: string,
        public description?: string,
        public metaData?: Object){}
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