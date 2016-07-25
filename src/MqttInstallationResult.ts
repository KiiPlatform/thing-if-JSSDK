/** MqttInstallationResult represents result after installing Mqtt push notification to Kii Cloud succeeded. */
export default class MqttInstallationResult {
    public installationID: string;
    public installationRegistrationID: string;

    constructor(
        installationID: string,
        installationRegistrationID: string
    ) {
        this.installationID = installationID;
        this.installationRegistrationID = installationRegistrationID;
    };
}