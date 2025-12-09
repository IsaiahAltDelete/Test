import React from 'react';
import { Item, Spell, Enemy } from './types';

// Icons remain the same...
export const ClassIcons: Record<string, React.ReactNode> = {
  Fighter: <path d="M14.5 17.5L3 6V3h3l11.5 11.5-3 3zM13 13l4-4" stroke="currentColor" strokeWidth="2" fill="none" />,
  Wizard: <path d="M12 2l-2 7 5-2-5 2v13M7 9l5-2" stroke="currentColor" strokeWidth="2" fill="none" />,
  Rogue: <path d="M19 12l-7 7-7-7 7-7 7 7zM12 7v10" stroke="currentColor" strokeWidth="2" fill="none" />,
  Cleric: <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" fill="none" />,
  Barbarian: <path d="M7 21L12 3l5 18M3 10h18" stroke="currentColor" strokeWidth="2" fill="none" />,
  Paladin: <path d="M12 2v20M6 8h12M8 21l8-15" stroke="currentColor" strokeWidth="2" fill="none" />,
  Ranger: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none" />,
  Bard: <path d="M9 18V5l12-2v13M9 9a5 5 0 0 1 5 5M6 18h3" stroke="currentColor" strokeWidth="2" fill="none" />,
  Druid: <path d="M12 3l-6 18h12L12 3zM12 12v6" stroke="currentColor" strokeWidth="2" fill="none" />,
  Monk: <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="2" fill="none" />,
  Sorcerer: <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" stroke="currentColor" strokeWidth="2" fill="none" />,
  Warlock: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="2" fill="none" />,
  Default: <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
};

export const LEVEL_XP = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

export const MONTHS = [
  "Hammer", "Alturiak", "Ches", "Tarsakh", "Mirtul", "Kythorn",
  "Flamerule", "Eleasis", "Eleint", "Marpenoth", "Uktar", "Nightal"
];

// Phonetic Generation
export const NAME_PREFIXES = [
  "Aer", "Bae", "Cael", "Dra", "Eil", "Fae", "Gael", "Hae", "Ia", "Jae", "Kael", "Lae", "Mae", "Nae", "Oel", "Pae", "Qua", "Rae", "Sae", "Tae", "Uel", "Vae", "Wae", "Xae", "Yae", "Zae",
  "Ald", "Bri", "Cor", "Dur", "Eld", "Fin", "Grim", "Har", "Is", "Jor", "Kar", "Lor", "Mor", "Nor", "Or", "Par", "Quin", "Ror", "Syl", "Tor", "Ul", "Val", "Wil", "Xor", "Yor", "Zor"
];
export const NAME_SUFFIXES = [
  "a", "ae", "ai", "ia", "ea", "ua", "oa",
  "us", "os", "is", "as", "es",
  "on", "an", "en", "in", "un",
  "ar", "er", "ir", "or", "ur",
  "th", "the", "tha", "tho", "thu",
  "dor", "mir", "las", "ian", "ius", "win", "don", "lor", "mar", "nor", "ros", "sian", "tas", "var", "zan"
];


export const RACES = ["Human", "Elf", "Dwarf", "Halfling", "Orc", "Tiefling", "Dragonborn", "Gnome", "Half-Elf", "Aasimar", "Goliath", "Tabaxi", "Genasi"];

export const CLASS_SUBCLASSES: Record<string, string[]> = {
    Fighter: ["Champion", "Battle Master", "Eldritch Knight", "Samurai"],
    Wizard: ["Evocation", "Abjuration", "Necromancy", "Divination", "Transmutation", "War Magic"],
    Rogue: ["Thief", "Assassin", "Arcane Trickster", "Scout", "Swashbuckler"],
    Cleric: ["Life", "War", "Light", "Tempest", "Trickery", "Grave", "Forge"],
    Barbarian: ["Berserker", "Totem Warrior", "Ancestral Guardian", "Zealot"],
    Paladin: ["Devotion", "Vengeance", "Ancients", "Conquest"],
    Ranger: ["Hunter", "Beast Master", "Gloom Stalker", "Monster Slayer"],
    Bard: ["Lore", "Valor", "Glamour", "Swords"],
    Druid: ["Land", "Moon", "Spores", "Shepherd"],
    Monk: ["Open Hand", "Shadow", "Four Elements", "Kensei"],
    Sorcerer: ["Draconic", "Wild Magic", "Shadow", "Divine Soul"],
    Warlock: ["Fiend", "Archfey", "Great Old One", "Hexblade"]
};

