import React from 'react';
import { Character, Spell } from '../types';
import { ClassIcons, LEVEL_XP } from '../constants';

interface Props {
  character: Character;
}

const StatBlock = ({ label, value }: { label: string, value: number }) => (
  <div className="flex flex-col items-center border-r last:border-r-0 border-gray-200 px-1">
    <span className="text-[8px] uppercase font-black text-gray-400 tracking-wider">{label}</span>
    <span className="text-sm font-black font-mono">{value}</span>
  </div>
);

const CharacterCard: React.FC<Props> = ({ character }) => {
  const hpPercent = (character.currentHp / character.maxHp) * 100;
  
  const nextXp = LEVEL_XP[character.level] || 999999;
  const prevXp = LEVEL_XP[character.level - 1] || 0;
  const xpPercent = ((character.xp - prevXp) / (nextXp - prevXp)) * 100;

  // Group spells by level
  const spellsByLevel = character.knownSpells.reduce((acc, spell) => {
    if (!acc[spell.level]) acc[spell.level] = [];
    acc[spell.level].push(spell);
    return acc;
  }, {} as Record<number, Spell[]>);

  const sortedLevels = Object.keys(spellsByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className={`relative border-2 ${character.currentHp <= 0 ? 'border-gray-400 opacity-60 grayscale' : 'border-black'} bg-white flex flex-col transition-all hover:-translate-y-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] h-full`}>
      
      {/* Background Icon Watermark */}
      <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none overflow-hidden h-full w-full flex items-end justify-end">
        <div className="transform translate-x-10 translate-y-10 scale-[2.5] text-black">
             {ClassIcons[character.classType] || ClassIcons.Default}
        </div>
      </div>

      {/* Card Header */}
      <div className="p-3 border-b-2 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: character.color }}></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <h2 className="text-xl font-black uppercase leading-none tracking-tight text-black mix-blend-multiply mb-1">
                    {character.name}
                </h2>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-700">
                    <span className="bg-black text-white px-1.5 py-0.5">{character.level}</span>
                    <span>{character.race} {character.classType}</span>
                    <span className="text-gray-500">/ {character.subclass}</span>
                </div>
            </div>
             <div className="flex flex-col items-center justify-center bg-white border-2 border-black p-1 w-10 h-10 shadow-sm">
                <span className="text-[8px] font-bold uppercase leading-none text-gray-400">AC</span>
                <span className="text-lg font-black leading-none">
                    {10 + Math.floor((character.stats.dex - 10)/2) + (character.equipped.armor?.acBonus || 0)}
                </span>
            </div>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="flex flex-col border-b-2 border-black">
          {/* HP Bar */}
          <div className="h-5 bg-gray-100 relative w-full border-b border-black">
            <div 
                className="h-full transition-all duration-300 ease-out flex items-center justify-end px-1"
                style={{ width: `${hpPercent}%`, backgroundColor: hpPercent < 30 ? '#EF4444' : character.color }}
            />
             <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-black text-black mix-blend-multiply uppercase tracking-widest">
                <span>Health</span>
                <span>{character.currentHp} / {character.maxHp}</span>
            </div>
          </div>
          {/* XP Bar */}
          <div className="h-1.5 bg-gray-200 relative w-full">
            <div className="h-full bg-yellow-400" style={{ width: `${Math.min(100, xpPercent)}%` }} />
          </div>
      </div>

      {/* Main Content */}
      <div className="p-3 flex-grow flex flex-col gap-3 relative z-10">
        
        {/* Conditions Badge */}
        {character.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1">
                {character.conditions.map(c => (
                    <span key={c} className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{c}</span>
                ))}
            </div>
        )}

        {/* Resources & Slots Grid */}
        {(Object.keys(character.resources).length > 0 || Object.keys(character.spellSlots).length > 0) && (
            <div className="bg-gray-50 border border-black p-2 flex flex-col gap-2">
                
                {/* Class Resources */}
                {Object.keys(character.resources).length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {Object.entries(character.resources).map(([name, res]) => (
                            <div key={name} className="flex flex-col">
                                <span className="text-[8px] uppercase font-bold text-gray-500">{name}</span>
                                <div className="flex gap-1 mt-0.5">
                                    {Array.from({length: res.max}).map((_, i) => (
                                        <div key={i} className={`w-2.5 h-2.5 border border-black ${i < res.current ? 'bg-black' : 'bg-white'}`}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Spell Slots */}
                {Object.keys(character.spellSlots).length > 0 && (
                    <div>
                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Slots</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                            {Object.entries(character.spellSlots).map(([lvl, slot]) => (
                                <div key={lvl} className="flex items-center gap-1">
                                    <span className="text-[9px] font-mono font-bold text-gray-400">{lvl}</span>
                                    <div className="flex gap-0.5">
                                        {Array.from({length: slot.max}).map((_, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full border border-blue-600 ${i < slot.current ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-6 border-y-2 border-black py-2 bg-gray-50">
             <StatBlock label="STR" value={character.stats.str} />
             <StatBlock label="DEX" value={character.stats.dex} />
             <StatBlock label="CON" value={character.stats.con} />
             <StatBlock label="INT" value={character.stats.int} />
             <StatBlock label="WIS" value={character.stats.wis} />
             <StatBlock label="CHA" value={character.stats.cha} />
        </div>

        {/* Spells List */}
        {sortedLevels.length > 0 && (
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-px bg-gray-300 flex-grow"></div>
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Spells</span>
                    <div className="h-px bg-gray-300 flex-grow"></div>
                </div>
                <div className="space-y-1.5">
                    {sortedLevels.map(level => (
                        <div key={level} className="flex items-baseline gap-2 text-[10px]">
                            <span className="font-mono text-gray-400 font-bold w-3 shrink-0">{level === 0 ? 'C' : level}</span>
                            <div className="flex flex-wrap gap-1">
                                {spellsByLevel[level].map(spell => (
                                    <span key={spell.name} className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-sm hover:bg-white hover:border-black transition-colors cursor-help" title={spell.description}>
                                        {spell.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Inventory / Info */}
        <div className="mt-auto pt-2 text-[10px] space-y-1">
            <div className="flex items-center gap-2 mb-1">
                 <div className="h-px bg-gray-300 flex-grow"></div>
                 <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Gear & Feats</span>
                 <div className="h-px bg-gray-300 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <div>
                     {character.equipped.weapon && <div className="font-bold">⚔️ {character.equipped.weapon.name}</div>}
                     {character.equipped.armor && <div className="font-bold">🛡️ {character.equipped.armor.name}</div>}
                     <div className="text-yellow-700 font-bold">💰 {character.gold} GP</div>
                </div>
                <div className="text-right">
                    {character.feats.map(f => (
                        <div key={f} className="text-purple-800 font-medium">★ {f}</div>
                    ))}
                </div>
            </div>
            
            {character.inventory.filter(i => i.type !== 'Weapon' && i.type !== 'Armor').length > 0 && (
                <div className="text-gray-400 italic text-[9px] mt-1 text-center">
                    + {character.inventory.length} items in pack
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default CharacterCard;