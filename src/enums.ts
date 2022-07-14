/* eslint-disable @typescript-eslint/naming-convention */
export const enum ConfigTypes {
  AIRDROP = 'aki-airdrop',
  BOT = 'aki-bot',
  CORE = 'aki-core',
  HEALTH = 'aki-health',
  HIDEOUT = 'aki-hideout',
  HTTP = 'aki-http',
  IN_RAID = 'aki-inraid',
  INSURANCE = 'aki-insurance',
  INVENTORY = 'aki-inventory',
  LOCATION = 'aki-location',
  MATCH = 'aki-match',
  QUEST = 'aki-quest',
  RAGFAIR = 'aki-ragfair',
  REPAIR = 'aki-repair',
  TRADER = 'aki-trader',
  WEATHER = 'aki-weather',
}

export const enum EquipmentSlots {
  HEADWEAR = 'Headwear',
  EARPIECE = 'Earpiece',
  FACE_COVER = 'FaceCover',
  ARMOR_VEST = 'ArmorVest',
  EYEWEAR = 'Eyewear',
  ARM_BAND = 'ArmBand',
  TACTICAL_VEST = 'TacticalVest',
  POCKETS = 'Pockets',
  BACKPACK = 'Backpack',
  SECURED_CONTAINER = 'SecuredContainer',
  FIRST_PRIMARY_WEAPON = 'FirstPrimaryWeapon',
  SECOND_PRIMARY_WEAPON = 'SecondPrimaryWeapon',
  HOLSTER = 'Holster',
  SCABBARD = 'Scabbard',
}

export const enum EquipmentBackgroundColors {
  DEFAULT = 'default',
  GREY = 'grey',
  GREEN = 'green',
  BLUE = 'blue',
  VIOLET = 'violet',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  RED = 'red',
  BLACK = 'black',
}

export const RootItemNodeId = '5fe49444ae6628187a2e78b8';

export const enum Money {
  ROUBLES = '5449016a4bdc2d6f028b456f',
  EUROS = '569668774bdc2da2298b4568',
  DOLLARS = '5696686a4bdc2da3298b456a',
}

export const enum DogTag {
  BEAR = '59f32bb586f774757e1e8442',
  USEC = '59f32c3b86f77472a31742f0',
}
export enum MessageType {
  USER_MESSAGE = 1,
  NPC_TRADER = 2,
  AUCTION_MESSAGE = 3,
  FLEAMARKET_MESSAGE = 4,
  ADMIN_MESSAGE = 5,
  GROUP_CHAT_MESSAGE = 6,
  SYSTEM_MESSAGE = 7,
  INSURANCE_RETURN = 8,
  GLOBAL_CHAT = 9,
  QUEST_START = 10,
  QUEST_FAIL = 11,
  QUEST_SUCCESS = 12,
  MESSAGE_WITH_ITEMS = 13,
  INITIAL_SUPPORT = 14
}
