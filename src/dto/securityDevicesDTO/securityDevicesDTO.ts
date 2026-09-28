import { ObjectId } from "mongodb";

export type DeviceViewModel = {
  ip: string; //IP address of device during signing in
  title: string; //Device name: for example Chrome 105 (received by parsing http header "user-agent")
  lastActiveDate: string; //Date of the last generating of refresh/access tokens
  deviceId: string; //Id of connected device session
};

//In DB the full type will be <WithId<SessionDeviceDBType>>
export type SessionDeviceDBType = {
  userId: ObjectId;
  lastActiveDate: Date;
  refreshTokenExpirationDate: Date;
  ip: string;
  title: string;
};

export type ApiCalls = {
  ip: string;
  url: string;
  date: Date;
};
