export class ActionDefinition {
    constructor(
        public name: string,
        public description: string,
        public payloadSchema: Object,
        public removed: boolean
    ){}
}

export class StateDefinition {
    constructor(
        public name: string,
        public description: string,
        public payloadSchema: Object
    ){}
}

/** Represent Trait */
export class Trait {
    constructor(
        public name: string,
        public version: string,
        public finalized: boolean,
        public publicized: boolean,
        public actions: Array<ActionDefinition>,
        public states: Array<StateDefinition>,
        public dataGroupingInterval?: string,
        public uri?: string
    ){}
}