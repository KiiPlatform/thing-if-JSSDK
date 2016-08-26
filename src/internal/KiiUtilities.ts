export function isString(mayStr: any): boolean {
    return (getType(mayStr) == "[object String]");
}

export function isNumber(mayNum: any): boolean {
    return (getType(mayNum) == "[object Number]");
}

export function  isBoolean(mayBool:any): boolean {
    return (getType(mayBool) == "[object Boolean]");
}

export function isObject(mayObject: any): boolean {
    return (getType(mayObject) == "[object Object]");
}
export function isArray(mayObject: any): boolean {
    return (getType(mayObject) == "[object Array]");
}

export function isValueOfObject(value: any, obj: Object){
    for(var key in obj){
        var objValue = (<any>obj)[key]
        if(objValue == value){
            return true
        }
    }
    return false;
}
function getType(obj:any): string {
    return Object.prototype.toString.call(obj);
}
