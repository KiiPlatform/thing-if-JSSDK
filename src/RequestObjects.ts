
import {Predicate} from './Predicate'
import {ServerCode} from './ServerCode'
import {TypedID} from './TypedID'
import {DataGroupingInterval} from './DataGroupingInterval'
import {LayoutPosition} from './LayoutPosition'

/**
 * Represents the request for onboarding with vendorThingID with owner.
 * @prop {string} vendorThingID ID of the thing given by the thing vendor.
 * @prop {string} thingPassword Password of the thing.
 * @prop {string} owner ID of the owner. UserID or GroupID.
 * @prop {string} thingType Type of the thing. This is optional and ignored if Thing is already registered.
 * @prop {Object} thingProperties Thing properties includes predefined and custom properties.
 * @prop {string} firmwareVersion Firmware version of thing.
 * @prop {string} dataGroupingInterval Internal used to group state history of thing.
 * @prop {string} layoutPosition Layout position of thing.
 */
export class OnboardWithVendorThingIDRequest {
    public vendorThingID: string;
    public thingPassword: string;
    public owner: string;
    public thingType: string;
    public thingProperties: Object;
    public firmwareVersion: string;
    public dataGroupingInterval: string;
    public layoutPosition: string;

    /**
     * Create a OnboardWithVendorThingIDRequest.
     * @constructor
     * @param {string} vendorThingID ID of the thing given by the thing vendor.
     * @param {string} thingPassword Password of the thing.
     * @param {TypedID} [ownerID] ID of the owner. UserID or GroupID.
     * @param {string} [thingType] Type of the thing. This is optional and ignored if Thing is already registered.
     * @param {Object} [thingProperties] Thing properties includes predefined and custom properties.
     * @param {string} [firmwareVersion] Firmware version of thing.
     * @param {string} [dataGroupingInterval] Internal used to group state history of thing. Only the values of [DataGroupingInterval]{@link DataGroupingInterval} should be used.
     * @param {string} [layoutPosition] Layout position of thing. Only the values of [LayoutPosition]{@link LayoutPosition} should be used.
     */
    constructor(
        vendorThingID: string,
        thingPassword: string,
        ownerID?: TypedID,
        thingType?: string,
        thingProperties?: Object,
        firmwareVersion?:string,
        dataGroupingInterval?:string,
        layoutPosition?: string
        ) {
            this.vendorThingID = vendorThingID;
            this.thingPassword = thingPassword;
            if (!!ownerID) {
                this.owner = ownerID.toString();
            }
            this.thingType = thingType;
            this.thingProperties = thingProperties;
            if(!!firmwareVersion){
                this.firmwareVersion = firmwareVersion;
            }
            if(!!dataGroupingInterval){
                this.dataGroupingInterval = dataGroupingInterval;
            }
            if(!!layoutPosition){
                this.layoutPosition = layoutPosition;
            }
        }
}

/**
 * Represents the request for onboarding with thingID with owner.
 * @prop {string} thingID ID of the thing given by IoT Cloud.
 * @prop {string} thingPassword Password of the thing.
 * @prop {string} owner ID of the owner. UserID or GroupID.
 * @prop {string} dataGroupingInterval Internal used to group state history of thing.
 * @prop {string} layoutPosition Layout position of thing.
 */
export class OnboardWithThingIDRequest {
    public thingID: string;
    public thingPassword: string;
    public owner: string;
    public dataGroupingInterval: string;
    public layoutPosition: string;
    /**
     * Create a OnboardWithThingIDRequest.
     * @constructor
     * @param {string} thingID ID of the thing given by IoT Cloud.
     * @param {string} thingPassword Password of the thing.
     * @param {TypedID} [ownerID] ID of the owner. UserID or GroupID.
     * @param {string} [dataGroupingInterval] Internal used to group state history of thing. Only the values of [DataGroupingInterval]{@link DataGroupingInterval} should be used.
     * @param {string} [layoutPosition] Layout position of thing. Only the values of [LayoutPosition]{@link LayoutPosition} should be used.
     */
    constructor(
        thingID: string,
        thingPassword: string,
        ownerID?: TypedID,
        dataGroupingInterval?:string,
        layoutPosition?: string) {
            this.thingID = thingID;
            this.thingPassword = thingPassword;
            if (!!ownerID) {
                this.owner = ownerID.toString();
            }
            this.dataGroupingInterval = dataGroupingInterval;
            this.layoutPosition = layoutPosition;
        }
}

// /**
//  * Represents the request for onboarding endnode with gateway.
//  * @prop {string} gatewayThingID
//  * @prop {string} endNodeVendorThingID
//  * @prop {string} endNodePassword
//  * @prop {string} owner
//  * @prop {string} thingType
//  * @prop {Object} thingProperties
//  */
// export class OnboardEndnodeWithGatewayRequest {
//     public gatewayThingID: string;
//     public endNodeVendorThingID: string;
//     public endNodePassword: string;
//     public owner: string;
//     public thingType: string;
//     public thingProperties: Object;

