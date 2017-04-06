
/**
 * Represents actions with specified alias
 * @prop {string} alias alias.
 * @prop {Action[]} actions array of action object.
 */
export class AliasAction {
    constructor(
        public alias: string,
        public actions: Array<Action>) {}
}

/**
 * Represent a single action
 * @prop {string} name action name.
 * @prop {any} value value of action.
 */
export class Action {
    constructor(
        public name: string,
        public value: any) {}
}