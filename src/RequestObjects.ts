
import {Predicate} from './Predicate'
import {ServerCode} from './ServerCode'
import {TypedID} from './TypedID'

/** OnboardWithVendorThingIDRequest contains necessary fields to request onboarding
 * with vendorThingID with owner
 */
export class OnboardWithVendorThingIDRequest {
    public vendorThingID: string;
    public thingPassword: string;
    public owner: string;
    public thingType: string;
    public thingProperties: Object;

    constructor(
        vendorThingID: string,
        thingPassword: string,
        ownerType?: TypedID,
        thingType?: string,
        thingProperties?: Object) {
            this.vendorThingID = vendorThingID;
            this.thingPassword = thingPassword;
            if (!!ownerType) {
                this.owner = ownerType.toString();
            }
            this.thingType = thingType;
            this.thingProperties = thingProperties;
        }
}

/** OnboardWithThingIDRequest contains necessary fields to request onboarding
 * with thingID with owner
 */
export class OnboardWithThingIDRequest {
    public thingID: string;
    public thingPassword: string;
    public owner: string;

    constructor(
        thingID: string,
        thingPassword: string,
        ownerType?: TypedID) {
            this.thingID = thingID;
            this.thingPassword = thingPassword;
            if (!!ownerType) {
                this.owner = ownerType.toString();
            }
        }
}

/** OnboardEndnodeWithGatewayRequest contains necessary fields to request onboarding
 * endnode with gateway
 */
export class OnboardEndnodeWithGatewayRequest {
    public gatewayThingID: string;
    public endNodeVendorThingID: string;
    public endNodePassword: string;
    public owner: string;
    public thingType: string;
    public thingProperties: Object;

    constructor(
        gatewayThingID: string,
        endNodeVendorThingID: string,
        endNodePassword: string,
        ownerType: TypedID,
        thingType?: string,
        thingProperties?: Object) {
            this.gatewayThingID = gatewayThingID;
            this.endNodeVendorThingID = endNodeVendorThingID;
            this.endNodePassword = endNodePassword;
            this.owner = ownerType.toString();
            this.thingType = thingType;
            this.thingProperties = thingProperties;
        }
}

/** PostCommandRequest contains necessary fields to request post new command
 */
export class PostCommandRequest {
    public schema: string;
    public schemaVersion: number;
    public actions: Array<Object>;
    public issuer: string;
    public title: string;
    public description: string;
    public metaData: Object;

    constructor(
        schema: string,
        schemaVersion: number,
        actions: Array<Object>,
        issuerID?: TypedID,
        title?: string,
        description?: string,
        metaData?: Object) {
            this.schema = schema;
            this.schemaVersion = schemaVersion;
            this.actions = actions;
            if(!!issuerID && !!issuerID.id && !!issuerID.type){
                this.issuer = issuerID.toString();
            }
            this.title = title;
            this.description = description;
            this.metaData = metaData;
        }
}

/** ListQueryOptions contains the optional parameters when request list of endpoints */
export class ListQueryOptions {
    public bestEffortLimit: number;
    public paginationKey: string;

    constructor(
        bestEffortLimit?: number,
        paginationKey?: string
    ) {
        this.bestEffortLimit = bestEffortLimit;
        this.paginationKey = paginationKey;
    }

    static getQueryString(options: ListQueryOptions): string{
        let arr: Array<string> = [];
        if(!!options.bestEffortLimit){
            arr.push(`bestEffortLimit=${options.bestEffortLimit}`);
        }
        if(!!options.paginationKey){
            arr.push(`paginationKey=${options.paginationKey}`);
        }
        return arr.join('&')
    }
}

export class CommandTriggerRequest{
    public schema: string;
    public schemaVersion: number;
    public actions: Array<Object>;
    public predicate: Predicate;
    public issuerID: TypedID;

    constructor(
        schema: string,
        schemaVersion: number,
        actions?: Array<Object>,
        predicate?: Predicate,
        issuerID?: TypedID
    ) {
        this.schema = schema;
        this.schemaVersion = schemaVersion;
        this.actions = actions;
        this.predicate = predicate;
        this.issuerID = issuerID;
    }
}

export class ServerCodeTriggerRequest{
    public serverCode: ServerCode;
    public predicate: Predicate;

    constructor(
        serverCode?: ServerCode,
        predicate?: Predicate
    ) {
        this.serverCode = serverCode;
        this.predicate = predicate;
    }
}
