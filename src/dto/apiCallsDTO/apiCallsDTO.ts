import { Types } from "mongoose";

export class ApiCallsDBType {
  public _id: Types.ObjectId;
  public ip: string;
  public url: string;
  public date: Date;
  constructor(_id: Types.ObjectId, ip: string, url: string, date: Date) {
    this._id = _id;
    this.ip = ip;
    this.date = date;
    this.url = url;
  }
}
