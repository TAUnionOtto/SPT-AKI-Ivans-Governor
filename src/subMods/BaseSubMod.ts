import { DependencyContainer } from 'tsyringe';

import type { ILogger } from '@spt-aki/models/spt/utils/ILogger';

import type { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import type { ConfigServer } from '@spt-aki/servers/ConfigServer';

import BaseMod from '../BaseMod';

export default abstract class BaseSubMod extends BaseMod {
  databaseServer: DatabaseServer;
  configServer: ConfigServer;

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>('WinstonLogger');
    this.databaseServer = container.resolve<DatabaseServer>('DatabaseServer');
    this.configServer = container.resolve<ConfigServer>('ConfigServer');
    this.logInfo('Loading...');
    this.customLoad(container);
  }

  abstract customLoad(container: DependencyContainer): void

  public delayedLoad(container: DependencyContainer): void {
    this.logInfo('Delayed Loading...');
    this.customDelayedLoad(container);
    this.logInfo('Loaded');
  }

  abstract customDelayedLoad(container: DependencyContainer): void
}
