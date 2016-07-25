/**
 * OnboardingResult represents result after onboarding succeeded.
 * @prop {string} thingID ID of the thing given by IoT Cloud.
 * @prop {string} accessToken Access token of the thing.
 * @prop {MqttEndpoint} mqttEndPoint MQTT installation details.
 */
export class OnboardingResult {
    public thingID: string;
    public accessToken: string;
    public mqttEndPoint: MqttEndpoint;

    /**
     * Create a OnboardingResult.
     * @constructor
     * @param {string} thingID 
     * @param {string} mqttEndPoint 
     * @param {MqttEndpoint} mqttEndPoint 
     */
    constructor(
        thingID: string,
        accessToken: string,
        mqttEndPoint: MqttEndpoint
    ) {
        this.thingID = thingID;
        this.accessToken = accessToken;
        this.mqttEndPoint = mqttEndPoint;
    }
}

/**
 * MqttEndpoint represents a MQTT endpoint
 * @prop {string} installationID ID of the installation.
 * @prop {string} host Hostname of the MQTT broker host to connect.
 * @prop {string} mqttTopic Topic to subscribe in the MQTT broker.
 * @prop {string} username Username to use for connecting to the MQTT broker.
 * @prop {string} password Password to use for connecting to the MQTT broker.
 * @prop {number} portSSL Port to connect using SSL/TLS.
 * @prop {number} portTCP Port to connect using plain TCP.
 * @prop {number} ttl The Amount of time in seconds that specifies how long the mqttTopic will be valid, after that the client needs to request new MQTT endpoint info.
 */
export class MqttEndpoint {
    public installationID: string;
    public host: string;
    public mqttTopic: string;
    public username: string;
    public password: string;
    public portSSL: number;
    public portTCP: number;
    public ttl: number;

    /**
     * Create a MqttEndpoint.
     * @constructor
     * @param {string} installationID ID of the installation.
     * @param {string} host Hostname of the MQTT broker host to connect.
     * @param {string} mqttTopic Topic to subscribe in the MQTT broker.
     * @param {string} username Username to use for connecting to the MQTT broker.
     * @param {string} password Password to use for connecting to the MQTT broker.
     * @param {number} portSSL Port to connect using SSL/TLS.
     * @param {number} portTCP Port to connect using plain TCP.
     * @param {number} ttl The amount of time in seconds that specifies how long the mqttTopic will be valid, after that the client needs to request new MQTT endpoint info.
     */
    constructor(
        installationID: string,
        host: string,
        mqttTopic: string,
        username: string,
        password: string,
        portSSL: number,
        portTCP: number,
        ttl: number
    ) {
        this.installationID = installationID;
        this.host = host;
        this.mqttTopic = mqttTopic;
        this.username = username;
        this.password = password;
        this.portSSL = portSSL;
        this.portTCP = portTCP;
        this.ttl = ttl;
    }
}