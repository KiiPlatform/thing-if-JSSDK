/**
 * Represents action results with specified alias.
 * @prop {string} alias alias.
 * @prop {ActionResult[]} actionResults array of ActionResult.
 */
export class AliasActionResult {
    constructor(
        public alias: string,
        public actionResults: Array<ActionResult>) {}
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