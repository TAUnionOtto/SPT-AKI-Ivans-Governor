import { DependencyContainer } from 'tsyringe';

import BaseMod from './BaseSubMod';

/**
 * 自定义黑市商人，按照跳蚤市场的价格快速出售你的商品，但是会收取高昂的手续费。
 * 每次成功逃离战场/积攒足够多经验/使用狗牌 可以交换一次出售商品的机会，每次出售只能出售通类型的商品，数量不限。
 *
 */
export default class BlackMarketTrader extends BaseMod {
  customLoad(container: DependencyContainer): void {
    // TODO
  }

  customDelayedLoad(container: DependencyContainer): void {
    // TODO
  }
}
