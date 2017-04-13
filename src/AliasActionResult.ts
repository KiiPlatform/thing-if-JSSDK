/**
 * Represents action results with specified alias.
 * @prop {string} alias alias.
 * @prop {ActionResult[]} actionResults array of ActionResult.
 */
export class AliasActionResult {
    constructor(
        public alias: string,
        public actionResults: Array<ActionResult>) {}

    /**
     * Retrieves action results with specified action name.
     * @param {string} actionName Action name.
     * @return {Array<ActionResult>} Found array of ActionResult object, if there is not 
     * ActionResult object with the specifed action name, returns empty arrray.
     */
    getActionResults(actionName: string): Array<ActionResult> {
        let foundResults: Array<ActionResult> = [];
        for(let result of this.actionResults) {
            if(result.actionName === actionName) {
                foundResults.push(result);
            }
        }
        return foundResults;
    }
}

/**
 * Represents result of a single action.
 * @prop {string} actionName name of action.
 * @prop {boolean} succeeded true if the action executed succeeded, otherwise false.
 * @prop {Object} [data] additional data for the action result.
 * @prop {string} [errorMessage] error message in case action executed failed. 
 */
export class ActionResult {
    constructor(
        public actionName: string,
        public succeeded: boolean,
        public data?: Object,
        public errorMessage?: string) {}
}