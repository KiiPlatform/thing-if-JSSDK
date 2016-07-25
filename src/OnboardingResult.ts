/** OnboardingResult represents result after onboarding succeeded. */
export class OnboardingResult {
    /**
     * D of the thing given by IoT Cloud.
     * @type {string}
     */
    public thingID: string;
    /**
     * Access token of the thing.
     * @type {string}
     */
    public accessToken: string;
    /**
     * MQTT installation details.
     * @type {MqttEndpoint}
     */
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

/** MqttEndpoint represents a MQTT endpoint */
export class MqttEndpoint {
    /**
     * The ID of the installation.
     * @type {string}
     */
    public installationID: string;
    /**
     * The hostname of the MQTT broker host to connect.
     * @type {string}
     */
    public host: string;
    /**
     * The topic to subscribe in the MQTT broker.
     * @type {string}
     */
    public mqttTopic: string;
    /**
     * The username to use for connecting to the MQTT broker.
     * @type {string}
     */
    public username: string;
    /**
     * The password to use for connecting to the MQTT broker.
     * @type {string}
     */
    public password: string;
    /**
     * The port to connect using SSL/TLS.
     * @type {number}
     */
    public portSSL: number;
    /**
     * The port to connect using plain TCP.
     * @type {number}
     */
    public portTCP: number;
    /**
     * The amount of time in seconds that specifies how long the mqttTopic will be valid, after that the client needs to request new MQTT endpoint info.
     * @type {number}
     */
    public ttl: number;

    /**
     * Create a MqttEndpoint.
     * @constructor
     * @param {string} installationID ID of the installation.
     * @param {string} host The hostname of the MQTT broker host to connect.
     * @param {string} mqttTopic The topic to subscribe in the MQTT broker.
     * @param {string} username The username to use for connecting to the MQTT broker.
     * @param {string} password The password to use for connecting to the MQTT broker.
     * @param {number} portSSL The port to connect using SSL/TLS.
     * @param {number} portTCP The port to connect using plain TCP.
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