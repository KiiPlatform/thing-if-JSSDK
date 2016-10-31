import {Trait} from './Trait'

/** Represent Trait Alias
 * @prop {string} alias Name of trait alias
 * @prop {string} thingType Thing type
 * @prop {string} firmwareVersion Firmware version
 * @prop {Trait} trait Instance of Trait
*/
export class TraitAlias {
    /** Initialize TraitAlias
     * @param {string} alias Name of trait alias
     * @param {string} thingType Thing type
     * @param {string} firmwareVersion Firmware version
     * @param {Trait} trait Instance of Trait
     */
    constructor(
        public alias: string,
        public thingType: string,
        public firmwareVersion: string,
        public trait: Trait
    ){}
}