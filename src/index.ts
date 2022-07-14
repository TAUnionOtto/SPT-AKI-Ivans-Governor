/* eslint-disable import/no-import-module-exports */
import { DependencyContainer } from 'tsyringe';

import type { ILogger } from '@spt-aki/models/spt/utils/ILogger';

import BaseMod from './BaseMod';
import type BaseSubMod from './subMods/BaseSubMod';
import Governor from './subMods/Governor';
import BlackMarketTrader from './subMods/BlackMarketTrader';

class ModEntry extends BaseMod {
  private subMods: Array<BaseSubMod> = [];

  constructor() {
    super();
    this.subMods.push(new Governor());
    this.subMods.push(new BlackMarketTrader());
  }

  public load(container: DependencyContainer): void {
    try {
      this.logger = container.resolve<ILogger>('WinstonLogger');
      this.logInfo('Loading...');
      this.subMods.forEach((subMod) => {
        subMod.load(container);
      });
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
    }
  }

  public delayedLoad(container: DependencyContainer): void {
    try {
      this.logInfo('Delayed Loading...');
      this.subMods.forEach((subMod) => {
        subMod.delayedLoad(container);
      });
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
    }
    this.logInfo('Loaded');
  }
}

module.exports = { mod: new ModEntry() };
