import {Trait} from './Trait'

export class TraitAlias {
    constructor(
        public alias: string,
        public thingType: string,
        public firmwareVersion: string,
        public trait: Trait
    ){}
}