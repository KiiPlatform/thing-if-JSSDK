import {Clause} from './Clause';

export class Condition {
    constructor(public clause: Clause) {
    }
    static fromJson(obj:any): Condition {
        return null;
    }
}