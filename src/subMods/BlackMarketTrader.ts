import { DependencyContainer } from 'tsyringe';

import type { TradeController } from '@spt-aki/controllers/TradeController';
import type { InventoryController } from '@spt-aki/controllers/InventoryController';
import type { DialogueHelper } from '@spt-aki/helpers/DialogueHelper';
import type { ProfileHelper } from '@spt-aki/helpers/ProfileHelper';
import type { RagfairPriceService } from '@spt-aki/services/RagfairPriceService';
import type { ImageRouter } from '@spt-aki/routers/ImageRouter';
import type { ItemEventRouter } from '@spt-aki/routers/ItemEventRouter';
import type { InitialModLoader } from '@spt-aki/loaders/InitialModLoader';
import type { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import type { ITraderConfig } from '@spt-aki/models/spt/config/ITraderConfig';
import type { Config as GlobalConfig } from '@spt-aki/models/eft/common/IGlobals';
import type { Item as IItem, Upd } from '@spt-aki/models/eft/common/tables/IItem';
import type { IItemEventRouterResponse } from '@spt-aki/models/eft/itemEvent/IItemEventRouterResponse';
import type { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';
import type { IPmcData, TraderInfo } from '@spt-aki/models/eft/common/IPmcData';
import type { IProcessBaseTradeRequestData } from '@spt-aki/models/eft/trade/IProcessBaseTradeRequestData';
import type { IProcessSellTradeRequestData } from '@spt-aki/models/eft/trade/IProcessSellTradeRequestData';
import type { HashUtil } from '@spt-aki/utils/HashUtil';

import * as Enums from '../Enums';
import BaseMod from './BaseSubMod';

/**
 * 自定义黑市商人，按照跳蚤市场的价格快速出售你的商品，但是会收取高昂的手续费。
 *
 * 出售狗牌可以增加商人的信任度，狗牌等级越高，增加的信任度越多：lv 1-15 +0.01 | lv 16-30 +0.02 | lv 31-50 +0.03 | lv 51-85 +0.04 | lv >85 +0.05
 * 每次交易会扣除一定的信任度，每次交易固定扣除 0.02，每种商品扣除 0.01，尺寸超过 20 格，每 10 格扣除 0.01。
 * 出售时如果带有狗牌，则降低交易固定信任度消耗到 0.005
 *
 * 参考 @see https://hub.sp-tarkov.com/files/file/621-blackmarket/
 *
 * Thanks @author <https://hub.sp-tarkov.com/user/23259-101p/>
 */
export default class BlackMarketTrader extends BaseMod {
  public static readonly traderId = 'ivan-black-market';
  public readonly sellingTax = 0.45;

  private modLoader: InitialModLoader;
  private itemEventRouter: ItemEventRouter;
  private imageRouter: ImageRouter;
  private ragfairPriceService: RagfairPriceService;
  private inventoryController: InventoryController;
  private dialogueHelper: DialogueHelper;
  private profileHelper: ProfileHelper;
  private hashUtil: HashUtil;

  customLoad(container: DependencyContainer): void {
    this.registerTradeController(container);
  }

  customDelayedLoad(container: DependencyContainer): void {
    this.modLoader = container.resolve<InitialModLoader>('InitialModLoader');
    this.itemEventRouter = container.resolve<ItemEventRouter>('ItemEventRouter');
    this.imageRouter = container.resolve<ImageRouter>('ImageRouter');
    this.ragfairPriceService = container.resolve<RagfairPriceService>('RagfairPriceService');
    this.inventoryController = container.resolve<InventoryController>('InventoryController');
    this.dialogueHelper = container.resolve<DialogueHelper>('DialogueHelper');
    this.profileHelper = container.resolve<ProfileHelper>('ProfileHelper');
    this.hashUtil = container.resolve<HashUtil>('HashUtil');
    const dataBaseTables = this.databaseServer.getTables();
    this.modifyRagfairGlobalConfig(dataBaseTables.globals.config);
    this.blockBuyDogTagsFromRegFair(dataBaseTables.templates.items);
    this.registerTrader();
  }

  private registerTradeController(container: DependencyContainer): void {
    container.afterResolution('TradeController', (_callback, result: TradeController) => {
      const originConfirmTradingAction = result.confirmTrading;
      result.confirmTrading = (...params) => this.onTradeConfirmTrading(params, originConfirmTradingAction);
    });
  }

  private onTradeConfirmTrading(
    params: [
      pmcData: IPmcData,
      body: IProcessBaseTradeRequestData,
      sessionId: string,
      foundInRaid?: boolean,
      upd?: Upd,
    ],
    originAction: TradeController['confirmTrading'],
  ): IItemEventRouterResponse {
    const [pmcData, body, sessionId] = params;
    this.debugInfo('TradeController onTradeConfirmTrading start');
    this.debugRecord({ body, sessionId });
    // 如果不是出售给 Black Market 的，则直接正常返回
    if (body.tid !== BlackMarketTrader.traderId || body.type !== 'sell_to_trader') {
      return originAction(...params);
    }
    // 获取默认的 response
    let confirmResponse = this.itemEventRouter.getOutput(sessionId);
    // 获取可交易的商品清单
    const sellingItems = this.getValidSellingItems(
      pmcData,
      body as unknown as IProcessSellTradeRequestData,
    );
    if (sellingItems.length === 0) {
      return {
        warnings: [{ index: 0, err: '没有可出售的商品', errmsg: '你只能通过快速窗口出售狗牌或者可在跳蚤市场出售的商品' }],
        profileChanges: {},
      };
    }
    this.debugInfo('onTradeConfirmTrading sellingItems builded');
    this.debugRecord({ sellingItems });
    const pmcCurrentTraderInfo = pmcData.TradersInfo[BlackMarketTrader.traderId];
    if (!pmcCurrentTraderInfo) {
      pmcData.TradersInfo[BlackMarketTrader.traderId] = this.getDefaultTraderInfo();
    }
    // 计算、校验信任度
    const currentStanding = pmcData.TradersInfo[BlackMarketTrader.traderId].standing || 0;
    const standingDiffStats = this.getTradeSessionStandingDiff(sellingItems);
    if (currentStanding + standingDiffStats.sum < 0) {
      return {
        warnings: [{ index: 0, err: '信任度不足，无法交易', errmsg: `至少需要 ${Math.abs(standingDiffStats.sum)} 信任度才能完成这次交易` }],
        profileChanges: {},
      };
    }
    // 移除可以被交易的货物
    confirmResponse = this.removeTradedItems(pmcData, sessionId, sellingItems, confirmResponse);
    this.debugInfo('onTradeConfirmTrading this.removeTradedItems done');
    this.debugRecord({ confirmResponse });
    // 增减信任度
    confirmResponse = this.modifyCurrentTraderStanding(confirmResponse, sessionId, currentStanding, standingDiffStats);
    // 计算获得的金钱
    const [responseMoney, sumMoney] = this.getTradeSessionMoneyResponse(sellingItems);
    // 发送金钱和信任度详单到邮箱
    this.sendMessageWithRecords(
      sessionId,
      this.getTradeDialogMessageText(sellingItems, standingDiffStats, responseMoney),
      sumMoney ? [responseMoney] : [],
    );
    return confirmResponse;
  }

  private getValidSellingItems(
    pmcData: IPmcData,
    sellingRequestBody: IProcessSellTradeRequestData,
  ): SellingItem[] {
    const itemTemplates = this.databaseServer.getTables().templates.items;
    const pmcInventoryItemIdMap = this.buildPmcInventoryItemIdMap(pmcData.Inventory.items);
    const sellingItems: SellingItem[] = [];
    sellingRequestBody.items.forEach((requestItem) => {
      const pmcItem = pmcInventoryItemIdMap[requestItem.id];
      if (!pmcItem) { return; }
      const itemTemplate = itemTemplates[pmcItem._tpl];
      if (!itemTemplate) { return; }
      const sellingItem = { ...pmcItem, ...itemTemplate, instanceId: requestItem.id, count: requestItem.count };
      if (!this.isItemDogTag(sellingItem) && !sellingItem._props.CanSellOnRagfair) { return; }
      if (this.isItemDogTag(sellingItem) && sellingItem.upd.Dogtag.Level === 0) { return; }
      sellingItems.push(sellingItem);
    });
    return sellingItems;
  }

  private getDefaultTraderInfo(): TraderInfo {
    return {
      loyaltyLevel: 1,
      standing: 0,
      nextResupply: new Date().getTime() + 60 * 60,
      unlocked: true,
      salesSum: 0,
    };
  }

  private isItemDogTag(item: SellingItem): boolean {
    const dogTagIds = [Enums.DogTag.BEAR, Enums.DogTag.USEC] as Array<string>;
    return dogTagIds.includes(item._tpl);
  }

  private buildPmcInventoryItemIdMap(items: IItem[]): Record<string, IItem> {
    const map: Record<string, IItem> = {};
    items.forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }

  private getTradeSessionStandingDiff(sellingItems: SellingItem[]): StandingDiffStats {
    const baseDecreasePreSession = 0.02;
    const baseDecreasePreSessionWithDogTags = 0.005;
    let hasDogTags = false;
    const itemTypesSet = new Set();
    let itemSizeSum = 0;
    let dogTagsIncrease = 0;
    sellingItems.forEach((item) => {
      if (this.isItemDogTag(item)) {
        dogTagsIncrease += this.getStandingIncreaseOfDogTag(item);
        hasDogTags = true;
        return;
      }
      itemTypesSet.add(item._tpl);
      itemSizeSum += item._props.Width * item._props.Height * item.count;
    });
    const decreasePreItemType = 0.01;
    const stats = {
      byBasePreSession: this.roundFloat(hasDogTags ? -baseDecreasePreSessionWithDogTags : -baseDecreasePreSession),
      byItemType: this.roundFloat(-itemTypesSet.size * decreasePreItemType),
      byItemSize: this.roundFloat(-this.getStandingDecreaseOfSize(itemSizeSum)),
      byDogTag: this.roundFloat(dogTagsIncrease),
    };
    const consumed = stats.byBasePreSession + stats.byItemType + stats.byItemSize;
    const produced = stats.byDogTag;
    return {
      ...stats,
      consumed,
      produced,
      sum: this.roundFloat(consumed + produced),
    };
  }

  private getStandingIncreaseOfDogTag(dogTagItem: SellingItem): number {
    const level = dogTagItem.upd?.Dogtag?.Level;
    if (!level || level <= 0) return 0;
    if (level <= 15) return 0.01;
    if (level <= 30) return 0.02;
    if (level <= 50) return 0.03;
    if (level <= 85) return 0.04;
    return 0.05;
  }

  private getStandingDecreaseOfSize(sizeSum: number): number {
    const decreasePreUnitSize = 0.01;
    const sizePreUnit = 10;
    const freeSizeUnit = 2;
    if (sizeSum <= sizePreUnit * freeSizeUnit) {
      return 0;
    }
    return (Math.floor((sizeSum - sizePreUnit * freeSizeUnit) / sizePreUnit) + 1) * decreasePreUnitSize;
  }

  private removeTradedItems(
    pmcData: IPmcData,
    sessionId: string,
    sellingItem: SellingItem[],
    originResponse: IItemEventRouterResponse,
  ): IItemEventRouterResponse {
    let removedItemsResponse = originResponse;
    for (let index = 0; index < sellingItem.length; index++) {
      removedItemsResponse = this.inventoryController.removeItem(
        pmcData,
        sellingItem[index].instanceId,
        sessionId,
        removedItemsResponse,
      );
    }
    return removedItemsResponse;
  }

  private modifyCurrentTraderStanding(
    confirmResponse: IItemEventRouterResponse,
    sessionId: string,
    currentStanding: number,
    standingDiffStats: StandingDiffStats,
  ): IItemEventRouterResponse {
    // 修改界面上的数字
    confirmResponse.profileChanges[sessionId].traderRelations[BlackMarketTrader.traderId] = {
      standing: currentStanding + standingDiffStats.sum,
    };
    // 修改存档里的数字
    const realPmcData = this.profileHelper.getPmcProfile(sessionId);
    realPmcData.TradersInfo[BlackMarketTrader.traderId].standing = currentStanding + standingDiffStats.sum;
    this.debugInfo('onTradeConfirmTrading change real pmcData done');
    this.debugRecord({ TradersInfo: realPmcData.TradersInfo });
    return confirmResponse;
  }

  private getTradeSessionMoneyResponse(sellingItems: SellingItem[]): [IItem, number] {
    let sumPrice = 0;
    sellingItems.forEach((item) => {
      if (this.isItemDogTag(item)) { return; }
      const ragfairPrice = this.ragfairPriceService.getDynamicPrice(item._tpl);
      const itemPrice = Math.ceil(ragfairPrice * (1 - this.sellingTax));
      sumPrice += itemPrice;
    });
    return [{
      _id: this.hashUtil.generate(),
      _tpl: Enums.Money.ROUBLES,
      parentId: Enums.RootItemNodeId,
      slotId: 'hideout',
      upd: { StackObjectsCount: sumPrice },
    }, sumPrice];
  }

  private getTradeDialogMessageText(
    sellingItems: SellingItem[],
    standingDiffStats: StandingDiffStats,
    responseMoney: IItem,
  ): string {
    const messages = [];
    const moneyReturns = responseMoney.upd.StackObjectsCount;
    if (moneyReturns > 0) {
      messages.push(`本次交易共计售出商品 ${sellingItems.length} 件，总计 ${moneyReturns} 卢布；`);
      messages.push(`交易税率 ${this.sellingTax * 100}%；`);
    }
    if (standingDiffStats.sum >= 0) {
      messages.push(`本次交易获得信任度 ${standingDiffStats.sum}，详单：`);
    } else {
      messages.push(`本次交易消费信任度 ${standingDiffStats.sum}，详单：`);
    }
    if (standingDiffStats.byBasePreSession) {
      messages.push(`交易基本消耗：${standingDiffStats.byBasePreSession}；`);
    }
    if (standingDiffStats.byItemSize) {
      messages.push(`货物尺寸消耗：${standingDiffStats.byItemSize}；`);
    }
    if (standingDiffStats.byItemType) {
      messages.push(`货物种类消耗：${standingDiffStats.byItemType}；`);
    }
    if (standingDiffStats.byDogTag) {
      messages.push(`狗牌上缴获得：${standingDiffStats.byDogTag}；`);
    }
    if (standingDiffStats.consumed < 0 && moneyReturns > 0) {
      messages.push(`平均千分之信用点回报：${this.roundFloat(moneyReturns / 1000 / (-standingDiffStats.consumed))}；`);
    }
    return messages.join('');
  }

  private sendMessageWithRecords(sessionId: string, messageText: string, records: IItem[]): void {
    this.dialogueHelper.addDialogueMessage(
      BlackMarketTrader.traderId,
      {
        templateId: undefined,
        text: messageText,
        type: records.length === 0 ? Enums.MessageType.NPC_TRADER : Enums.MessageType.FLEAMARKET_MESSAGE,
        maxStorageTime: 60 * 60 * 24,
      },
      sessionId,
      records,
    );
  }

  private blockBuyDogTagsFromRegFair(itemTemplates: Record<string, ITemplateItem>): void {
    this.blockToBuyFromRegFair(itemTemplates[Enums.DogTag.BEAR]);
    this.blockToBuyFromRegFair(itemTemplates[Enums.DogTag.USEC]);
  }

  /**
   * 禁止将某物品出售给跳蚤市场
   *
   * @param itemTemplate
   */
  private blockToSellToRegFair(itemTemplate: ITemplateItem): void {
    itemTemplate._props.CanRequireOnRagfair = false;
  }

  /**
   * 禁止从跳蚤市场购买某物品
   *
   * @param itemTemplate
   */
  private blockToBuyFromRegFair(itemTemplate: ITemplateItem): void {
    itemTemplate._props.CanSellOnRagfair = false;
  }

  private registerTrader(): void {
    const avatarKey = '/files/trader/avatar/black-market-trader-avatar';
    const modPath = this.modLoader.getModPath(BlackMarketTrader.PACKAGE_CONFIG.modTargetName);
    const avatarPath = 'assets/black-market-trader-avatar.jpg';
    this.imageRouter.addRoute(
      avatarKey,
      `${modPath}${avatarPath}`,
    );
    const database = this.databaseServer.getTables();
    const globalLocales = database.locales.global;
    for (const key in globalLocales) {
      if (!Object.prototype.hasOwnProperty.call(globalLocales, key)) {
        continue;
      }
      globalLocales[key].trading[BlackMarketTrader.traderId] = {
        FullName: '***XXXXXX***',
        FirstName: '***XXXXXX***',
        Nickname: 'Black Market',
        Location: 'Deep Web',
        Description: '黑市的快速销售窗口。他们收取狗牌作为为快速交易的凭证，同时收取高额手续费，但是能以跳蚤市场的价格快速交易你的商品。',
      };
    }
    const tradeBase = require('../../assets/BlackMarketTraderBase.json');
    tradeBase._id = BlackMarketTrader.traderId;
    tradeBase.avatar = `${avatarKey}.jpg`;
    database.traders[BlackMarketTrader.traderId] = {
      base: tradeBase,
      assort: { items: [], barter_scheme: {}, loyal_level_items: {} },
      questassort: { started: {}, success: {}, fail: {} },
    };
    const traderConfig = this.configServer.getConfig<ITraderConfig>(
      Enums.ConfigTypes.TRADER as unknown as ConfigTypes
    );
    traderConfig.updateTime.push({ traderId: BlackMarketTrader.traderId, seconds: 60 * 60 });
  }

  private roundFloat(value: number, fixTo = 3): number {
    return Math.round(value * (10 ** fixTo)) / (10 ** fixTo);
  }

  /**
   * 关闭向跳蚤市场销售的功能
   */
  private modifyRagfairGlobalConfig(globalConfigs: GlobalConfig): void {
    globalConfigs.RagFair.maxActiveOfferCount = [{ from: -10000, to: 10000, count: 0 }];
  }
}

interface SellingItem extends IItem, ITemplateItem {
  instanceId: string,
  count: number;
}

interface StandingDiffStats {
  byBasePreSession: number;
  byItemType: number;
  byItemSize: number;
  byDogTag: number;
  consumed: number;
  produced: number;
  sum: number;
}
