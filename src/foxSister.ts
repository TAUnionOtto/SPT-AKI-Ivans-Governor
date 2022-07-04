import type { DependencyContainer } from "tsyringe";

import type { IMod } from "@spt-aki/models/external/mod";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

class FoxSister implements IMod {
  private logger: ILogger;
  private databaseServer: DatabaseServer;

  public load(container: DependencyContainer): void {

  }

  public delayedLoad(container: DependencyContainer): void {

  }
}
