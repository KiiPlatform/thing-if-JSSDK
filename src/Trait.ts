/** Definition of Action.
 * @prop {string} name Name of action
 * @prop {string} description Description of action
 * @prop {Object} payloadSchema Schema for the action
 * @prop {boolean} removed If true, then the action is removed. Otherwise false
 */
export class ActionDefinition {
    /** Initialize ActionDefinition
     * @param {string} name Name of action
     * @param {string} description Description of action
     * @param {Object} payloadSchema Schema for the action
     * @param {boolean} removed If true, then the action is removed. Otherwise false
     */
    constructor(
        public name: string,
        public description: string,
        public payloadSchema: Object,
        public removed: boolean
    ){}
}

/** Definition of State.
 * @prop {string} name Name of state
 * @prop {string} description Description of state
 * @prop {Object} payloadSchema Schema for the state
 */
export class StateDefinition {
    /** Initialize StateDefinition
     * @param {string} name Name of state
     * @param {string} description Description of state
     * @param {Object} payloadSchema Schema for the state
    */
    constructor(
        public name: string,
        public description: string,
        public payloadSchema: Object
    ){}
}

/** Represent Trait
 * @prop {string} name Name of Trait
 * @prop {string} version Version of trait
 * @prop {boolean} finalized True, if the trait is finalized by developer. Otherwise, false
 * @prop {boolean} published True, if the trait is published by developer. Otherwise, false
 * @prop {ActionDefinition[]} actions Array of ActionDefinition instance
 * @prop {StateDefinition[]} states Array of StateDefinition instance
 * @prop {string} dataGroupingInterval Internal used to group state history of thing.
 *   Only the values of [DataGroupingInterval]{@link DataGroupingInterval} should be used.
 * @prop {string} uri Uri of trait.
*/
export class Trait {
    constructor(
        public name: string,
        public version: string,
        public finalized: boolean,
        public published: boolean,
        public actions: Array<ActionDefinition>,
        public states: Array<StateDefinition>,
        public dataGroupingInterval?: string,
        public uri?: string
    ){}
}