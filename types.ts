export enum ClassType {
  Fighter = 'Fighter',
  Wizard = 'Wizard',
  Rogue = 'Rogue',
  Cleric = 'Cleric',
  Paladin = 'Paladin',
  Ranger = 'Ranger',
  Barbarian = 'Barbarian',
  Bard = 'Bard',
  Druid = 'Druid',
  Monk = 'Monk',
  Sorcerer = 'Sorcerer',
  Warlock = 'Warlock'
}

export type Gender = 'Male' | 'Female' | 'Non-Binary';

export interface CharacterStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary';
export type ItemType = 'Weapon' | 'Armor' | 'Potion' | 'Scroll' | 'Wondrous';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number; // in GP
  description?: string;
  statModifiers?: Partial<CharacterStats>;
  acBonus?: number;
  damageDie?: number;
  isConsumable?: boolean;
}

export type SpellSchool = 'Evocation' | 'Abjuration' | 'Necromancy' | 'Divination' | 'Transmutation' | 'Enchantment' | 'Illusion' | 'Conjuration';

export interface Spell {
  name: string;
  level: number;
  school: SpellSchool;
  damage?: string; // e.g., "8d6"
  heal?: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  race: string;
  classType: ClassType;
  subclass: string;
  level: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  xp: number;
  stats: CharacterStats;
  color: string;
  bio: string;
  status: 'ALIVE' | 'UNCONSCIOUS' | 'DEAD';
  
  // New props
  gold: number;
  inventory: Item[];
  equipped: {
    armor?: Item;
    weapon?: Item;
  };
  knownSpells: Spell[];
  spellSlots: {
    [level: number]: { max: number; current: number };
  };
  resources: {
    [key: string]: { max: number; current: number }; // e.g. Rage, Action Surge
  };
  feats: string[];
  initiative: number;
  conditions: string[]; // "Raging", "Stunned"
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  ac: number;
  attackBonus: number;
  damageDie: number; // just max roll for simplicity in type, logic handles die
  damageStr: string; // "1d8 + 3"
  attackName: string; // "Bite", "Greataxe", etc.
  xpValue: number;
  cr: number;
  initiative: number;
  type: string;
}

export interface GameTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface LogEntry {
  id: string;
  gameTime: GameTime;
  message: string;
  type: 'BATTLE' | 'REST' | 'TRAVEL' | 'LEVEL_UP' | 'INFO' | 'LOOT' | 'SHOP';
}

export enum GamePhase {
  IDLE = 'IDLE',
  TRAVELING = 'TRAVELING',
  COMBAT = 'COMBAT',
  RESTING = 'RESTING',
  SHOPPING = 'SHOPPING'
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  isPlayer: boolean;
  currentHp: number;
  maxHp: number;
}

export interface GameState {
  party: Character[];
  enemies: Enemy[];
  logs: LogEntry[];
  phase: GamePhase;
  time: GameTime;
  location: string;
  autoPlay: boolean;
  initiativeOrder: string[]; // IDs of combatants in order
  activeTurnId: string | null;
}