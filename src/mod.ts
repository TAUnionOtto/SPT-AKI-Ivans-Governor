import { DependencyContainer } from 'tsyringe';

import * as Enums from './enums';

import type { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import type { IMod } from '@spt-aki/models/external/mod';
import type { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import type { ILocations } from '@spt-aki/models/spt/server/ILocations';
import type { IRagfairConfig } from '@spt-aki/models/spt/config/IRagfairConfig';
import type { IBotType, Equipment as IBotEquipment } from '@spt-aki/models/eft/common/tables/IBotType';
import type { ITemplateItem, Props as ITemplateItemProps } from '@spt-aki/models/eft/common/tables/ITemplateItem';
import type { ILocationBase } from '@spt-aki/models/eft/common/ILocationBase';
import type { Config as GlobalConfig } from '@spt-aki/models/eft/common/IGlobals';
import type { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import type { ConfigServer } from '@spt-aki/servers/ConfigServer';
import type { IQuest } from '@spt-aki/models/eft/common/tables/IQuest';
import type { IHideoutArea } from '@spt-aki/models/eft/hideout/IHideoutArea';
import type { ITrader } from '@spt-aki/models/eft/common/tables/ITrader';
import type { IInventoryConfig } from '@spt-aki/models/spt/config/IInventoryConfig';
import type { IInRaidConfig } from '@spt-aki/models/spt/config/IInRaidConfig';
import type { IQuestConfig } from '@spt-aki/models/spt/config/IQuestConfig';

const packageConfig = require('../package.json');
const IS_DEBUG_MODE = false;
const NEED_RUN_TEST = true;

const imbaEquipments = [{
    // id: '5fd4c474dd870108a754b241', // 5.11 Hexgrid插板背心
    id: '60a283193cb70855c43a381d', // THOR综合型防弹服
    modification: {
      Weight: 1.7,
      Durability: 1550,
      MaxDurability: 1550,
      RepairCost: 337,
      BackgroundColor: Enums.EquipmentBackgroundColors.RED,
      speedPenaltyPercent: 8,
      mousePenalty: 12,
      weaponErgonomicPenalty: 10,
      armorZone: [
        'LeftArm',
        'RightArm',
        'Chest',
        'Stomach',
        'LeftLeg',
        'RightLeg',
      ],
      ArmorMaterial: 'Aramid',
    } as ITemplateItemProps,
    priceIncreaseRatio: 9.5,
  }, {
    // id: '5c0e6a1586f77404597b4965', // elt-A + Belt-B胸挂
    id: '592c2d1a86f7746dbe2af32a', // ANA Tactical Alpha胸挂
    modification: {
      Weight: 0.715,
      BackgroundColor: Enums.EquipmentBackgroundColors.RED,
      Width: 2,
      Height: 2,
      RepairCost: 237,
      Durability: 1250,
      MaxDurability: 1250,
      armorZone: [
        'LeftArm',
        'RightArm',
        'Chest',
        'Stomach',
        'LeftLeg',
        'RightLeg',
      ],
      armorClass: 6,
      speedPenaltyPercent: 5,
      mousePenalty: 5,
      weaponErgonomicPenalty: 5,
      BluntThroughput: 0.165,
      ArmorMaterial: 'Aramid',
    } as ITemplateItemProps,
    needExpandGridAsChestRig: true,
    riceIncreaseRatio: 9.5,
  }, {
    id: '5e00c1ad86f774747333222c', // Team Wendy EXFIL防弹头盔 Black
    // id: '61bca7cda0eae612383adf57', // NFM \"HJELM\" 头盔
    modification: {
      BackgroundColor: Enums.EquipmentBackgroundColors.RED,
      Weight: 0.35,
      RepairCost: 137,
      Durability: 650,
      MaxDurability: 650,
      armorClass: 6,
      speedPenaltyPercent: 2,
      mousePenalty: 6,
      weaponErgonomicPenalty: 4,
      headSegments: [
        'Top',
        'Ears',
        'Eyes',
        'Nape',
        'Jaws',
      ],
    } as ITemplateItemProps,
    riceIncreaseRatio: 5.5,
  }, {
    id: '5e00cfa786f77469dc6e5685', // TW EXFIL护耳 Black
    modification: {
      BackgroundColor: Enums.EquipmentBackgroundColors.RED,
      Durability: 120,
      MaxDurability: 120,
      armorClass: 6,
      speedPenaltyPercent: 2,
      mousePenalty: 1,
      weaponErgonomicPenalty: 1,
    } as ITemplateItemProps,
  }, {
    id: '5e71f70186f77429ee09f183', // Twitch Rivals 2020 眼镜
    modification: {} as ITemplateItemProps,
  }, {
    id: '5e71fad086f77422443d4604', // Twitch Rivals 2020 半面巾
    modification: {
      Durability: 475,
      MaxDurability: 475,
      armorClass: 5,
      speedPenaltyPercent: 4,
      mousePenalty: 7,
      weaponErgonomicPenalty: 10,
      armorZone: [
        'Head',
      ],
      Indestructibility: 0.9,
      headSegments: [
        'Top',
        'Ears',
        'Eyes',
        'Jaws',
      ],
      FaceShieldComponent: false,
      FaceShieldMask: 'NoMask',
      HasHinge: false,
      MaterialType: 'BodyArmor',
      RicochetParams: {
        x: 0,
        y: 0,
        z: 80
      },
      DeafStrength: 'High',
      BluntThroughput: 0.18,
      ArmorMaterial: 'Aramid',
      BlindnessProtection: 0.7,
    } as ITemplateItemProps,
  }, {
    // id: '60a2828e8689911a226117f9', // Hazard4 Pillbox背包
    id: '5b44c6ae86f7742d1627baea', // Ana tactical Beta 2战斗背包
    modification: {
      Weight: 0.375,
      BackgroundColor: Enums.EquipmentBackgroundColors.RED,
      Width: 2,
      Height: 3,
    } as ITemplateItemProps,
    needRemoveAllExcludedFilter: true,
  }, {
    id: '5b7c710788a4506dec015957', // 幸运Scav垃圾箱
    modification: {
      Width: 3,
      Height: 2,
    } as ITemplateItemProps,
    riceIncreaseRatio: 1.5,
  }
];

const collectionsToExpand = [{
    id: '5b44c6ae86f7742d1627baea', // Ana tactical Beta 2战斗背包
    gridsModification: {
      cellsH: 6,
      cellsV: 9,
    },
  }, {
    id: '544a11ac4bdc2d470e8b456a', // Alpha安全箱
    gridsModification: {
      cellsH: 6,
      cellsV: 8,
    },
  }, {
    id: '619cbf7d23893217ec30b689', // 注射器收纳盒
    gridsModification: {
      cellsH: 8,
      cellsV: 8,
    },
  }, {
    id: '5aafbde786f774389d0cbc0f', // 弹药箱
    gridsModification: {
      cellsH: 17,
      cellsV: 12,
    },
  }, {
    id: '5b7c710788a4506dec015957', // 幸运Scav垃圾箱
    gridsModification: {
      cellsH: 17,
      cellsV: 14,
    },
  }, {
    id: '5c0a840b86f7742ffa4f2482', // T H I C C 物品箱
    gridsModification: {
      cellsH: 28, // 接近能正常显示的最大值
      cellsV: 17, // 接近能正常显示的最大值 ?
    },
  }, {
    id: '59fb023c86f7746d0d4b423c', // 武器箱
    gridsModification: {
      cellsH: 7,
      cellsV: 13,
    },
  }, {
    id: '5c0a840b86f7742ffa4f2482', // T H I C C 武器箱
    gridsModification: {
      cellsH: 12,
      cellsV: 15,
    },
  }, {
    id: '59fafd4b86f7745ca07e1232', // 钥匙收纳器
    gridsModification: {
      cellsH: 9,
      cellsV: 9,
    },
  }, {
    id: '5c093db286f7740a1b2617e3', // Mr. Holodilnick保温箱
    gridsModification: {
      cellsH: 16,
      cellsV: 16,
    },
  }, {
    id: '5aafbcd986f7745e590fff23', // 医疗物品箱
    gridsModification: {
      cellsH: 16,
      cellsV: 16,
    },
  }, {
    id: '5d235bb686f77443f4331278', // 小型S I C C包，可放在背包内，可打标签
    gridsModification: {
      cellsH: 12,
      cellsV: 14,
    },
    needRemoveAllExcludedFilter: true,
  },
];

class Mod implements IMod {
  private logger: ILogger;
  private databaseServer: DatabaseServer;
  private configServer: ConfigServer;

  public load(container: DependencyContainer): void {
    try {
      this.logger = container.resolve<ILogger>("WinstonLogger");
      this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
      this.configServer = container.resolve<ConfigServer>("ConfigServer");
      this.logInfo('Loading...');

      this.modifyRagfairConfig();
      this.modifyConfigAsTKFSuperMod();
      this.modifyQuestConfigs();
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
    }
  };

  public delayedLoad(container: DependencyContainer): void {
    try {
      this.logInfo('Delayed Loading...');
      const dataBaseTables = this.databaseServer.getTables();
      const globalConfigs = dataBaseTables.globals.config;
      this.modifyRagFairConfig(globalConfigs);
      this.modifyStaminaConfig(globalConfigs);
      this.modifyDBAsTKFSuperMod(globalConfigs);

      this.unlockAllItemsInRagfair(dataBaseTables.templates.items);

      this.carryUpFourGuns(dataBaseTables.templates.items);
      this.modifyNightVisionGoggles(dataBaseTables.templates.items);
      this.modifyImbaDrumMagazines(dataBaseTables.templates.items, dataBaseTables.templates.prices);
      this.expandPockets(dataBaseTables.templates.items);

      // TODO: 目前修改价格不能正常作用于跳蚤市场的售价
      //       需要等 SPT-AKI 升级到 ^3.0.1，并使用 loadAfterDbInit() hook 来修改
      this.modifyImbaEquipments(dataBaseTables.templates.items, dataBaseTables.templates.prices, dataBaseTables.bots.types);
      this.expandCollections(dataBaseTables.templates.items);
      this.randomUpdateRegFairPrices(dataBaseTables.templates.prices);

      this.increaseBotCount(dataBaseTables.locations);
      this.increaseTraderLoyaltyStandingRequires(dataBaseTables.traders);
      this.increaseHideoutAreaRequirements(dataBaseTables.hideout.areas);

      this.decreaseAdiKitUseTime(dataBaseTables.templates.items);

      NEED_RUN_TEST && this.testItemsPrice(dataBaseTables.templates.prices);
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
    }
    this.logInfo('Loaded');
  }

  private logInfo(message: string) {
    this.logger.info(`[${packageConfig.name} - ${packageConfig.version}] ${message}`);
  }

  private debugInfo(message: string) {
    if (!IS_DEBUG_MODE) {
      return;
    }
    this.logger.debug(`[${packageConfig.name} - ${packageConfig.version}] ${message}`);
  }

  /**
   * 解锁所有商品在跳蚤市场的买卖
   *
   * @param dataBaseTables
   */
  private unlockAllItemsInRagfair(itemTemplates: Record<string, ITemplateItem>): void {
    for (const itemId in itemTemplates) {
        if (!Object.prototype.hasOwnProperty.call(itemTemplates, itemId)) {
            continue;
        }
        const currentItem = itemTemplates[itemId];
        currentItem._props.CanSellOnRagfair = true;
        currentItem._props.CanRequireOnRagfair = true;
    }
  }

  /**
   * 禁止将某物品出售给跳蚤市场
   *
   * 由 modifyRagFairConfig 代替，直接关闭向跳蚤市场出售的功能
   *
   * @param itemTemplate
   */
  private blockToSellToRegFair(itemTemplate: ITemplateItem): void {
    itemTemplate._props.CanRequireOnRagfair = false;
  }

  /**
   * 修改跳蚤市场物价、关闭黑名单、开启动态或者在线跳蚤市场
   *
   * @param container
   */
  private modifyRagfairConfig(): void {
    const regFairConfig = this.configServer.getConfig<IRagfairConfig>(
      Enums.ConfigTypes.RAGFAIR as unknown as ConfigTypes
    );
    // 提高跳蚤市场物品售价
    regFairConfig.dynamic.price.max = 3.35;
    regFairConfig.dynamic.price.min = 2.25;
    // 关闭 BSG 黑名单
    regFairConfig.dynamic.blacklist.enableBsgList = false;
    /**
     * 超级模组的动态市场和在线市场实际上是启用了 regFairConfig.dynamic 的 enabled、liveprices
     * @see tkf-SuperMod/extend/Ragfair/Ragfair.js#L24
     * 
     * enabled、liveprices 这两个属性在 d.ts 中本不存在，看起来是已被弃用
     * 试验得出结论：
     * 
     * - enabled 选项没有任何作用，应该是已经被默认开启，既默认模式就是动态市场
     * - liveprices 会生成数量为 99999999 的一笔订单，价格没有找到规律，应该是还在开发中
     * 
     * 遂在 randomUpdateRegFairPrices 方法中做动态调整，模拟每日价格波动
     */
  }

  /**
   * - 购买的物品当作战局中发现的（带勾）
   * - 关闭战局迷失
   * - AI 活跃半径：似乎是假设置，没有看到让设置生效的代码
   */
  private modifyConfigAsTKFSuperMod(): void {
    const inventoryConfig = this.configServer.getConfig<IInventoryConfig>(
      Enums.ConfigTypes.INVENTORY as unknown as ConfigTypes
    );
    inventoryConfig.newItemsMarkedFound = true;
    const inRaidConfig = this.configServer.getConfig<IInRaidConfig>(
      Enums.ConfigTypes.IN_RAID as unknown as ConfigTypes
    );
    inRaidConfig.MIAOnRaidEnd = false;
  }

  /**
   * 增加周常和日常任务的数量
   */
  private modifyQuestConfigs(): void {
    const questsConfig = this.configServer.getConfig<IQuestConfig>(
      Enums.ConfigTypes.QUEST as unknown as ConfigTypes
    );
    questsConfig.repeatableQuests.forEach(quest => {
      if (quest.name === 'Daily') {
        quest.numQuests = 5; 
      } else if (quest.name === 'Weekly') {
        quest.numQuests = 2;
      }
    });
  }

  /**
   * - 去除 PMC 玩家携带物品的限制
   *
   * @param globalConfigs
   */
  private modifyDBAsTKFSuperMod(globalConfigs: GlobalConfig): void {
    globalConfigs.RestrictionsInRaid = [];
  }

  /**
   * 调整跳蚤市场设置，关闭向市场销售的功能，并将访问市场的最低等级调到 1
   *
   * @param globalConfigs
   */
  private modifyRagFairConfig(globalConfigs: GlobalConfig): void {
    // 将使用跳蚤市场的最低等级调整为 1
    globalConfigs.RagFair.minUserLevel = 1;
    // 关闭跳蚤市场出售订单
    globalConfigs.RagFair.maxActiveOfferCount = [{ from: -10000, to: 10000, count: 0 }];
    // 提高市场税率
    // globalConfigs.RagFair.communityTax = 8;
    // globalConfigs.RagFair.communityItemTax = 12;
    // globalConfigs.RagFair.communityRequirementTax = 24;
  }

  private modifyStaminaConfig(globalConfigs: GlobalConfig): void {
    // 增加体能上限到 200
    globalConfigs.Stamina.Capacity = 200;
    // 大幅增加行走、奔跑时的负重，降低惯性系数
    globalConfigs.Stamina.WalkOverweightLimits = { x: 442, y: 575, z: 0 };
    globalConfigs.Stamina.BaseOverweightLimits = { x: 426, y: 570, z: 0 };
    globalConfigs.Stamina.SprintOverweightLimits = { x: 426, y: 565, z: 0 };
    globalConfigs.Stamina.WalkSpeedOverweightLimits = { x: 432, y: 592, z: 0 };
    globalConfigs.Inertia.InertiaLimits = { x: 0, y: 426, z: 0.5 };
    globalConfigs.Inertia.WalkInertia = { x: 0.01, y: 0.02, z: 0 };
  }

  /**
   * 将跳蚤市场的物品价格随机化
   * 
   * 下界为 0.45 倍，上届为 3.15 倍，做约以 1 为中轴的正则随机
   * 
   * @param priceTemplates 
   */
  private randomUpdateRegFairPrices(priceTemplates: Record<string, number>): void {
    const randomLowerBound = 0.45;
    const randomUpperBound = 3.15;
    const ndRandomSkew = 1.95;
    for (const templateId in priceTemplates) {
      if (!Object.prototype.hasOwnProperty.call(priceTemplates, templateId)) {
        continue;        
      }
      priceTemplates[templateId] = Math.floor(priceTemplates[templateId] * this.ndRandom(
        randomLowerBound,
        randomUpperBound,
        ndRandomSkew,
      )) || 1;
    }
  }

  /**
   * 获得正态分布随机出的一个值
   * 
   * @see https://stackoverflow.com/a/49434653
   * 
   * @param min 最小值 
   * @param max 最大值
   * @param skew 偏斜率
   * @returns 随机结果
   */
  private ndRandom(min: number, max: number, skew: number): number {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let result = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    result = result / 10.0 + 0.5; // Translate to 0 -> 1
    if (result > 1 || result < 0) result = this.ndRandom(min, max, skew); // resample between 0 and 1 if out of range
    result = Math.pow(result, skew); // Skew
    result *= max - min; // Stretch to fill range
    result += min; // offset to min
    return result;
  }

  /**
   * 将主武器栏位的 filter 拼接到手枪和近战武器栏位的 filter 中，实现同时装备四把长枪的效果
   *
   * @param itemTemplates
   */
  private carryUpFourGuns(itemTemplates: Record<string, ITemplateItem>): void {
    /** 默认物品栏 ID */
    const defaultInventoryId = '55d7217a4bdc2d86028b456d';
    const defaultInventor = itemTemplates[defaultInventoryId];
    if (!defaultInventor) {
      this.logger.warning(`Can not find default inventor by id ${defaultInventoryId}`);
      return;
    }
    const primaryWeaponFilter = defaultInventor._props.Slots
      .find(slot => slot._name === Enums.EquipmentSlots.FIRST_PRIMARY_WEAPON)
      ._props.filters[0].Filter;
    const holsterProps = defaultInventor._props.Slots.find(slot => slot._name === Enums.EquipmentSlots.HOLSTER)._props;
    const scabbardProps = defaultInventor._props.Slots.find(slot => slot._name === Enums.EquipmentSlots.SCABBARD)._props;
    holsterProps.filters[0].Filter = [...holsterProps.filters[0].Filter, ...primaryWeaponFilter];
    scabbardProps.filters[0].Filter = [...scabbardProps.filters[0].Filter, ...primaryWeaponFilter];
  }

  /**
   * 增强夜视仪和热成像的成像性能
   *
   * @param itemTemplates
   */
  private modifyNightVisionGoggles(itemTemplates: Record<string, ITemplateItem>): void {
    /** GPNVG-18夜视仪 ID */
    const gpnvg18Id = '5c0558060db834001b735271';
    const gpnvg18 = itemTemplates[gpnvg18Id];
    if (!gpnvg18) {
      this.logger.warning(`Can not find GPNVG-18 by id ${gpnvg18Id}`);
      return;
    }
    gpnvg18._props.Intensity = 1;
    // gpnvg18._props.MaskSize = 1.35;
    gpnvg18._props.MaskSize = 3;
    gpnvg18._props.NoiseIntensity = 0;
    gpnvg18._props.NoiseScale = 0;
    gpnvg18._props.Color = { r: 0, g: 200, b: 200, a: 254 };
    gpnvg18._props.DiffuseIntensity = 0;
    gpnvg18._props.HasHinge = true;
    gpnvg18._props.Ergonomics = -2;

    /** FLIR RS-32 2.25-9x 35毫米 60Hz热成像步枪瞄准镜 */
    const flir60hzId = '5d1b5e94d7ad1a2b865a96b0';
    const flir60hz = itemTemplates[flir60hzId];
    if (!flir60hz) {
      this.logger.warning(`Can not find RS-32 60Hz thermal rifle scope by id ${flir60hzId}`);
      return;
    }
    flir60hz._props.DepthFade = 0;
    flir60hz._props.DepthFade = 0;
    flir60hz._props.RoughnessCoef = 0;
    flir60hz._props.SpecularCoef = 1.1;
    flir60hz._props.MainTexColorCoef = 0.25;
    flir60hz._props.MinimumTemperatureValue = 0.35;
    flir60hz._props.RampShift = 0;
    flir60hz._props.HeatMin = 0.55;
    flir60hz._props.ColdMax = 0.462;
    flir60hz._props.IsNoisy = false;
    flir60hz._props.NoiseIntensity = 0;
    flir60hz._props.IsFpsStuck = false;
    flir60hz._props.IsGlitch = false;
    flir60hz._props.IsMotionBlurred = false;
    flir60hz._props.Mask = 'Thermal';
    flir60hz._props.MaskSize = 3;
    flir60hz._props.IsPixelated = false;
    flir60hz._props.PixelationBlockCount = 256;
  }

  /**
   * 增强指定的弹夹，减重、增加可靠性、增加枪械性能。同时大幅提升其价格。
   * @param itemTemplates
   */
  private modifyImbaDrumMagazines(itemTemplates: Record<string, ITemplateItem>, priceTemplates: Record<string, number>): void {
    const imbaDrumMagazineIds = [
      '5cbdc23eae9215001136a407', // Molot 75发AK兼容弹鼓 7.62x39
      '5bed625c0db834001c062946', // 95发RPK-16 5.45x39兼容弹匣
      '61695095d92c473c7702147a', // SKS 7.62x39 KSI 75发弹鼓
      '5c6592372e221600133e47d7', // MAG5-100 5.56x45 STANAG 100发弹匣
    ];
    const modification = {
      Weight: 0.165,
      Accuracy: 12,
      Recoil: -20,
      Loudness: -5,
      Ergonomics: 4,
      Velocity: 15,
      LoadUnloadModifier: 15,
      CheckTimeModifier: 5,
      CheckOverride: 5,
      MalfunctionChance: 0.07,
    } as ITemplateItemProps;
    const priceIncreaseRatio = 12.5;
    imbaDrumMagazineIds.forEach(id => {
      const drumMagazine = itemTemplates[id];
      if (!drumMagazine) {
        this.logger.warning(`Can not find drum magazine to be IMBA by id ${id}`);
        return;
      }
      this.modifyItemTemplateAs(drumMagazine, modification);
      priceTemplates[id] = priceTemplates[id] * priceIncreaseRatio;
    });
  }

  /**
   * 按指定 modification 更新 itemTemplate 的 props
   *
   * @param itemTemplate
   * @param modification
   */
  private modifyItemTemplateAs(itemTemplate: ITemplateItem, modification: ITemplateItemProps): void {
    for (const key in modification) {
      if (!Object.prototype.hasOwnProperty.call(modification, key)) {
        continue;
      }
      itemTemplate._props[key] = modification[key];
    }
  }

  /**
   * 扩展玩家的口袋大小，从 4*1*1 升级为 1*7*5
   * @param itemTemplates
   */
  private expandPockets(itemTemplates: Record<string, ITemplateItem>): void {
    const pocketsId = '557ffd194bdc2d28148b457f';
    const pockets = itemTemplates[pocketsId];
    if (!pockets) {
      this.logger.warning(`Can not find pockets by id ${pocketsId}`);
      return;
    }
    const pocketFirstGrid = pockets._props.Grids[0];
    pocketFirstGrid._props.cellsH = 7;
    pocketFirstGrid._props.cellsV = 5;
    pockets._props.Grids = [pocketFirstGrid];
  }

  /**
   * 魔改特殊装备，降低这些装备在 AI 身上出现的概率到 0，同时提高其价格
   *
   * TODO: 尝试将这些物品编制成新的起始模板
   *
   * @param itemTemplates
   * @param priceTemplates
   * @param botTypeTemplates
   */
  private modifyImbaEquipments(
    itemTemplates: Record<string, ITemplateItem>,
    priceTemplates: Record<string, number>,
    botTypeTemplates: Record<string, IBotType>,
  ): void {
    const priceIncreaseRatio = 3.5;
    imbaEquipments.forEach(equipment => {
      const itemTemplate = itemTemplates[equipment.id];
      if (!itemTemplate) {
        this.logger.warning(`Can not find item by id ${equipment.id} to modify as imba equipment`);
        return;
      }
      this.modifyItemTemplateAs(itemTemplate, equipment.modification);
      if (equipment.needExpandGridAsChestRig) {
        this.expandChestRigGrids(itemTemplate);
      }
      if (equipment.needRemoveAllExcludedFilter) {
        this.removeAllExcludedFilter(itemTemplate);
      }
      priceTemplates[equipment.id] = priceTemplates[equipment.id] * (equipment.riceIncreaseRatio || priceIncreaseRatio);
      this.decreaseEquipProbabilityInAllBotInventory(equipment.id, botTypeTemplates);
    });
  }

  /**
   * 降低装备在所有 AI 身上出现的概率到 0
   *
   * @param itemId
   * @param botTypeTemplates
   */
  private decreaseEquipProbabilityInAllBotInventory(itemId: string, botTypeTemplates: Record<string, IBotType>): void {
    for (const botTypeName in botTypeTemplates) {
      if (!Object.prototype.hasOwnProperty.call(botTypeTemplates, botTypeName)) {
        continue;
      }
      const botTypeTemplate = botTypeTemplates[botTypeName];
      const botEquipmentInventory = botTypeTemplate.inventory.equipment;
      this.decreaseEquipProbabilityInBotEquipment(itemId, botEquipmentInventory, botTypeName);
    }
  }

  /**
   * 降低装备在某个 AI 身上出现的概率到 0
   *
   * @param itemId
   * @param botEquipmentInventory
   */
  private decreaseEquipProbabilityInBotEquipment(itemId: string, botEquipmentInventory: IBotEquipment, botTypeName: string) {
    for (const equipmentType in botEquipmentInventory) {
      if (!Object.prototype.hasOwnProperty.call(botEquipmentInventory, equipmentType)) {
        continue;
      }
      const botEquipmentInventoryDetail = botEquipmentInventory[equipmentType];
      if (!!botEquipmentInventoryDetail[itemId]) {
        botEquipmentInventoryDetail[itemId] = 0;
        this.debugInfo(`${itemId} @ ${botTypeName} changed to ${botEquipmentInventoryDetail[itemId]}`);
      }
    }
  }

  /**
   * 扩展各类容器
   *
   * @param itemTemplates
   */
  private expandCollections(itemTemplates: Record<string, ITemplateItem>): void {
    collectionsToExpand.forEach(collection => {
      const itemTemplate = itemTemplates[collection.id];
      if (!itemTemplate) {
        this.logger.warning(`Can not find item by id ${collection.id} to expand collection size`);
        return;
      }
      const mainGrid = itemTemplate._props.Grids.find(grid => grid._name === 'main')
        || itemTemplate._props.Grids[0];
      if (!mainGrid) {
        this.logger.warning(`Can not main grid of item ${collection.id} to expand collection size`);
        return;
      }
      if (collection.gridsModification.cellsH) {
        mainGrid._props.cellsH = collection.gridsModification.cellsH;
      }
      if (collection.gridsModification.cellsV) {
        mainGrid._props.cellsV = collection.gridsModification.cellsV;
      }
      if (collection.needRemoveAllExcludedFilter) {
        this.removeAllExcludedFilter(itemTemplate);
      }
    });
  }

  /**
   * 清空容器的禁止容纳清单
   *
   * @param itemTemplate
   */
  private removeAllExcludedFilter(itemTemplate: ITemplateItem): void {
    const rootTemplateNodeId = '54009119af1c881c07000029';
    itemTemplate._props.Grids.forEach(grid => {
      grid._props.filters.forEach(filter => {
        filter.ExcludedFilter = [];
        filter.Filter = [rootTemplateNodeId];
      });
    });
  }

  /**
   * 增加胸挂的容量
   *
   * 注意：不合理的容量参数会导致显示上的重叠
   *
   * @param chestRig
   */
  private expandChestRigGrids(chestRig: ITemplateItem): void {
    const rightTopGrid = chestRig._props.Grids.find(grid => grid._name === "4");
    rightTopGrid._props.cellsH = 3;
    const rightBottomGrid = chestRig._props.Grids.find(grid => grid._name === "7");
    rightBottomGrid._props.cellsH = 3;
  }

  /**
   * 在所有地图内增加若干波次，并且增加每个波次的 AI 数量
   *
   * @param locations
   */
  private increaseBotCount(locations: ILocations): void {
    this.debugInfo('Start to increaseBotCount');
    for (const locationName in locations) {
      if (!Object.prototype.hasOwnProperty.call(locations, locationName)) {
        this.debugInfo(`Break from increaseBotCount by !Object.prototype.hasOwnProperty @ ${locationName}`);
        continue;
      }
      const locationBase = locations[locationName].base as ILocationBase;
      if (!locationBase) {
        this.debugInfo(`Break from increaseBotCount by !locationBase @ ${locationName}`);
        continue;
      }
      /** 部分地图不使用 waves 记录敌人的波次，而是全部使用 boss 信息，比如实验室（laboratory） */
      const locationHasBotsWithoutWaves = ['laboratory'];
      if (locationBase.waves.length === 0 && !locationHasBotsWithoutWaves.includes(locationName)) {
        this.debugInfo(`Break from increaseBotCount by no-waves-and-no-bots @ ${locationName}`);
        continue;
      }

      locationBase.MaxBotPerZone = 100;
      locationBase.BotMax && (locationBase.BotMax = locationBase.BotMax * 50);
      locationBase.BotMaxPlayer && (locationBase.BotMaxPlayer = locationBase.BotMaxPlayer * 50);
      locationBase.sav_summon_seconds = 20;

      // 将每个波次的 AI 数量提高到三倍，最大为 5 ~ 10
      locationBase.waves.forEach(wave => {
        wave.slots_min = Math.min(5, Math.floor(wave.slots_min * 3));
        wave.slots_max = Math.min(10, Math.floor(wave.slots_max * 3));
      });

      this.addRandomWaves(locationBase);
      this.increaseBossGroups(locationBase);
    }
  }

  /**
   * 随机添加几波 AI，概率、数量、地点、时间、难度均随机
   *
   * @param locationBase
   */
  private addRandomWaves(locationBase: ILocationBase, increaseRatio = 0.7) {
    const validBotPreset = ['easy', 'normal', 'hard'];
    const validWildSpawnType = ['assault', 'marksman'];
    const timeMaxLimit = locationBase.exit_access_time * 60;
    const waveCount = locationBase.waves.length;
    for (let index = 0; index < waveCount; index++) {
      if (Math.random() > increaseRatio) {
        continue;
      }
      const timeMax = Math.floor((timeMaxLimit - 60) * Math.random() + 60); //  60 ~ exit_access_time * 60
      const slotsMax = Math.min(10, Math.floor(Math.random() * 4 + 6)) // 6 ~ 10
      const slotsMin = Math.min(5, Math.floor(Math.random() * 3 + 2)) // 2 ~ 5
      locationBase.waves.push({
        number: waveCount + index + 1,
        time_max: timeMax,
        time_min: Math.min(0, timeMax - 60),
        slots_max: slotsMax,
        slots_min: slotsMin,
        SpawnPoints: '',
        BotSide: 'Savage',
        BotPreset: this.getRandomItem(validBotPreset),
        isPlayers: false,
        WildSpawnType: this.getRandomItem(validWildSpawnType),
      });
    }
  }

  /**
   * 将场景 boss 出现的概率提高到 100%，增加 boss 身边的小弟数量
   *
   * pmc bot 出现概率调整到 75%，并且增加约一倍的数量
   *
   * @param locationBase
   */
  private increaseBossGroups(locationBase: ILocationBase) {
    this.debugInfo(`Start to increaseBossGroups @ ${locationBase.Name}`);
    locationBase.BossLocationSpawn.forEach(bossSpawn => {
      if (bossSpawn.BossName === 'exUsec') {
        return;
      }
      if (bossSpawn.BossName === 'pmcBot') {
        bossSpawn.BossChance = 75;
      } else {
        bossSpawn.BossChance = 100;
      }
      let bossEscortAmounts = bossSpawn.BossEscortAmount.split(',').map(amount => parseInt(amount, 10) || 0);
      if (bossEscortAmounts.length === 0) {
        this.debugInfo(`Modified boss ${bossSpawn.BossName} escort amount to ${bossSpawn.BossEscortAmount}`);
        return;
      }
      if (bossEscortAmounts.length === 1) {
        bossSpawn.BossEscortAmount = "" + Math.max(4, bossEscortAmounts[0] * 2);
        this.debugInfo(`Modified boss ${bossSpawn.BossName} escort amount to ${bossSpawn.BossEscortAmount}`);
        return;
      }
      const maxAmount = Math.max(...bossEscortAmounts);
      const appendAmounts = new Array(Math.floor(bossEscortAmounts.length / 2) + 1).fill(maxAmount);
      bossEscortAmounts = [...bossEscortAmounts, ...appendAmounts];
      if (bossSpawn.BossName === 'pmcBot') {
        bossEscortAmounts = bossEscortAmounts.map(amount => Math.floor(amount * 1.75));
      }
      bossSpawn.BossEscortAmount = bossEscortAmounts.join(',');
      this.debugInfo(`Modified boss ${bossSpawn.BossName} escort amount to ${bossSpawn.BossEscortAmount}`);
    });
  }

  private getRandomItem(array: Array<any>) {
    return array[this.getRandomIndex(array.length)];
  }

  private getRandomIndex(arrayLength: number) {
    const randomStart = -0.5;
    const randomEnd = arrayLength - 0.5;
    const randomNumber = randomStart + Math.random() * randomEnd;
    return Math.floor(randomNumber) + 1;
  }

  /**
   * 降低一半任务完成后的商人信任度回报
   *
   * 以由 increaseTraderLoyaltyStandingRequires 代替
   *
   * @param quests
   */
  private decreaseQuestsTraderStandingRewards(quests: Record<string, IQuest>): void {
    for (const questId in quests) {
      if (!Object.prototype.hasOwnProperty.call(quests, questId)) {
        continue;
      }
      const quest = quests[questId];
      const traderStandingRewards = quest.rewards.Success.filter(reward => reward.type === 'TraderStanding');
      traderStandingRewards.forEach(reward => {
        reward.value = '' + parseFloat(reward.value) / 2;
      });
    }
  }

  /**
   * 商人等级需要的人物等级、信任度和交易数额翻倍
   *
   * @param traders
   */
  private increaseTraderLoyaltyStandingRequires(traders:  Record<string, ITrader>): void {
    for (const traderId in traders) {
      if (!Object.prototype.hasOwnProperty.call(traders, traderId)) {
        continue;
      }
      const trader = traders[traderId];
      trader.base.loyaltyLevels.forEach(levelConfig => {
        const minLevel = parseInt(levelConfig.minLevel as unknown as string, 10);
        levelConfig.minLevel = minLevel === 1 ? 1 : minLevel * 2;

        levelConfig.minSalesSum = levelConfig.minSalesSum * 2;
        levelConfig.minStanding = levelConfig.minStanding * 2;
      });
    }
  }

  /**
   * 藏身处金钱消耗五倍，物资消耗三倍，技能要求增加四级
   *
   * @param hideoutAreas
   */
  private increaseHideoutAreaRequirements(hideoutAreas: IHideoutArea[]): void {
    const moneyIds = [
      Enums.Money.ROUBLES,
      Enums.Money.DOLLARS,
      Enums.Money.EUROS,
    ] as string[];
    hideoutAreas.forEach(area => {
      const stages = area.stages;
      for (const index in stages) {
        if (!Object.prototype.hasOwnProperty.call(stages, index)) {
          continue;
        }
        const stage = stages[index];
        stage.requirements.forEach(requirement => {
          if (requirement.type === 'Item' || requirement.type === 'Tool') {
            if (moneyIds.includes(requirement.templateId)) {
              requirement.count = requirement.count * 5;
            } else {
              requirement.count = requirement.count * 3;
            }
          } else if (requirement.type === 'Skill') {
            requirement.count = requirement.skillLevel + 4;
          }
        });
      }
    });
  }

  /**
   * 缩短急救包和医疗用品的使用时间为二分之一，原本使用时间为 1 秒的物品时间不变
   *
   * @param itemTemplates
   */
  private decreaseAdiKitUseTime(itemTemplates: Record<string, ITemplateItem>): void {
    const medicalNodes = [
      '5448f39d4bdc2d0a728b4568', // 急救包
      '5448f3ac4bdc2dce718b4569', // 医疗用品
    ];
    for (const itemId in itemTemplates) {
      if (!Object.prototype.hasOwnProperty.call(itemTemplates, itemId)) {
        continue;
      }
      const itemTemplate = itemTemplates[itemId];
      if (medicalNodes.includes(itemTemplate._parent) && itemTemplate._props.medUseTime > 1) {
        itemTemplate._props.medUseTime = itemTemplate._props.medUseTime / 2;
      }
    }
  }

  private testItemsPrice(priceTemplates: Record<string, number>): void {
    imbaEquipments.forEach(equipment => {
      this.logInfo(`[TEST] Equipment price ${equipment.id} -> ${priceTemplates[equipment.id]}`);
    });
  }
}

module.exports = { mod: new Mod() }