export const CLASS_COLORS: Record<string, string> = {
  Fighter: "#A93226", 
  Wizard: "#2E86C1", 
  Rogue: "#5d6d7e", 
  Cleric: "#F1C40F", 
  Barbarian: "#E74C3C", 
  Paladin: "#F39C12", 
  Ranger: "#27AE60", 
  Bard: "#8E44AD", 
  Druid: "#1E8449", 
  Monk: "#3498DB", 
  Sorcerer: "#C0392B", 
  Warlock: "#884EA0"
};

export const FEATS = [
    "Alert", "Athlete", "Actor", "Charger", "Crossbow Expert", "Defensive Duelist", "Dual Wielder", 
    "Dungeon Delver", "Durable", "Elemental Adept", "Grappler", "Great Weapon Master", "Healer", 
    "Heavily Armored", "Heavy Armor Master", "Inspiring Leader", "Keen Mind", "Lightly Armored", 
    "Lucky", "Mage Slayer", "Magic Initiate", "Martial Adept", "Medium Armor Master", "Mobile", 
    "Moderately Armored", "Mounted Combatant", "Observant", "Polearm Master", "Resilient", 
    "Ritual Caster", "Savage Attacker", "Sentinel", "Sharpshooter", "Shield Master", "Skilled", 
    "Skulker", "Spell Sniper", "Tavern Brawler", "Tough", "War Caster", "Weapon Master"
];

// Simplified Spell Slots Table (Full Caster)
export const SPELL_SLOTS_FULL: number[][] = [
    [0,0,0,0,0,0,0,0,0], // Lvl 0
    [2,0,0,0,0,0,0,0,0], // Lvl 1
    [3,0,0,0,0,0,0,0,0], // Lvl 2
    [4,2,0,0,0,0,0,0,0], // Lvl 3
    [4,3,0,0,0,0,0,0,0], // Lvl 4
    [4,3,2,0,0,0,0,0,0], // Lvl 5
    [4,3,3,0,0,0,0,0,0], // Lvl 6
    [4,3,3,1,0,0,0,0,0], // Lvl 7
    [4,3,3,2,0,0,0,0,0], // Lvl 8
    [4,3,3,3,1,0,0,0,0], // Lvl 9
    [4,3,3,3,2,0,0,0,0], // Lvl 10
];

export const SPELLS: Spell[] = [
    // Cantrips
    { name: "Fire Bolt", level: 0, school: "Evocation", damage: "1d10", description: "Hurls a mote of fire." },
    { name: "Sacred Flame", level: 0, school: "Evocation", damage: "1d8", description: "Flame-like radiance descends." },
    { name: "Eldritch Blast", level: 0, school: "Evocation", damage: "1d10", description: "A beam of crackling energy." },
    { name: "Vicious Mockery", level: 0, school: "Enchantment", damage: "1d4", description: "Insults laced with magic." },
    { name: "Ray of Frost", level: 0, school: "Evocation", damage: "1d8", description: "A frigid beam of blue-white light." },
    { name: "Minor Illusion", level: 0, school: "Illusion", description: "Create a sound or image." },
    { name: "Prestidigitation", level: 0, school: "Transmutation", description: "Minor magical tricks." },
    
    // Level 1
    { name: "Magic Missile", level: 1, school: "Evocation", damage: "3d4+3", description: "Three glowing darts." },
    { name: "Cure Wounds", level: 1, school: "Evocation", heal: "1d8+Wis", description: "A creature you touch regains hit points." },
    { name: "Burning Hands", level: 1, school: "Evocation", damage: "3d6", description: "A thin sheet of flames." },
    { name: "Guiding Bolt", level: 1, school: "Evocation", damage: "4d6", description: "A flash of light streaks toward a creature." },
    { name: "Shield", level: 1, school: "Abjuration", description: "+5 AC Reaction." },
    { name: "Inflict Wounds", level: 1, school: "Necromancy", damage: "3d10", description: "Necrotic touch." },
    { name: "Thunderwave", level: 1, school: "Evocation", damage: "2d8", description: "Wave of thunderous force." },
    { name: "Sleep", level: 1, school: "Enchantment", description: "Puts creatures to sleep." },
    
    // Level 2
    { name: "Scorching Ray", level: 2, school: "Evocation", damage: "2d6", description: "Three rays of fire." },
    { name: "Misty Step", level: 2, school: "Conjuration", description: "Teleport 30 feet." },
    { name: "Shatter", level: 2, school: "Evocation", damage: "3d8", description: "A sudden loud ringing noise." },
    { name: "Hold Person", level: 2, school: "Enchantment", description: "Paralyzes a humanoid." },
    { name: "Invisibility", level: 2, school: "Illusion", description: "Touched creature becomes invisible." },
    
    // Level 3
    { name: "Fireball", level: 3, school: "Evocation", damage: "8d6", description: "A bright streak flashes to a huge explosion." },
    { name: "Lightning Bolt", level: 3, school: "Evocation", damage: "8d6", description: "A stroke of lightning." },
    { name: "Revivify", level: 3, school: "Necromancy", description: "Returns life to a creature." },
    { name: "Haste", level: 3, school: "Transmutation", description: "Double speed, +2 AC." },
    { name: "Counterspell", level: 3, school: "Abjuration", description: "Interrupts a spell." },
    
    // Level 4
    { name: "Blight", level: 4, school: "Necromancy", damage: "8d8", description: "Drains moisture and vitality." },
    { name: "Dimension Door", level: 4, school: "Conjuration", description: "Teleport 500 feet." },
    { name: "Polymorph", level: 4, school: "Transmutation", description: "Transforms a creature." },
    
    // Level 5
    { name: "Cone of Cold", level: 5, school: "Evocation", damage: "8d8", description: "A blast of cold air." },
    { name: "Mass Cure Wounds", level: 5, school: "Evocation", heal: "3d8+Wis", description: "Healing wave." },
    { name: "Flame Strike", level: 5, school: "Evocation", damage: "4d6+4d6", description: "Divine fire pillar." }
];

