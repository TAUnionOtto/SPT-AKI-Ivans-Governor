import { DependencyContainer } from "tsyringe";

import type { IMod } from "@spt-aki/models/external/mod";
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type { ConfigServer } from "@spt-aki/servers/ConfigServer";
import type { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import type { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import type { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";

import * as Enums from './enums';

// 特殊装备
// 尝试改变其背景色到橙色或暗红色，以表示其稀有度
const armorId = '5648a7494bdc2d9d488b4583';
const chestRigId = '5648a69d4bdc2ded0b8b457b';
const helmetId = '5b40e1525acfc4771e1c6611';
const earCoversId = '5c1793902e221602b21d3de2';
const backpackId = '60a2828e8689911a226117f9';
const gloveComponentId = '60a2828e8689911a226117f9'; // 需要一个可以打标签的箱子，当做背包的扩展，替代挎包

class Mod implements IMod {
  public load (container: DependencyContainer): void { 
    this.increaseRagFairSellingPrice(container);
  };

  public delayedLoad (container: DependencyContainer): void {
    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const dataBaseTables = databaseServer.getTables();

    this.unlockAllRSTItems(dataBaseTables);
    // 大幅降低背包和杂物箱的掉率
    // 大幅降低机器人装备特殊装备的概率
    // 大幅提高特殊装备的价格，同时不得在跳蚤市场出售

    dataBaseTables.globals.config.RagFair.minUserLevel = 1;
  }

  /**
   * 解锁 BSG 黑名单
   * @param dataBaseTables 
   */
  private unlockAllRSTItems (dataBaseTables: IDatabaseTables): void {
    const items = dataBaseTables.templates.items;
    for (const itemId in items) {
        if (!Object.prototype.hasOwnProperty.call(items, itemId)) {
            continue;
        }
        const currentItem = items[itemId];
        currentItem._props.CanSellOnRagfair = true;
        currentItem._props.CanRequireOnRagfair = true;
    }
  }

  /**
   * 提高跳蚤市场物品售价
   * @param container 
   */
  private increaseRagFairSellingPrice (container: DependencyContainer) {
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const regFairConfig = configServer.getConfig<IRagfairConfig>(Enums.ConfigTypes.RAGFAIR as unknown as ConfigTypes);
    regFairConfig.dynamic.price.max = 4.5;
    regFairConfig.dynamic.price.min = 2.25;
  }
}

module.exports = { mod: new Mod() }
