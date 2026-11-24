import { ContainerModule } from "inversify";
import { SecurityDevicesController } from "../controllers/securityDevicesController";
import { SecurityDevicesService } from "../service/securityDevicesService";
import { SecurityDevicesQueryRepository } from "../repositories/query-repository/securityDevicesQueryRepository";
import { SecurityDevicesCommandsRepository } from "../repositories/commands-repository/securityDevicesCommandsRepository";
import { TYPES } from "../constants/tokens";
import { SecurityDeviceModel } from "../db/mongoose/models/sessions.model";

export const SecurityDevicesModule = new ContainerModule((options) => {
  options
    .bind<SecurityDevicesController>(SecurityDevicesController)
    .toSelf()
    .inSingletonScope();
  options
    .bind<SecurityDevicesService>(SecurityDevicesService)
    .toSelf()
    .inSingletonScope();
  options
    .bind<SecurityDevicesQueryRepository>(SecurityDevicesQueryRepository)
    .toSelf()
    .inSingletonScope();
  options
    .bind<SecurityDevicesCommandsRepository>(SecurityDevicesCommandsRepository)
    .toSelf()
    .inSingletonScope();
  options.bind(TYPES.SecurityDeviceModel).toConstantValue(SecurityDeviceModel);
});