export const ITEMS: Item[] = [
    // Potions & Scrolls
    { id: "1", name: "Potion of Healing", type: "Potion", rarity: "Common", value: 50, isConsumable: true, description: "Regain 2d4+2 HP." },
    { id: "2", name: "Scroll of Revivify", type: "Scroll", rarity: "Rare", value: 300, isConsumable: true },
    { id: "9", name: "Potion of Greater Healing", type: "Potion", rarity: "Uncommon", value: 150, isConsumable: true, description: "Regain 4d4+4 HP." },
    { id: "10", name: "Potion of Invisibility", type: "Potion", rarity: "Uncommon", value: 200, isConsumable: true, description: "Become invisible for 1 hr." },
    
    // Magic Items
    { id: "3", name: "+1 Longsword", type: "Weapon", rarity: "Uncommon", value: 500, damageDie: 8, acBonus: 0, description: "Magic Sword +1" },
    { id: "4", name: "Bag of Holding", type: "Wondrous", rarity: "Uncommon", value: 400, description: "Holds 500 lbs." },
    { id: "5", name: "Ring of Protection", type: "Wondrous", rarity: "Rare", value: 3500, acBonus: 1, description: "+1 AC and Saves" },
    { id: "6", name: "Sunblade", type: "Weapon", rarity: "Rare", value: 5000, damageDie: 8, description: "Blade of pure radiance." },
    { id: "7", name: "Vorpal Sword", type: "Weapon", rarity: "Legendary", value: 50000, damageDie: 10, description: "Snicker-snack!" },
    { id: "8", name: "Mithral Plate", type: "Armor", rarity: "Uncommon", value: 2000, acBonus: 18, description: "No stealth disadvantage." },
    { id: "11", name: "Boots of Speed", type: "Wondrous", rarity: "Rare", value: 4000, description: "Doubles walking speed." },
    { id: "12", name: "Wand of Magic Missiles", type: "Wondrous", rarity: "Uncommon", value: 300, description: "Casts Magic Missile." },
    { id: "13", name: "Cloak of Elvenkind", type: "Wondrous", rarity: "Uncommon", value: 400, description: "Advantage on Stealth." },
    { id: "14", name: "Flame Tongue Greatsword", type: "Weapon", rarity: "Rare", value: 4000, damageDie: 12, description: "+2d6 Fire damage." },
    { id: "15", name: "Amulet of Health", type: "Wondrous", rarity: "Rare", value: 4000, description: "Sets CON to 19." },
    
    // Starter Gear (IDs 100+)
    { id: "100", name: "Longsword", type: "Weapon", rarity: "Common", value: 15, damageDie: 8, description: "Versatile slashing." },
    { id: "101", name: "Shortsword", type: "Weapon", rarity: "Common", value: 10, damageDie: 6, description: "Finesse, light." },
    { id: "102", name: "Dagger", type: "Weapon", rarity: "Common", value: 2, damageDie: 4, description: "Finesse, light, thrown." },
    { id: "103", name: "Greataxe", type: "Weapon", rarity: "Common", value: 30, damageDie: 12, description: "Heavy, two-handed." },
    { id: "104", name: "Greatsword", type: "Weapon", rarity: "Common", value: 50, damageDie: 12, description: "Heavy, two-handed." },
    { id: "105", name: "Longbow", type: "Weapon", rarity: "Common", value: 50, damageDie: 8, description: "Ammunition, heavy, two-handed." },
    { id: "106", name: "Mace", type: "Weapon", rarity: "Common", value: 5, damageDie: 6, description: "Simple bludgeoning." },
    { id: "107", name: "Staff", type: "Weapon", rarity: "Common", value: 5, damageDie: 6, description: "Arcane focus." },
    { id: "108", name: "Rapier", type: "Weapon", rarity: "Common", value: 25, damageDie: 8, description: "Finesse." },
    
    { id: "120", name: "Chain Mail", type: "Armor", rarity: "Common", value: 75, acBonus: 16, description: "Heavy armor." },
    { id: "121", name: "Leather Armor", type: "Armor", rarity: "Common", value: 10, acBonus: 11, description: "Light armor." },
    { id: "122", name: "Scale Mail", type: "Armor", rarity: "Common", value: 50, acBonus: 14, description: "Medium armor." },
    { id: "123", name: "Plate Armor", type: "Armor", rarity: "Common", value: 1500, acBonus: 18, description: "Heavy armor." },
    { id: "124", name: "Studded Leather", type: "Armor", rarity: "Common", value: 45, acBonus: 12, description: "Light armor." },
    { id: "125", name: "Robes", type: "Armor", rarity: "Common", value: 1, acBonus: 10, description: "Cloth robes." },
];

