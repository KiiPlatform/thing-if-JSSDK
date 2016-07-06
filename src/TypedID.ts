
export enum Types {
    GROUP,
    USER,
    THING
}

/** Represents entity type and its ID. */
export class TypedID {
    private _type: Types;
    private _id: string;

    /**
     * @param {Types} type Type of entity.
     * @param {id} id ID of the specified entity. If it is a kii user, then must be id of the user.
     */
    constructor(type: Types, id: string){
        this._type = type;
        this._id = id;
    }

    /** Get string by contacting type and id.
     * @return {string} A string contacted by type and id of entity.
    */
    toString(): string{
        let typeString: string;
        switch (this._type) {
            case Types.GROUP:
                typeString = "group";
                break;
            case Types.USER:
                typeString = "user";
                break;
            case Types.THING:
                typeString = "thing";
                break;
            default:
                break;
        }
        return `${typeString}:${this._id}`;
    }
}
