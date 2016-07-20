
export enum Types {
    Group,
    User,
    Thing
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

    get type(): Types {
        return this._type;
    }

    get id(): string {
        return this._id;
    }
    /** Get string by contacting type and id.
     * @return {string} A string contacted by type and id of entity.
    */
    toString(): string{
        let typeString: string;
        switch (this._type) {
            case Types.Group:
                typeString = "group";
                break;
            case Types.User:
                typeString = "user";
                break;
            case Types.Thing:
                typeString = "thing";
                break;
            default:
                break;
        }
        return `${typeString}:${this._id}`;
    }

    static fromString(str: string): TypedID{
        var arr = str.split(":");
        if(arr.length < 2){
            return null;
        }
        var t = arr[0].toLowerCase();
        var id = arr[1];
        if(t == "user"){
            return new TypedID(Types.User, id);
        }else if(t == "group"){
            return new TypedID(Types.Group, id);
        }else if(t == "thing"){
            return new TypedID(Types.Thing, id);
        }else{
            return null;
        }
    }
}


