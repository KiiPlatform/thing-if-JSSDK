/** OnboardingResult represents result after onboarding succeeded. */
export class OnboardingResult{
    public thingID: string;
    public accessToken: string;
    public mqttEndPoint: MqttEndpoint;

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
    public installationID: string;
    public host: string;
    public mqttTopic: string;
    public userName: string;
    public password: string;
    public portSSL: number;
    public portTCP: number;

    constructor(
        installationID: string,
        host: string,
        mqttTopic: string,
        userName: string,
        password: string,
        portSSL: number,
        portTCP: number
    ) {
        this.installationID = installationID;
        this.host = host;
        this.mqttTopic = mqttTopic;
        this.userName = userName;
        this.password = password;
        this.portSSL = portSSL;
        this.portTCP = portTCP;
    }
}