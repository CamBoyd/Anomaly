
import {
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  type LangiumCoreServices,
  type LangiumSharedCoreServices,
  type DefaultSharedCoreModuleContext
} from "langium";

import {
  AnomalyGeneratedModule,
  AnomalyGeneratedSharedModule
} from "../generated/module.js";

export type AnomalyServices = LangiumCoreServices;

export function createAnomalyServices(
  context: DefaultSharedCoreModuleContext
): {
  shared: LangiumSharedCoreServices;
  Anomaly: AnomalyServices;
} {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    AnomalyGeneratedSharedModule
  );

  const Anomaly = inject(
    createDefaultCoreModule({ shared }),
    AnomalyGeneratedModule
  );

  shared.ServiceRegistry.register(Anomaly);

  return { shared, Anomaly };
}
