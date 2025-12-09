import { Character, Enemy, GameState, LogEntry, GamePhase, ClassType, CharacterStats, GameTime, Spell, Item, Gender, ItemType } from "../types";
import { 
  LEVEL_XP, 
  MONTHS, 
  RACES, 
  CLASS_SUBCLASSES, 
  CLASS_COLORS, 
  ENEMIES_EXTENDED, 
  LOCATIONS_EXTENDED,
  NAME_PREFIXES,
  NAME_SUFFIXES,
  SPELLS,
  ITEMS,
  SPELL_SLOTS_FULL,
  FEATS
} from "../constants";

// --- Utilities ---
const d = (sides: number) => Math.floor(Math.random() * sides) + 1;
const uuid = () => Math.random().toString(36).substring(2, 9);
const getMod = (score: number) => Math.floor((score - 10) / 2);
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// --- Phonetic Name Generation ---
const generatePhoneticName = (): string => {
    const prefix = pick(NAME_PREFIXES);
    const suffix = pick(NAME_SUFFIXES);
    return prefix + suffix;
};

const generateFullName = (race: string): string => {
    const first = generatePhoneticName();
    const last = generatePhoneticName();
    
    // Race flavors
    if (race === 'Elf') return `${first} ${last}`;
    if (race === 'Dwarf') return `${first} ${last}${Math.random() > 0.5 ? 'hammer' : 'shield'}`;
    if (race === 'Orc') return `${first}'${last}`;
    if (race === 'Human') return `${first} ${last}`;
    
    return `${first} ${last}`;
};

const rollStats = (): CharacterStats => {
    const rollStat = () => Math.max(d(6)+d(6)+d(6), d(6)+d(6)+6); // Heroic rolls
    return {
        str: rollStat(), dex: rollStat(), con: rollStat(),
        int: rollStat(), wis: rollStat(), cha: rollStat()
    };
};

const getStarterGear = (classType: ClassType): { weapon: Item | undefined, armor: Item | undefined } => {
    // Helper to find item by name
    const find = (name: string) => ITEMS.find(i => i.name === name);
    
    let weapon, armor;

    switch (classType) {
        case ClassType.Fighter:
        case ClassType.Paladin:
            weapon = find("Longsword") || find("Greatsword");
            armor = find("Chain Mail");
            break;
        case ClassType.Barbarian:
            weapon = find("Greataxe");
            armor = undefined; // Unarmored Defense
            break;
        case ClassType.Rogue:
            weapon = find("Rapier") || find("Dagger");
            armor = find("Leather Armor");
            break;
        case ClassType.Ranger:
            weapon = find("Longbow") || find("Shortsword");
            armor = find("Scale Mail") || find("Leather Armor");
            break;
        case ClassType.Cleric:
            weapon = find("Mace");
            armor = find("Scale Mail");
            break;
        case ClassType.Druid:
            weapon = find("Staff") || find("Scimitar");
            armor = find("Leather Armor");
            break;
        case ClassType.Wizard:
        case ClassType.Sorcerer:
        case ClassType.Warlock:
            weapon = find("Staff") || find("Dagger");
            armor = find("Robes");
            break;
        case ClassType.Monk:
            weapon = find("Staff") || find("Shortsword");
            armor = undefined;
            break;
        case ClassType.Bard:
            weapon = find("Rapier");
            armor = find("Leather Armor");
            break;
    }

    return { weapon, armor };
};

