import { model, Schema } from "mongoose";
import { SecurityDeviceDBType } from "../../../dto/securityDevicesDTO/securityDevicesDTO";

const sessionSchema = new Schema<SecurityDeviceDBType>(
  {
    ip: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    refreshTokenExpirationDate: { type: Date, required: true },
  },
  {
    versionKey: false,
  },
);

// ⚡ 1. TTL Index for self-cleaning expired sessions
sessionSchema.index(
  { refreshTokenExpirationDate: 1 },
  { expireAfterSeconds: 0 },
);
// Security Devices Indexes
sessionSchema.index(
  { userId: 1, refreshTokenExpirationDate: -1 },
  { name: "user_active_sessions_lookup" },
);

export const SecurityDeviceModel = model(
  "SecurityDevice",
  sessionSchema,
  "securityDevices",
);
