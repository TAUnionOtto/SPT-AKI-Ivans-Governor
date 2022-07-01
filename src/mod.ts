import { DependencyContainer } from "tsyringe";

import { IMod } from "@spt-aki/models/external/mod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

// 特殊装备
// 尝试改变其背景色到橙色或暗红色，以表示其稀有度
const armorId = '5648a7494bdc2d9d488b4583';
const chestRigId = '5648a69d4bdc2ded0b8b457b';
const helmetId = '5b40e1525acfc4771e1c6611';
const earCoversId = '5c1793902e221602b21d3de2';
const backpackId = '60a2828e8689911a226117f9';
const gloveComponentId = '60a2828e8689911a226117f9'; // 需要一个可以打标签的箱子，当做背包的扩展，替代挎包

class Mod implements IMod {
  public load = () => { return; };

  public delayedLoad = (container: DependencyContainer): void => {
    this.unlockAllRSTItems(container);
    // 大幅降低背包和杂物箱的掉率
    // 大幅降低机器人装备特殊装备的概率
    // 大幅提高特殊装备的价格，同时不得在跳蚤市场出售

    // get globals settings and set flea market min level to be 1
    // tables.globals.config.RagFair.minUserLevel = 1;
}

private unlockAllRSTItems = (container: DependencyContainer): void => {
    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    for (const itemId in items) {
        if (!Object.prototype.hasOwnProperty.call(items, itemId)) {
            continue;
        }
        const currentItem = items[itemId];
        currentItem._props.CanSellOnRagfair = true;
        currentItem._props.CanRequireOnRagfair = true;
    }
}
}

module.exports = { mod: new Mod() }