export const generateRandomParty = (count: number = 4): Character[] => {
    return Array.from({ length: count }).map(() => {
        const race = pick(RACES);
        const clsKey = pick(Object.keys(ClassType));
        const classType = ClassType[clsKey as keyof typeof ClassType];
        const gender = pick<Gender>(['Male', 'Female', 'Non-Binary']);
        const name = generateFullName(race);
        const stats = rollStats();
        
        // Optimize Primary Stat
        if (classType === ClassType.Fighter || classType === ClassType.Barbarian) stats.str = Math.max(stats.str, 16);
        if (classType === ClassType.Rogue || classType === ClassType.Ranger || classType === ClassType.Monk) stats.dex = Math.max(stats.dex, 16);
        if (classType === ClassType.Wizard) stats.int = Math.max(stats.int, 16);
        if (classType === ClassType.Cleric || classType === ClassType.Druid) stats.wis = Math.max(stats.wis, 16);
        if (classType === ClassType.Paladin || classType === ClassType.Bard || classType === ClassType.Sorcerer || classType === ClassType.Warlock) stats.cha = Math.max(stats.cha, 16);

        const subclass = pick(CLASS_SUBCLASSES[clsKey] || ["Commoner"]);
        const color = CLASS_COLORS[clsKey] || "#000000";
        const hpBase = 12 + getMod(stats.con); // Start sturdy

        // Initial Spells
        const knownSpells: Spell[] = SPELLS.filter(s => s.level === 0).sort(() => 0.5 - Math.random()).slice(0, 3);
        const spellSlots: Record<number, {max: number, current: number}> = {};
        if (['Wizard','Cleric','Sorcerer','Bard','Druid'].includes(classType)) {
             spellSlots[1] = { max: 2, current: 2 };
        }
        if (classType === ClassType.Paladin || classType === ClassType.Ranger) {
            // Half casters get no slots at lvl 1 usually, but let's give paladin some flavor
        }

        // Resources
        const resources: Record<string, {max: number, current: number}> = {};
        if (classType === ClassType.Barbarian) resources["Rage"] = { max: 2, current: 2 };
        if (classType === ClassType.Fighter) resources["Action Surge"] = { max: 1, current: 1 };
        if (classType === ClassType.Paladin) resources["Lay on Hands"] = { max: 5, current: 5 };
        if (classType === ClassType.Cleric) resources["Channel Divinity"] = { max: 1, current: 1 };
        if (classType === ClassType.Monk) resources["Ki"] = { max: 1, current: 1 };

        // Gear
        const { weapon, armor } = getStarterGear(classType);
        const inventory: Item[] = [];
        if (weapon) inventory.push(weapon);
        if (armor) inventory.push(armor);
        // Potion
        inventory.push(pick(ITEMS.filter(i => i.type === 'Potion')));

        return {
            id: uuid(),
            name,
            gender,
            age: 18 + d(30),
            race,
            classType,
            subclass,
            level: 1,
            maxHp: hpBase,
            currentHp: hpBase,
            tempHp: 0,
            xp: 0,
            stats,
            color,
            bio: `${name} seeks glory.`,
            status: 'ALIVE',
            gold: d(20) + 10,
            inventory,
            equipped: { weapon, armor },
            knownSpells,
            spellSlots,
            resources,
            feats: [],
            initiative: 0,
            conditions: []
        };
    });
};

export const createInitialState = (): GameState => ({
  party: [],
  enemies: [],
  logs: [],
  phase: GamePhase.IDLE,
  time: { year: 1492, month: 0, day: 1, hour: 8, minute: 0 },
  location: "The Yawning Portal Inn",
  autoPlay: false,
  initiativeOrder: [],
  activeTurnId: null
});

const advanceTime = (time: GameTime, minutes: number): GameTime => {
    let newTime = { ...time };
    newTime.minute += minutes;
    if (newTime.minute % 1 !== 0) newTime.minute = Math.round(newTime.minute);
    
    while (newTime.minute >= 60) {
        newTime.minute -= 60;
        newTime.hour += 1;
    }
    while (newTime.hour >= 24) {
        newTime.hour -= 24;
        newTime.day += 1;
    }
    while (newTime.day > 30) {
        newTime.day -= 30;
        newTime.month += 1;
    }
    while (newTime.month >= 12) {
        newTime.month -= 12;
        newTime.year += 1;
    }
    return newTime;
};

// --- Logic ---

