import { DependencyContainer } from 'tsyringe';

import type { IMod } from '@spt-aki/models/external/mod';
import type { ILogger } from '@spt-aki/models/spt/utils/ILogger';

const packageConfig = require('../package.json');

export default abstract class BaseMod implements IMod {
  static IS_DEBUG_MODE = false;
  static PACKAGE_CONFIG = packageConfig;

  protected logger: ILogger;

  public load(container: DependencyContainer): void {
    this.logger = container.resolve<ILogger>('WinstonLogger');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delayedLoad(container: DependencyContainer): void {
    // do nothing
  }

  logInfo(message: string) {
    this.logger.log(`[${packageConfig.name}-${packageConfig.version}-${this.constructor.name}] ${message}`, 'bgGray');
  }

  debugInfo(message: string) {
    if (!BaseMod.IS_DEBUG_MODE) {
      return;
    }
    this.logger.log(`[DEBUG][${packageConfig.name}-${packageConfig.version}-${this.constructor.name}] ${message}`, 'bgGray');
  }

  debugRecord(record: Record<string, unknown>) {
    if (!BaseMod.IS_DEBUG_MODE) {
      return;
    }
    this.logger.log({
      _subMod: this.constructor.name,
      ...record,
    }, 'bgGray');
  }
}
