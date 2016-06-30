
/** OnboardWithVendorThingIDRequest contains necessary fields to request onboarding 
 * with vendorThingID with owner
 */
export class OnboardWithVendorThingIDRequest {

    constructor(public vendorThingID: string, 
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

    constructor(public thingID: string, 
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

    constructor(public gatewayThingID: string, 
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