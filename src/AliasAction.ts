
/**
 * Represents actions with specified alias
 * @prop {string} alias alias.
 * @prop {Action[]} actions array of action object.
 */
export class AliasAction {
    constructor(
        public alias: string,
        public actions: Array<Action>) {}

    /**
     * Retrieve action with action name.
     * @param {string} name Action name.
     * @return {Array<Action>} Found array of Action. If there is not action with
     * the name, empty array returned.
     */
    getAction?(name: string): Array<Action> {
        let foundActions: Array<Action> = [];
        for(let action of this.actions) {
            if(action.name === name) {
                foundActions.push(action);
            }
        }
        return foundActions;
    }
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