/** MqttInstallationResult represents result after installing Mqtt push notification to Kii Cloud succeeded. */
export default class MqttInstallationResult {
    /**
     * ID used in IoT Cloud.
     * @type {string}
     */
    public installationID: string;
    /**
     * ID of registration that identifies the installation externally.
     * @type {string}
     */
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