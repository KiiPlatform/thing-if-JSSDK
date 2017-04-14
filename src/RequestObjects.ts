
import {Predicate} from './Predicate'
import {ServerCode} from './ServerCode'
import {TypedID} from './TypedID'
import {LayoutPosition} from './LayoutPosition'
import { AliasAction } from './AliasAction';
import { QueryClause } from './QueryClause';
import { TimeRange } from './TimeRange';
import { Aggregation } from './Aggregation';

/**
 * Represents the request for onboarding with vendorThingID with owner.
 * @prop {string} vendorThingID ID of the thing given by the thing vendor.
 * @prop {string} thingPassword Password of the thing.
 * @prop {string} owner ID of the owner. UserID or GroupID.
 * @prop {string} thingType Type of the thing. This is optional and ignored if Thing is already registered.
 * @prop {Object} thingProperties Thing properties includes predefined and custom properties.
 * @prop {string} firmwareVersion Firmware version of thing.
 * @prop {string} layoutPosition Layout position of thing.
 */
export class OnboardWithVendorThingIDRequest {
    public owner?: string;
    /**
     * Create a OnboardWithVendorThingIDRequest.
     * @constructor
     * @param {string} vendorThingID ID of the thing given by the thing vendor.
     * @param {string} thingPassword Password of the thing.
     * @param {TypedID} [ownerID] ID of the owner. UserID or GroupID.
     * @param {string} [thingType] Type of the thing. This is optional and ignored if Thing is already registered.
     * @param {string} [firmwareVersion] Firmware version of thing.
     * @param {Object} [thingProperties] Thing properties includes predefined and custom properties.
     * @param {string} [layoutPosition] Layout position of thing. Only the values of [LayoutPosition]{@link LayoutPosition} should be used.
     */
    constructor(
        public vendorThingID: string,
        public thingPassword: string,
        ownerID?: TypedID,
        public thingType?: string,
        public firmwareVersion?:string,
        public thingProperties?: Object,
        public layoutPosition?: string
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
 * @prop {string} layoutPosition Layout position of thing.
 */
export class OnboardWithThingIDRequest {
    public owner?: string;
    /**
     * Create a OnboardWithThingIDRequest.
     * @constructor
     * @param {string} thingID ID of the thing given by IoT Cloud.
     * @param {string} thingPassword Password of the thing.
     * @param {TypedID} [ownerID] ID of the owner. UserID or GroupID.
     * @param {string} [layoutPosition] Layout position of thing. Only the values of [LayoutPosition]{@link LayoutPosition} should be used.
     */
    constructor(
        public thingID: string,
        public thingPassword: string,
        ownerID?: TypedID,
        public layoutPosition?: string) {
            this.thingID = thingID;
            this.thingPassword = thingPassword;
            if (!!ownerID) {
                this.owner = ownerID.toString();
            }
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
 * @prop {AliasAction[]} aliasActions Array of actions of the command.
 * @prop {string} issuer ID of the command issuer.
 * @prop {string} title Title of the command.
 * @prop {string} description Description of the command.
 * @prop {Object} metadata Key-value list to store within command definition.
 */
export class PostCommandRequest {
    public issuer?: string;
    /**
     * Create a PostCommandRequest.
     * @constructor
     * @param {AliasAction[]} aliasActions Array of actions of the command.
     * @param {TypedID} [issuerID] ID of the command issuer.
     * @param {string} [title] Title of the command.
     * @param {string} [description] Description of the command.
     * @param {Object} [metadata] Key-value list to store within command definition.
     */
    constructor(
        public aliasActions: Array<AliasAction>,
        issuerID?: TypedID,
        public title?: string,
        public description?: string,
        public metadata?: Object) {
            if(!!issuerID && !!issuerID.id && !!issuerID.type){
                this.issuer = issuerID.toString();
            }
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
 * Represents the fields to construct command for creating/updating command trigger.
 * @prop {AliasAction[]} aliasActions Array of actions of the command.
 * @prop {TypedID} issuerID instance of TypedID to represent issuer of command.
 * @prop {TypedID} targetID instance of TypedID to represent target of command.
 * @prop {string} title Title of the command.
 * @prop {string} description Description of the command.
 * @prop {Object} metadata Key-value list to store within command definition.
 */
export class TriggerCommandObject {
    public aliasActions: Array<AliasAction>;
    public issuerID: TypedID;
    public targetID: TypedID;
    public title: string;
    public description: string;
    public metadata: Object;

    /**
     * Create a PostCommandRequest.
     * @constructor
     * @param {AliasAction[]} aliasActions Array of actions of the command.
     * @param {TypedID} [targetID] instance of TypedID to represent target of command.
     * @param {TypedID} [issuerID] instance of TypedID to represent issuer of command.
     * @param {string} [title] Title of the command.
     * @param {string} [description] Description of the command.
     * @param {Object} [metadata] Key-value list to store within command definition.
     */
    constructor(
        aliasActions: Array<AliasAction>,
        targetID?: TypedID,
        issuerID?: TypedID,
        title?: string,
        description?: string,
        metadata?: Object) {
            this.aliasActions = aliasActions;
            this.targetID = targetID;
            this.issuerID = issuerID;
            this.title = title;
            this.description = description;
            this.metadata = metadata;
        }
}
/**
 * Represents the request for creating a command trigger.
 * @prop {TriggerCommandObject} command instance of TriggerCommandObject.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 * @prop {string} title Title of the trigger.
 * @prop {string} description Description of the trigger.
 * @prop {Object} metadata Key-value list to store within trigger definition.
 */
export class PostCommandTriggerRequest{
    public command: TriggerCommandObject;
    public predicate: Predicate;
    public title: string;
    public description: string;
    public metadata: Object;
    /**
     * Create a PostCommandTriggerRequest.
     * @constructor
     * @param {PostCommandRequest} command the necessary fields to construct command.
     * @param {Predicate} predicate Predicate of the condition met for the trigger to execute.
     * @param {string} [title] Title of the trigger.
     * @param {string} [description] Description of the trigger.
     * @param {Object} [metadata] Key-value list to store within trigger definition.
     */
    constructor(
        command: TriggerCommandObject,
        predicate: Predicate,
        title?: string,
        description?: string,
        metadata?: Object
    ) {
        this.command = command;
        this.predicate = predicate;
        this.title = title;
        this.description = description;
        this.metadata = metadata;
    }
}

/**
 * Represents the request for updating a command trigger.
 * @prop {TriggerCommandObject} command instance of TriggerCommandObject.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 * @prop {string} title Title of the trigger.
 * @prop {string} description Description of the trigger.
 * @prop {Object} metadata Key-value list to store within trigger definition.
 */
export class PatchCommandTriggerRequest{
    public command: TriggerCommandObject;
    public predicate: Predicate;
    public title: string;
    public description: string;
    public metadata: Object;
    /**
     * Create a PostCommandTriggerRequest.
     * @constructor
     * @param {TriggerCommandObject} [command] the necessary fields to construct command.
     * @param {Predicate} [predicate] Predicate of the condition met for the trigger to execute.
     * @param {string} [title] Title of the trigger.
     * @param {string} [description] Description of the trigger.
     * @param {Object} [metadata] Key-value list to store within trigger definition.
     */
    constructor(
        command?: TriggerCommandObject,
        predicate?: Predicate,
        title?: string,
        description?: string,
        metadata?: Object
    ) {
        this.command = command;
        this.predicate = predicate;
        this.title = title;
        this.description = description;
        this.metadata = metadata;
    }
}

/**
 * Represents the request for creating a server code trigger.
 * @prop {ServerCode} serverCode Details of the server code to execute.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 * @prop {string} title Title of the trigger.
 * @prop {string} description Description of the trigger.
 * @prop {Object} metadata Key-value list to store within trigger definition.
 */
export class PostServerCodeTriggerRequest{
    public serverCode: ServerCode;
    public predicate: Predicate;
    public title: string;
    public description: string;
    public metadata: Object;
    /**
     * Create a ServerCodeTriggerRequest.
     * @constructor
     * @param {ServerCode} serverCode Details of the server code to execute.
     * @param {Predicate} predicate Predicate of the condition met for the trigger to execute.
     * @param {string} [title] Title of the trigger.
     * @param {string} [description] Description of the trigger.
     * @param {Object} [metadata] Key-value list to store within trigger definition.
     */
    constructor(
        serverCode: ServerCode,
        predicate: Predicate,
        title?: string,
        description?: string,
        metadata?: Object
    ) {
        this.serverCode = serverCode;
        this.predicate = predicate;
        this.title = title;
        this.description = description;
        this.metadata = metadata;
    }
}

/**
 * Represents the request for updating a server code trigger.
 * @prop {ServerCode} serverCode Details of the server code to execute.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 * @prop {string} title Title of the trigger.
 * @prop {string} description Description of the trigger.
 * @prop {Object} metadata Key-value list to store within trigger definition.
 */
export class PatchServerCodeTriggerRequest{
    public serverCode: ServerCode;
    public predicate: Predicate;
    public title: string;
    public description: string;
    public metadata: Object;
    /**
     * Create a ServerCodeTriggerRequest.
     * @constructor
     * @param {ServerCode} [serverCode] Details of the server code to execute.
     * @param {Predicate} [predicate] Predicate of the condition met for the trigger to execute.
     * @param {string} [title] Title of the trigger.
     * @param {string} [description] Description of the trigger.
     * @param {Object} [metadata] Key-value list to store within trigger definition.
     */
    constructor(
        serverCode?: ServerCode,
        predicate?: Predicate,
        title?: string,
        description?: string,
        metadata?: Object
    ) {
        this.serverCode = serverCode;
        this.predicate = predicate;
        this.title = title;
        this.description = description;
        this.metadata = metadata;
    }
}

/** Represents the request for querying history state of thing
 * @prop {string} alias Name of trait alias of states.
 * @prop {QueryClause} clause Clause to query history states.
 * @prop {string} firmwareVersion Firmware version of thingType of current thing to query.
 * @prop {number} bestEffortLimit Limit the number of results for query.
 * @prop {string} paginationKey Key to retrieve next page.
*/
export class QueryHistoryStatesRequest{

    /** Initialize QueryHistoryStatesRequest
     * @param {string} alias Name of alias of states.
     * @param {QueryClause} clause Clause to query history states.
     * @param {string} [firmwareVersion] Firmware version of thingType of current thing to query.
     * @param {number} [bestEffortLimit] Limit the number of results for query.
     * @param {string} [paginationKey] Key to retrieve next page.
     */
    constructor(
        public alias: string,
        public clause: QueryClause,
        public firmwareVersion?: string,
        public bestEffortLimit? : number,
        public paginationKey? : string
    ){}
}

/** Represents the request for querying grouped history state of thing based on data grouping intervals.
 * @prop {string} alias Name of trait alias of states.
 * @prop {TimeRange} range Time range of query results.
 * @prop {QueryClause} clause Clause to query history states.
 * @prop {string} firmwareVersion Firmware version of thingType of current thing to query.
*/
export class QueryGroupedHistoryStatesRequest{

    /** Initialize QueryHistoryStatesRequest
     * @param {string} alias Name of alias of states.
     * @param {TimeRange} range Time range of query results.
     * @param {QueryClause} [clause] Clause to query history states.
     * @param {string} [firmwareVersion] Firmware version of thingType of current thing to query.
     */
    constructor(
        public alias: string,
        public range: TimeRange,
        public clause?: QueryClause,
        public firmwareVersion?: string,
    ){}
}

/** Represents the request for aggregating history state of thing.
 * @prop {QueryGroupedHistoryStatesRequest} groupedQuery grouped query request.
 * @prop {Aggregation} aggregation aggregation of query.
*/
export class AggregateGroupedHistoryStatesRequest{

    /** Initialize AggregateGroupedHistoryStatesRequest
     * @param {QueryGroupedHistoryStatesRequest} groupedQuery grouped query request.
     * @param {Aggregation} aggregation aggregation of query.
     */
    constructor(
        public groupedQuery: QueryGroupedHistoryStatesRequest,
        public aggregation: Aggregation
    ){}
}

