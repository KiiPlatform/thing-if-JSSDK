/** MqttInstallationResult represents result after installing Mqtt push notification to Kii Cloud succeeded. */
export default class MqttInstallationResult {
    constructor(
        public installationID: string,
        public installationRegistrationID: string
    ){};
}