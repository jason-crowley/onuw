// Definitions for Cards, WakeRoleMapper, and NightWakeOrder are derived from
// the One Night Ultimate Werewolf rules:
// https://www.fgbradleys.com/rules/rules2/OneNightUltimateWerewolf-rules.pdf

export const Cards = {
  0: 'villager',
  1: 'villager',
  2: 'villager',
  3: 'werewolf',
  4: 'werewolf',
  5: 'seer',
  6: 'robber',
  7: 'troublemaker',
  8: 'tanner',
  9: 'drunk',
  10: 'hunter',
  11: 'mason',
  12: 'mason',
  13: 'insomniac',
  14: 'minion',
  // 15: 'doppelganger',
} as const;

const WakeRoleMapper = {
  // Wake Roles:
  werewolf: true,
  minion: true,
  mason: true,
  seer: true,
  robber: true,
  troublemaker: true,
  drunk: true,
  insomniac: true,
  // No-Wake Roles:
  villager: false,
  tanner: false,
  hunter: false,
} as const;

export const NightWakeOrder = [
  //   'doppelganger',
  'werewolf',
  'minion',
  'mason',
  'seer',
  'robber',
  'troublemaker',
  'drunk',
  'insomniac',
] as const;

// Leaves only key-value pairs from object T where the value extends V
type KeysWithVal<T extends object, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type CardId = keyof typeof Cards;
export type Role = typeof Cards[CardId];

// Derive Wake and No-Wake Roles from WakeRoleMapper
type WakeMapper = typeof WakeRoleMapper;
export type WakeRole = KeysWithVal<WakeMapper, true>;
export type NoWakeRole = KeysWithVal<WakeMapper, false>;

// Type assertions
type ValidateExact<T, S> = Exclude<keyof T, keyof S> extends never
  ? Exclude<keyof S, keyof T> extends never
    ? T
    : never
  : never;

type RoleMapper<T> = Record<Role, T>;
declare function assertExactMapper<T>(arg: ValidateExact<T, RoleMapper<boolean>>): void;
assertExactMapper(WakeRoleMapper);

declare function assertValidOrder(arg: Readonly<WakeRole[]>): void;
assertValidOrder(NightWakeOrder);
