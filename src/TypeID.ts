
export enum Types {
    GROUP,
    USER,
    THING
}

export  class TypeID {
    private type: Types;
    private id: string;

    constructor(type: Types, id: string){
        this.type = type;
        this.id = id;
    }

    toString(): string{
        let typeString: string;
        switch (this.type) {
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
        return `${typeString}:${this.id}`;
    }
}
