import { WithId } from "mongodb";
import { securityDevicesCollection } from "../../db";
import { DeviceViewModel } from "../../dto/securityDevicesDTO/securityDevicesDTO";

export const securityDevicesQueryRepository = {
  async getActiveSessions(): Promise<WithId<DeviceViewModel>[] | undefined> {
    const allActiveSessions = await securityDevicesCollection.find().toArray();
    console.log("allActiveSessions: ", allActiveSessions);
    return allActiveSessions;
  },
};
