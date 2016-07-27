/**
 * MqttInstallationResult represents result after installing Mqtt push notification to Kii Cloud succeeded.
 * @prop {string} installationID ID used in IoT Cloud.
 * @prop {string} installationRegistrationID ID of registration that identifies the installation externally.
 */
export class MqttInstallationResult {
    public installationID: string;
    public installationRegistrationID: string;

    /**
     * Create a MqttInstallationResult.
     * @constructor
     * @param {string} installationID ID used in IoT Cloud.
     * @param {string} installationRegistrationID ID of registration that identifies the installation externally.
     */
    constructor(
        installationID: string,
        installationRegistrationID: string
    ) {
        this.installationID = installationID;
        this.installationRegistrationID = installationRegistrationID;
    };
}