const getSpellSlotsForLevel = (cls: ClassType, lvl: number) => {
    // Full caster progression approx
    if (['Wizard','Cleric','Bard','Druid','Sorcerer'].includes(cls)) {
        return SPELL_SLOTS_FULL[Math.min(lvl, 10)];
    }
    // Half caster
    if (['Paladin','Ranger'].includes(cls)) {
        return SPELL_SLOTS_FULL[Math.floor(lvl/2)];
    }
    return [];
};

const handleLevelUp = (char: Character): string => {
    const hpGain = d(10) + getMod(char.stats.con);
    char.level += 1;
    char.maxHp += hpGain;
    char.currentHp = char.maxHp;
    
    // Ability Score / Feat
    if (char.level % 4 === 0) {
        if (Math.random() > 0.5) {
             const feat = pick(FEATS.filter(f => !char.feats.includes(f)));
             if (feat) {
                 char.feats.push(feat);
                 return `${char.name} learned feat: ${feat}!`;
             }
        }
        // Stats
        char.stats.str++; char.stats.dex++;
    }

    // Spells
    const slots = getSpellSlotsForLevel(char.classType, char.level);
    if (slots && slots.length > 0) {
        slots.forEach((count, idx) => {
            const spellLvl = idx + 1;
            if (count > 0) {
                if (!char.spellSlots[spellLvl]) char.spellSlots[spellLvl] = { max: 0, current: 0 };
                char.spellSlots[spellLvl].max = count;
                char.spellSlots[spellLvl].current = count;
                
                // Learn spell
                const learnable = SPELLS.filter(s => s.level === spellLvl && !char.knownSpells.find(k => k.name === s.name));
                if (learnable.length > 0) char.knownSpells.push(pick(learnable));
            }
        });
    }

    // Resources
    if (char.classType === ClassType.Barbarian) char.resources["Rage"].max = Math.floor(char.level / 3) + 2;
    if (char.classType === ClassType.Monk) char.resources["Ki"].max = char.level;
    if (char.classType === ClassType.Paladin) char.resources["Lay on Hands"].max = char.level * 5;
    
    return `${char.name} reached level ${char.level}!`;
};

const startCombat = (state: GameState): GameState => {
    state.phase = GamePhase.COMBAT;
    
    // Generate Enemies
    const partyLevel = Math.max(1, state.party.reduce((acc, c) => acc + c.level, 0) / state.party.length);
    const minCr = Math.max(0.125, partyLevel / 4);
    const maxCr = Math.max(1, partyLevel + 3);
    const validEnemies = ENEMIES_EXTENDED.filter(e => {
        const cr = e.cr || 0.125;
        return cr >= minCr && cr <= maxCr;
    });
    
    const count = d(Math.min(6, Math.max(1, partyLevel / 2))) + 1;
    state.enemies = Array.from({ length: count }).map(() => {
        const t = pick(validEnemies);
        const cr = t.cr || 0.25;
        const hp = Math.floor((d(8)+d(8)+10) * (cr > 0 ? cr : 0.5) * 1.5);
        return {
            id: uuid(),
            name: t.name || "Enemy",
            maxHp: hp,
            currentHp: hp,
            ac: 10 + Math.floor(cr/2),
            attackBonus: 3 + Math.floor(cr),
            damageDie: 6,
            damageStr: `${Math.floor(cr)}d6 + ${Math.floor(cr)}`,
            attackName: t.attackName || "Attack",
            xpValue: Math.floor(cr * 200) + 50,
            cr: cr,
            initiative: d(20),
            type: t.type || "Monster"
        };
    });

    // Roll Initiative
    const combatants = [
        ...state.party.map(c => ({ id: c.id, init: d(20) + getMod(c.stats.dex) })),
        ...state.enemies.map(e => ({ id: e.id, init: e.initiative }))
    ].sort((a, b) => b.init - a.init);

    state.initiativeOrder = combatants.map(c => c.id);
    state.activeTurnId = state.initiativeOrder[0];
    
    // Update party initiative for display
    state.party.forEach(c => {
        const entry = combatants.find(x => x.id === c.id);
        if (entry) c.initiative = entry.init;
    });

    state.logs.unshift({
        id: uuid(),
        gameTime: state.time,
        message: `Combat Started! Initiative rolled. ${state.enemies.length} hostiles appear.`,
        type: 'BATTLE'
    });

    return state;
};

