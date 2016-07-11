/** OnboardingResult represents result after onboarding succeeded. */
export class OnboardingResult{
    constructor(
        public thingID: string,
        public accessToken: string,
        public mqttEndPoint: MqttEndpoint
    ){}
}

/** MqttEndpoint represents a MQTT endpoint */
export class MqttEndpoint {
    constructor(
        public installationID: string,
        public host: string,
        public mqttTopic: string,
        public userName: string,
        public password: string,
        public portSSL: number,
        public portTCP: number
    ){}
}