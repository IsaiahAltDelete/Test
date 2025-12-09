import React, { useState, useEffect, useRef } from 'react';
import { GameState, GamePhase } from './types';
import { createInitialState, generateRandomParty, processGameTick } from './services/simulator';
import CharacterCard from './components/CharacterCard';
import { MONTHS, CLASS_COLORS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [tickRate, setTickRate] = useState<number>(1000); // ms
  const scrollRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(gameState);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!gameState.autoPlay) return;
    
    const intervalId = setInterval(async () => {
       if (stateRef.current.party.length > 0 && stateRef.current.party.every(p => p.status === 'DEAD')) {
           setGameState(prev => ({ ...prev, autoPlay: false }));
           return;
       }
       const nextState = await processGameTick(stateRef.current);
       setGameState(nextState);
    }, tickRate);

    return () => clearInterval(intervalId);
  }, [gameState.autoPlay, tickRate]);

  const startGame = () => {
    const newParty = generateRandomParty();
    setGameState(prev => ({
      ...prev,
      party: newParty,
      phase: GamePhase.TRAVELING,
      enemies: [],
      logs: [{ id: 'start', gameTime: prev.time, message: "A new party gathers at the Yawning Portal.", type: 'INFO' }]
    }));
  };

  const formatTime = (t: typeof gameState.time) => {
      const minStr = Math.floor(t.minute).toString().padStart(2, '0');
      const hourStr = t.hour.toString().padStart(2, '0');
      const monthName = MONTHS[t.month] || "Unknown";
      return `${t.day} ${monthName}, ${t.year} DR - ${hourStr}:${minStr}`;
  };

  const renderLogMessage = (msg: string) => {
      // Basic highlighting of names
      const parts = msg.split(/(\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b)/g);
      return (
          <span>
              {parts.map((part, i) => {
                  const char = stateRef.current.party.find(c => c.name === part);
                  if (char) {
                      return <span key={i} style={{ color: char.color, fontWeight: 'bold' }}>{part}</span>;
                  }
                  const enemy = stateRef.current.enemies.find(e => e.name === part);
                  if (enemy) {
                      return <span key={i} className="text-red-600 font-bold">{part}</span>;
                  }
                  return <span key={i}>{part}</span>;
              })}
          </span>
      );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f0] text-[#111] font-sans">
      
      {/* Top Location Bar */}
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center text-xs uppercase tracking-widest sticky top-0 z-50 shadow-md">
          <div className="flex gap-4">
              <span className="font-bold text-[#FF3B30]">{gameState.phase}</span>
              <span>📍 {gameState.location}</span>
          </div>
          <div className="font-mono opacity-80">
              {formatTime(gameState.time)}
          </div>
      </div>

      {/* Header / Controls */}
      <div className="border-b-2 border-black bg-white p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#FF3B30] rounded-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
             <div>
                 <h1 className="text-2xl font-black uppercase leading-none tracking-tighter">D&D 5e Sim</h1>
             </div>
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 border border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-bold uppercase">Speed</span>
              <input 
                type="range" 
                min="50" 
                max="2000" 
                step="50"
                value={2050 - tickRate} // Invert so right is faster
                onChange={(e) => setTickRate(2050 - parseInt(e.target.value))}
                className="w-24 md:w-48 accent-black cursor-pointer"
              />
          </div>

          <div className="flex gap-4">
                {gameState.party.length === 0 ? (
                  <button onClick={startGame} className="bg-black text-white px-6 py-2 font-bold uppercase text-sm hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(255,59,48,1)] active:translate-y-1 active:shadow-none transition-all border-2 border-black">
                    Generate Party
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={startGame} 
                      className="bg-white text-black px-4 py-2 font-bold uppercase text-xs hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all border-2 border-black"
                    >
                      New Party
                    </button>
                    <button 
                        onClick={() => setGameState(prev => ({ ...prev, autoPlay: !prev.autoPlay }))} 
                        className={`px-6 py-2 font-bold uppercase text-sm border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${gameState.autoPlay ? 'bg-red-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {gameState.autoPlay ? 'Pause' : 'Auto Play'}
                      </button>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* Initiative Tracker (Combat Only) */}
      {gameState.phase === GamePhase.COMBAT && gameState.initiativeOrder.length > 0 && (
          <div className="bg-white border-b-2 border-black p-3 overflow-x-auto whitespace-nowrap scrollbar-thin shadow-inner bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')]">
              <div className="max-w-7xl mx-auto flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-1">Initiative</span>
                  {gameState.initiativeOrder.map((id) => {
                      const char = gameState.party.find(c => c.id === id);
                      const enemy = gameState.enemies.find(e => e.id === id);
                      const name = char ? char.name : enemy ? enemy.name : 'Unknown';
                      const active = gameState.activeTurnId === id;
                      const dead = (char && char.status !== 'ALIVE') || (enemy && enemy.currentHp <= 0); 

                      return (
                        <div key={id} className={`inline-flex flex-col items-center justify-center px-3 py-1 border-2 text-xs font-bold transition-all ${active ? 'border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1 z-10' : 'border-gray-300 bg-gray-50 text-gray-500'} ${dead ? 'opacity-40 grayscale' : ''}`}>
                            <span className="text-[10px] leading-none mb-0.5">{char?.initiative || enemy?.initiative}</span>
                            <span style={{ color: char ? char.color : '#000' }}>{name}</span>
                        </div>
                      );
                  })}
              </div>
          </div>
      )}

      {/* Main Grid */}
      <main className="flex-grow p-6 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Party */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {gameState.party.length === 0 ? (
                <div className="col-span-full h-64 flex flex-col items-center justify-center border-4 border-dashed border-gray-300 text-gray-400 bg-gray-50 rounded-xl">
                    <p className="uppercase font-black tracking-widest text-xl mb-2">Simulation Idle</p>
                    <p className="text-sm">Click 'Generate Party' to begin</p>
                </div>
            ) : (
                gameState.party.map(char => (
                    <div key={char.id} className="min-h-[300px]">
                        <CharacterCard character={char} />
                    </div>
                ))
            )}
        </div>

        {/* Right: Log & Enemies */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            
            {/* Enemy Panel */}
            {gameState.enemies.length > 0 && (
                 <div className="border-2 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(239,68,68,1)]">
                     <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-3 flex justify-between border-b-2 border-red-100 pb-2">
                         <span>Hostiles ({gameState.enemies.length})</span>
                         <span>CR {Math.max(...gameState.enemies.map(e => e.cr))} Max</span>
                     </div>
                     <div className="space-y-3">
                        {gameState.enemies.map(enemy => (
                            <div key={enemy.id} className="border border-gray-300 p-2 flex justify-between items-center bg-gray-50 relative overflow-hidden">
                                <div className="z-10 relative">
                                    <div className="font-bold text-sm leading-tight">{enemy.name}</div>
                                    <div className="text-[10px] text-gray-500 font-mono uppercase">{enemy.type} | Init: {enemy.initiative}</div>
                                </div>
                                <div className="text-right z-10 relative">
                                     <div className="text-xs font-bold font-mono">{enemy.currentHp} HP</div>
                                </div>
                                {/* Health BG */}
                                <div className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-300" style={{ width: `${(enemy.currentHp/enemy.maxHp)*100}%` }}></div>
                            </div>
                        ))}
                     </div>
                 </div>
            )}

            {/* System Log */}
            <div className="border-2 border-black bg-white h-[600px] flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-3 border-b-2 border-black bg-black text-white text-xs font-bold uppercase tracking-widest flex justify-between items-center">
                    <span>Event Log</span>
                    {gameState.autoPlay && <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>}
                </div>
                <div className="flex-grow overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-100 font-mono">
                    {gameState.logs.map((log) => (
                        <div key={log.id} className={`px-3 py-2 border-b border-gray-100 text-[11px] leading-relaxed ${
                            log.type === 'BATTLE' ? 'bg-red-50/60 border-l-4 border-l-red-500' : 
                            log.type === 'LEVEL_UP' ? 'bg-yellow-50 border-l-4 border-l-yellow-400' :
                            log.type === 'LOOT' ? 'bg-green-50 border-l-4 border-l-green-500' :
                            log.type === 'SHOP' ? 'bg-blue-50 border-l-4 border-l-blue-400' :
                            'bg-white border-l-4 border-l-gray-200'
                        }`}>
                            <div className="flex justify-between text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">
                                <span>{log.gameTime.hour.toString().padStart(2,'0')}:{Math.floor(log.gameTime.minute).toString().padStart(2,'0')}</span>
                                <span className="font-bold">{log.type}</span>
                            </div>
                            <div className="text-gray-800 font-sans">
                                {renderLogMessage(log.message)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

      </main>
    </div>
  );
};

export default App;