import {ActionDefinition} from './Trait'
export class Action {
    constructor(
        public definition: ActionDefinition,
        public actionItems: Array<Object>
    ){}
}