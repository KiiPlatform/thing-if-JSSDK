enum Types {
  USER,
  GROUP,
  THING,
  UNKNOWN
}

namespace Types {
  export function getValue(type: Types): string{
    switch (type) {
      case Types.USER:
        return "user";
      case Types.GROUP:
        return "group";
      case Types.THING:
        return "thing";
      default:
        //TODO: may need to throw error
        return "unknown";
    }
  }

  export function fromString(s: string): Types {
    if (s == "user"){
      return Types.USER;
    }else if(s == "group") {
      return Types.GROUP;
    }else if(s == "thing") {
      return Types.THING;
    }else{
      return Types.UNKNOWN;
    }
  }
}

class TypeID {
  private type: Types;
  private ID: string;
  private qualifiedID: string;

  constructor(type: Types, ID: string) {
    this.type = type;
    this.ID = ID;
    this.qualifiedID = Types.getValue(type) + ":" + ID;
  }
}

export {Types}
export {TypeID}
