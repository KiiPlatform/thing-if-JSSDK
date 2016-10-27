import {StateDefiniation} from './Trait'

export class State {
    constructor(
        public definition: StateDefiniation,
        public state: Object
    ){}
}