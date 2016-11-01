import {TraitAlias} from './TraitAlias'
import {ActionDefinition} from './Trait'

/** Represent Action
 * @prop {ActionDefinition} action Definition instance of ActionDefinition
 * @prop {Number | boolean} value Value of the action
*/
export class Action {
    /** Initialize Action
     * @param {ActionDefinition} action Definition instance of ActionDefinition
     * @param {Number | boolean} value Value of the action
    */
    constructor(
        public actionDefinition: ActionDefinition,
        public value: Number | boolean
    ){}
}
/** Represent Actions group with trait alias
 * @prop {TraitAlias} alias Instance of TraitAlias
 * @prop {Action[]} actions Array of Action instance
*/
export class AliasActions {
    constructor(
        public alias: TraitAlias,
        public actions: Array<Action>
    ){}
}