// --- Combat Turn Logic ---
const executeTurn = (state: GameState, actorId: string): string => {
    const actorChar = state.party.find(c => c.id === actorId);
    const actorEnemy = state.enemies.find(e => e.id === actorId);
    let log = "";

    if (actorChar) {
        if (actorChar.status !== 'ALIVE') return ""; // Skip
        
        // Pick Target
        const target = pick(state.enemies);
        if (!target) return ""; // Won
        
        let actionTaken = false;

        // 1. Buff / Feature Check
        if (actorChar.classType === ClassType.Barbarian) {
            const rage = actorChar.resources["Rage"];
            if (!actorChar.conditions.includes("Raging") && rage && rage.current > 0) {
                rage.current--;
                actorChar.conditions.push("Raging");
                log += `${actorChar.name} enters a Rage! `;
            }
        }
        if (actorChar.classType === ClassType.Fighter) {
            const surge = actorChar.resources["Action Surge"];
            if (surge && surge.current > 0 && Math.random() > 0.8) {
                surge.current--;
                log += `${actorChar.name} uses Action Surge! `;
                actionTaken = true; 
            }
        }

        // 2. Spellcasting
        const canCast = actorChar.spellSlots && Object.values(actorChar.spellSlots).some(s => s.current > 0);
        if (canCast && Math.random() > 0.4) {
             const levels = Object.keys(actorChar.spellSlots).map(Number).sort((a,b) => b-a);
             for (const lvl of levels) {
                 if (actorChar.spellSlots[lvl].current > 0) {
                     const spells = actorChar.knownSpells.filter(s => s.level === lvl);
                     if (spells.length > 0) {
                         const spell = pick(spells);
                         actorChar.spellSlots[lvl].current--;
                         
                         // Effect
                         if (spell.heal) {
                             const targetAlly = state.party.reduce((prev, curr) => (curr.currentHp < prev.currentHp) ? curr : prev);
                             const healAmt = d(8) + d(8) + getMod(actorChar.stats.wis);
                             targetAlly.currentHp = Math.min(targetAlly.maxHp, targetAlly.currentHp + healAmt);
                             if (targetAlly.status !== 'ALIVE') targetAlly.status = 'ALIVE';
                             log += `${actorChar.name} casts ${spell.name} on ${targetAlly.name} (+${healAmt} HP). `;
                         } else {
                             // Damage
                             const dmg = d(8) * lvl + getMod(actorChar.stats.int);
                             target.currentHp -= dmg;
                             log += `${actorChar.name} casts ${spell.name} on ${target.name} for ${dmg} damage. `;
                         }
                         actionTaken = true;
                         break;
                     }
                 }
             }
        }

        // 3. Attack (if didn't cast or if action surge)
        if (!actionTaken || log.includes("Action Surge")) {
            const weapon = actorChar.equipped.weapon;
            const hitBonus = 2 + Math.floor(actorChar.level/4) + getMod(actorChar.stats.str) + (weapon && weapon.statModifiers?.str ? 1 : 0);
            const ac = target.ac;
            const roll = d(20);
            
            if (roll + hitBonus >= ac) {
                let die = weapon?.damageDie || 4; // default unarmed 4 for simplicity
                let dmg = d(die) + getMod(actorChar.stats.str);
                if (actorChar.conditions.includes("Raging")) dmg += 2;
                if (actorChar.classType === ClassType.Rogue) dmg += d(6) * Math.ceil(actorChar.level/2);
                
                target.currentHp -= dmg;
                log += `${actorChar.name} hits ${target.name} with ${weapon?.name || 'fists'} for ${dmg} damage. `;
            } else {
                log += `${actorChar.name} swings ${weapon?.name || 'fists'} at ${target.name} but misses. `;
            }
        }

        // Check Kill
        if (target.currentHp <= 0) {
            log += `${target.name} is defeated! `;
            actorChar.xp += target.xpValue;
            state.enemies = state.enemies.filter(e => e.id !== target.id);
        }

    } else if (actorEnemy) {
        // Enemy Logic
        const target = pick(state.party.filter(p => p.status === 'ALIVE'));
        if (target) {
            const hit = d(20) + actorEnemy.attackBonus;
            const ac = 12 + getMod(target.stats.dex) + (target.equipped.armor ? (target.equipped.armor.acBonus || 0) : 0);
            
            if (hit >= ac) {
                const dmg = d(actorEnemy.damageDie) + Math.max(0, Math.floor(actorEnemy.cr));
                let actualDmg = dmg;
                // Resistances
                if (target.conditions.includes("Raging")) actualDmg = Math.floor(dmg / 2);
                
                target.currentHp -= actualDmg;
                log += `${actorEnemy.name} uses ${actorEnemy.attackName} on ${target.name} for ${actualDmg} damage. `;
                
                if (target.currentHp <= 0) {
                    target.currentHp = 0;
                    target.status = 'UNCONSCIOUS';
                    target.conditions = target.conditions.filter(c => c !== "Raging"); // Lose rage
                    log += `${target.name} falls unconscious! `;
                }
            } else {
                 log += `${actorEnemy.name} attacks ${target.name} with ${actorEnemy.attackName} but misses. `;
            }
        }
    }
    return log;
};


