import {Clause} from './Clause';

export class Condition {
    public clause: Clause;

    constructor(clause: Clause) {
        this.clause = clause;
    }
    static fromJson(obj:any): Condition {
        return new Condition(Clause.fromJson(obj));
    }
}