export const LOCATIONS_EXTENDED = [
    "The Whispering Woods", "Caves of Chaos", "Ruins of Myth Drannor", "The Sunless Citadel",
    "Ravenloft Mist", "The High Road", "Baldur's Gate", "Waterdeep", "Neverwinter",
    "The Underdark", "Icewind Dale", "Chult Jungles", "Barovia", "The Shadowfell",
    "The Feywild", "City of Brass", "Sigil", "Candlekeep", "Ten-Towns",
    "Red Larch", "Phandalin", "Yartar", "Triboar", "Silverymoon", 
    "The Sword Coast", "Anauroch Desert", "Menzoberranzan", "Skullport"
];

export const ENEMIES_EXTENDED: Partial<Enemy>[] = [
    // Beasts
    { name: "Giant Rat", cr: 0.125, type: "Beast", attackName: "Bite" }, 
    { name: "Wolf", cr: 0.25, type: "Beast", attackName: "Bite" },
    { name: "Dire Wolf", cr: 1, type: "Beast", attackName: "Bite" },
    { name: "Brown Bear", cr: 1, type: "Beast", attackName: "Claws" },
    { name: "Giant Spider", cr: 1, type: "Beast", attackName: "Bite" },
    { name: "Owlbear", cr: 3, type: "Monstrosity", attackName: "Beak" },
    
    // Humanoids
    { name: "Kobold", cr: 0.125, type: "Humanoid", attackName: "Dagger" }, 
    { name: "Goblin", cr: 0.25, type: "Humanoid", attackName: "Scimitar" },
    { name: "Bandit", cr: 0.125, type: "Humanoid", attackName: "Scimitar" },
    { name: "Orc", cr: 0.5, type: "Humanoid", attackName: "Greataxe" }, 
    { name: "Gnoll", cr: 0.5, type: "Humanoid", attackName: "Spear" },
    { name: "Hobgoblin", cr: 0.5, type: "Humanoid", attackName: "Longsword" }, 
    { name: "Bugbear", cr: 1, type: "Humanoid", attackName: "Morningstar" },
    { name: "Bandit Captain", cr: 2, type: "Humanoid", attackName: "Greatsword" },
    { name: "Cult Fanatic", cr: 2, type: "Humanoid", attackName: "Inflict Wounds" },
    { name: "Evil Mage", cr: 3, type: "Humanoid", attackName: "Fireball" },
    
    // Undead
    { name: "Skeleton", cr: 0.25, type: "Undead", attackName: "Shortbow" }, 
    { name: "Zombie", cr: 0.25, type: "Undead", attackName: "Slam" },
    { name: "Ghoul", cr: 1, type: "Undead", attackName: "Claws" },
    { name: "Wight", cr: 3, type: "Undead", attackName: "Longsword" },
    { name: "Wraith", cr: 5, type: "Undead", attackName: "Life Drain" },
    { name: "Lich", cr: 21, type: "Undead", attackName: "Power Word Kill" },
    
    // Monsters
    { name: "Ogre", cr: 2, type: "Giant", attackName: "Greatclub" }, 
    { name: "Mimic", cr: 2, type: "Monstrosity", attackName: "Pseudopod" },
    { name: "Troll", cr: 5, type: "Giant", attackName: "Claw" },
    { name: "Mind Flayer", cr: 7, type: "Aberration", attackName: "Mind Blast" }, 
    { name: "Hydra", cr: 8, type: "Monstrosity", attackName: "Multiattack" }, 
    { name: "Young Red Dragon", cr: 10, type: "Dragon", attackName: "Fire Breath" }
];