// --- Main Process ---
export const processGameTick = async (state: GameState): Promise<GameState> => {
    const nextState = { ...state };
    let logMsg = "";
    
    // Level Up Check
    nextState.party.forEach(char => {
        const nextXp = LEVEL_XP[char.level];
        if (nextXp && char.xp >= nextXp) {
            const msg = handleLevelUp(char);
            nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: msg, type: 'LEVEL_UP' });
        }
    });

    if (nextState.phase === GamePhase.COMBAT) {
        if (nextState.enemies.length === 0) {
            nextState.phase = GamePhase.TRAVELING;
            nextState.party.forEach(c => c.conditions = c.conditions.filter(x => x !== "Raging"));
            // Loot
            const goldFound = d(50) * Math.max(1, nextState.party[0].level);
            // More interesting loot chance
            const lootTable = ITEMS.filter(i => i.rarity !== 'Common' && i.value > 100);
            const foundItem = Math.random() > 0.6 ? pick(lootTable) : null;
            
            nextState.party.forEach(c => c.gold += Math.floor(goldFound / nextState.party.length));
            let lootMsg = `Victory! Party finds ${goldFound} GP.`;
            
            if (foundItem) {
                const luckyChar = pick(nextState.party);
                luckyChar.inventory.push(foundItem);
                lootMsg += ` ${luckyChar.name} found ${foundItem.name}!`;
                
                // Auto Equip check - smart logic
                if (foundItem.type === 'Weapon') {
                    const currentDmg = luckyChar.equipped.weapon?.damageDie || 0;
                    if ((foundItem.damageDie || 0) > currentDmg) {
                         luckyChar.equipped.weapon = foundItem;
                         lootMsg += " (Equipped)";
                    }
                }
                if (foundItem.type === 'Armor') {
                     // Only equip if proficient (simplified: checking class roughly by current armor)
                     if (luckyChar.equipped.armor && (foundItem.acBonus || 0) > (luckyChar.equipped.armor.acBonus || 0)) {
                         // Check heavy armor
                         if (foundItem.description?.includes("Heavy") && ['Fighter','Paladin','Cleric'].includes(luckyChar.classType)) {
                             luckyChar.equipped.armor = foundItem;
                             lootMsg += " (Equipped)";
                         } else if (!foundItem.description?.includes("Heavy")) {
                             luckyChar.equipped.armor = foundItem;
                             lootMsg += " (Equipped)";
                         }
                     }
                }
            }
            
            nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: lootMsg, type: 'LOOT' });
            return nextState;
        }

        // Process Turn
        if (!nextState.activeTurnId) nextState.activeTurnId = nextState.initiativeOrder[0];
        
        const turnLog = executeTurn(nextState, nextState.activeTurnId);
        if (turnLog) {
            nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: turnLog, type: 'BATTLE' });
        }
        
        // Cycle Turn
        const currIdx = nextState.initiativeOrder.indexOf(nextState.activeTurnId);
        let nextIdx = (currIdx + 1) % nextState.initiativeOrder.length;
        
        // Filter dead combatants from order implicitly by checking existence next cycle
        let loops = 0;
        while (loops < nextState.initiativeOrder.length) {
            const nextId = nextState.initiativeOrder[nextIdx];
            const exists = nextState.party.some(p => p.id === nextId && p.status === 'ALIVE') || nextState.enemies.some(e => e.id === nextId);
            if (exists) {
                nextState.activeTurnId = nextId;
                break;
            }
            nextIdx = (nextIdx + 1) % nextState.initiativeOrder.length;
            loops++;
        }
        
        // Time moves slower in combat
        nextState.time = advanceTime(nextState.time, 0.1); 

    } else if (nextState.phase === GamePhase.TRAVELING) {
        nextState.time = advanceTime(nextState.time, 30); // 30 mins

        // Random Event
        const roll = Math.random();
        if (roll < 0.05) {
            return startCombat(nextState);
        } else if (roll < 0.08) {
            // Shop / Town
            if (Math.random() > 0.5) {
                 nextState.phase = GamePhase.SHOPPING;
                 nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: `The party arrives at a settlement.`, type: 'SHOP' });
            } else {
                 nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: `The party travels through ${nextState.location}.`, type: 'TRAVEL' });
            }
        }
        
        // Night
        if (nextState.time.hour >= 22) {
            nextState.phase = GamePhase.RESTING;
            nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: "Night falls. Long rest started.", type: 'REST' });
        }

    } else if (nextState.phase === GamePhase.SHOPPING) {
         nextState.time = advanceTime(nextState.time, 60);
         // Buy Stuff
         nextState.party.forEach(c => {
             if (c.gold > 50 && c.currentHp < c.maxHp) {
                 c.gold -= 50;
                 c.currentHp = Math.min(c.maxHp, c.currentHp + 10); // Potion
             }
             if (c.gold > 500 && !c.equipped.weapon) {
                 const weapon = ITEMS.find(i => i.type === 'Weapon' && i.rarity === 'Uncommon');
                 if (weapon) {
                     c.gold -= weapon.value;
                     c.inventory.push(weapon);
                     c.equipped.weapon = weapon;
                     logMsg += `${c.name} bought ${weapon.name}. `;
                 }
             }
         });
         if (logMsg) nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: logMsg, type: 'SHOP' });
         
         if (Math.random() > 0.8) nextState.phase = GamePhase.TRAVELING;

    } else if (nextState.phase === GamePhase.RESTING) {
        nextState.time = advanceTime(nextState.time, 60 * 8);
        nextState.party.forEach(c => {
            if (c.status !== 'DEAD') {
                c.currentHp = c.maxHp;
                c.status = 'ALIVE';
                c.conditions = [];
                // Restore resources
                Object.keys(c.resources).forEach(k => c.resources[k].current = c.resources[k].max);
                Object.keys(c.spellSlots).forEach(k => c.spellSlots[parseInt(k)].current = c.spellSlots[parseInt(k)].max);
            }
        });
        nextState.phase = GamePhase.TRAVELING;
        nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: "Morning breaks. The party is refreshed.", type: 'REST' });
    }

    // Party Death
    if (nextState.party.every(p => p.status !== 'ALIVE')) {
        nextState.autoPlay = false;
        nextState.logs.unshift({ id: uuid(), gameTime: nextState.time, message: "GAME OVER. The party has fallen.", type: 'INFO' });
    }

    return nextState;
};