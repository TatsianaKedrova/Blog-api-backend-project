import { ObjectId } from "mongodb";

export class SecurityDeviceDBType {
  public ip: string;
  public userId: ObjectId;
  public title: string;
  public lastActiveDate: Date;
  public refreshTokenExpirationDate: Date;
  constructor(data: {
    ip: string;
    userId: ObjectId;
    title: string;
    lastActiveDate: Date;
    refreshTokenExpirationDate: Date;
  }) {
    this.ip = data.ip;
    this.userId = data.userId;
    this.title = data.title;
    this.lastActiveDate = data.lastActiveDate;
    this.refreshTokenExpirationDate = data.refreshTokenExpirationDate;
  }
}

export type DeviceViewModel = {
  ip: string; //IP address of device during signing in
  title: string; //Device name: for example Chrome 105 (received by parsing http header "user-agent")
  lastActiveDate: string; //Date of the last generating of refresh/access tokens
  deviceId: string; //Id of connected device session
};