//     /**
//      * Create a OnboardEndnodeWithGatewayRequest.
//      * @constructor
//      * @param {string} gatewayThingID
//      * @param {string} endNodeVendorThingID
//      * @param {string} endNodePassword
//      * @param {TypedID} ownerType
//      * @param {string} [thingType]
//      * @param {Object} [thingProperties]
//      */
//     constructor(
//         gatewayThingID: string,
//         endNodeVendorThingID: string,
//         endNodePassword: string,
//         ownerType: TypedID,
//         thingType?: string,
//         thingProperties?: Object) {
//             this.gatewayThingID = gatewayThingID;
//             this.endNodeVendorThingID = endNodeVendorThingID;
//             this.endNodePassword = endNodePassword;
//             this.owner = ownerType.toString();
//             this.thingType = thingType;
//             this.thingProperties = thingProperties;
//         }
// }

/**
 * Represents the request for creating a command.
 * @prop {string} schema Name of schema.
 * @prop {number} schemaVersion Version number of schema.
 * @prop {Object[]} actions Array of actions of the command.
 * @prop {string} issuer ID of the command issuer.
 * @prop {string} title Title of the command.
 * @prop {string} description Description of the command.
 * @prop {Object} metaData Key-value list to store within command definition.
 */
export class PostCommandRequest {
    public schema: string;
    public schemaVersion: number;
    public actions: Array<Object>;
    public issuer: string;
    public title: string;
    public description: string;
    public metaData: Object;

    /**
     * Create a PostCommandRequest.
     * @constructor
     * @param {string} schema Name of schema.
     * @param {number} schemaVersion Version number of schema.
     * @param {number[]} actions Array of actions of the command.
     * @param {TypedID} [issuerID] ID of the command issuer.
     * @param {string} [title] Title of the command.
     * @param {string} [description] Description of the command.
     * @param {Object} [metaData] Key-value list to store within command definition.
     */
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

/**
 * ListQueryOptions contains the optional parameters when request list of endpoints
 * @prop {number} bestEffortLimit Limit the number of results for query.
 * @prop {string} paginationKey Key to retrieve next page.
*/
export class ListQueryOptions {
    public bestEffortLimit: number;
    public paginationKey: string;

    /**
     * Create a ListQueryOptions.
     * @constructor
     * @param {number} [bestEffortLimit] Limit the number of results for query.
     * @param {string} [paginationKey] Key to retrieve next page.
     */
    constructor(
        bestEffortLimit?: number,
        paginationKey?: string
    ) {
        this.bestEffortLimit = bestEffortLimit;
        this.paginationKey = paginationKey;
    }
    /**
     * This method is for internal use only.
     * @param {ListQueryOptions} options
     * @return String as query parameter.
     */
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

/**
 * Represents the request for creating/updating a command trigger.
 * @prop {string} schema Name of schema.
 * @prop {number} schemaVersion Version number of schema.
 * @prop {Object[]} actions Array of actions of the command.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 * @prop {TypedID} issuerID ID of the command issuer.
 */
export class CommandTriggerRequest{
    public schema: string;
    public schemaVersion: number;
    public actions: Array<Object>;
    public predicate: Predicate;
    public issuerID: TypedID;
    public commandTarget: TypedID;

    /**
     * Create a CommandTriggerRequest.
     * @constructor
     * @param {string} schema Name of schema.
     * @param {number} schemaVersion Version number of schema.
     * @param {TypedID} commandTarget target of command to be sent, when condition of predication meets.
     * @param {Object[]} actions Array of actions of the command.
     * @param {Predicate} predicate Predicate of the condition met for the trigger to execute.
     * @param {TypedID} issuerID ID of the command issuer.
     */
    constructor(
        schema: string,
        schemaVersion: number,
        commandTarget: TypedID,
        actions?: Array<Object>,
        predicate?: Predicate,
        issuerID?: TypedID
    ) {
        this.schema = schema;
        this.schemaVersion = schemaVersion;
        this.actions = actions;
        this.predicate = predicate;
        this.issuerID = issuerID;
        this.commandTarget = commandTarget
    }
}

/**
 * Represents the request for creating/updating a server code trigger.
 * @prop {ServerCode} serverCode Details of the server code to execute.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 */
export class ServerCodeTriggerRequest{
    public serverCode: ServerCode;
    public predicate: Predicate;

    /**
     * Create a ServerCodeTriggerRequest.
     * @constructor
     * @param {ServerCode} serverCode Details of the server code to execute.
     * @param {Predicate} predicate Predicate of the condition met for the trigger to execute.
     */
    constructor(
        serverCode: ServerCode,
        predicate: Predicate
    ) {
        this.serverCode = serverCode;
        this.predicate = predicate;
    }
}
