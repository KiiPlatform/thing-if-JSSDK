import {TypeID} from './TypeID';

export class Target {
  private typeID: TypeID;
  private accessToken: string;
  constructor(typeID: TypeID, accessToken: string) {
    this.typeID = typeID;
    this.accessToken = accessToken;
  }
}
