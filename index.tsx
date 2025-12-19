import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

// Icon Components
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const VolumeIcon = ({ muted }: { muted: boolean }) => muted ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SwordIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>;
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const DnaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h5"></path><path d="M17 12h5"></path><path d="M9 12h6"></path><path d="M12 9v6"></path><circle cx="12" cy="12" r="10"></circle></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const BackpackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 4v12a2 2 0 0 1-2 2z"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path></svg>;
const ScrollIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 4v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>;
const StatsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>;

// Sub Components
const ScreenModal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
    <div className="glass-panel w-full max-w-2xl flex flex-col rounded-xl overflow-hidden shadow-2xl animate-zoom-in relative max-h-[90vh]">
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
         <h2 className="cinzel text-2xl text-gold font-bold tracking-wider">{title}</h2>
         <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon />
         </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
         {children}
      </div>
    </div>
  </div>
);

const CharacterCreationModal: React.FC<{ 
  onClose: () => void; 
  onSubmit: (data: any) => void;
  initialData: any; 
}> = ({ onClose, onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'skills' | 'inventory'>('attributes');
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    race: initialData.race || 'Humano',
    class: initialData.class || 'Guerreiro',
    str: initialData.str || 10,
    dex: initialData.dex || 10,
    con: initialData.con || 10,
    int: initialData.int || 10,
    wis: initialData.wis || 10,
    cha: initialData.cha || 10,
    skills: initialData.skills || '',
    inventory: initialData.inventory || '',
  });

  const handleChange = (f: string, v: any) => setFormData(p => ({...p, [f]: v}));

  // Validação da Distribuição Padrão
  const currentStats = [formData.str, formData.dex, formData.con, formData.int, formData.wis, formData.cha];
  const standardArray = [15, 14, 13, 12, 10, 8];
  
  // Verifica se os stats atuais correspondem ao array padrão (independente da ordem)
  const sortedCurrent = [...currentStats].sort((a, b) => b - a);
  const sortedStandard = [...standardArray].sort((a, b) => b - a);
  const isStandard = JSON.stringify(sortedCurrent) === JSON.stringify(sortedStandard);

  return (
    <ScreenModal title="Ficha de Personagem" onClose={onClose}>
        <div className="flex flex-col h-full">
            {/* Identity Header (Always Visible) */}
            <div className="p-6 pb-2 bg-gradient-to-b from-black/40 to-transparent">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Nome do Personagem</label>
                        <input className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none placeholder-gray-600 font-serif text-lg" 
                        placeholder="Ex: Alaric, o Bravo"
                        value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Raça</label>
                        <select className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none appearance-none"
                            value={formData.race} onChange={e => handleChange('race', e.target.value)}>
                            {['Humano', 'Elfo', 'Anão', 'Halfling', 'Gnomo', 'Meio-Orc', 'Dragonborn', 'Tiefling'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        </div>
                        <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Classe</label>
                        <select className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none appearance-none"
                            value={formData.class} onChange={e => handleChange('class', e.target.value)}>
                            {['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bárbaro', 'Bardo', 'Paladino', 'Ranger', 'Feiticeiro', 'Monge', 'Druida'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-800 px-6 mt-2">
                <button 
                    onClick={() => setActiveTab('attributes')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'attributes' ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <StatsIcon /> Atributos
                </button>
                <button 
                    onClick={() => setActiveTab('skills')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'skills' ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <ScrollIcon /> Habilidades
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'inventory' ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <BackpackIcon /> Inventário
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1">
                {activeTab === 'attributes' && (
                    <div className="animate-fade-in">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-gray-300 uppercase">Distribuição de Pontos</h3>
                            <span className={`text-[10px] ${isStandard ? 'text-green-500' : 'text-gray-500'} transition-colors border border-gray-800 rounded px-2 py-1`}>
                                Padrão: 15, 14, 13, 12, 10, 8
                            </span>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                           {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => (
                             <div key={stat} className={`bg-gray-800/40 p-3 rounded-lg border transition-all ${isStandard ? 'border-gray-700 hover:border-gray-600' : 'border-red-900/40 hover:border-red-800/60'}`}>
                               <label className="block text-[10px] text-gold uppercase font-bold mb-1 text-center">{stat}</label>
                               <input type="number" 
                                 min="1" max="20"
                                 className="w-full bg-transparent text-white text-center focus:outline-none font-mono font-bold text-2xl"
                                 value={formData[stat as keyof typeof formData]} onChange={e => handleChange(stat, parseInt(e.target.value) || 0)} />
                             </div>
                           ))}
                         </div>
                         {!isStandard && (
                            <div className="mt-4 p-3 bg-red-900/10 border border-red-900/30 rounded text-center">
                                <p className="text-[10px] text-red-400 animate-pulse">
                                   Distribuição fora do padrão D&D 5e detectada.
                                </p>
                            </div>
                         )}
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="animate-fade-in h-full flex flex-col">
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Talentos, Perícias e Magias</label>
                        <textarea 
                            className="w-full flex-1 bg-black/40 border border-gray-700 rounded p-4 text-white focus:border-gold outline-none custom-scrollbar min-h-[200px] font-serif text-sm leading-relaxed placeholder-gray-700"
                            placeholder="Descreva suas habilidades, perícias treinadas e magias conhecidas..."
                            value={formData.skills}
                            onChange={e => handleChange('skills', e.target.value)}
                        />
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="animate-fade-in h-full flex flex-col">
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Equipamentos e Tesouros</label>
                        <textarea 
                            className="w-full flex-1 bg-black/40 border border-gray-700 rounded p-4 text-white focus:border-gold outline-none custom-scrollbar min-h-[200px] font-serif text-sm leading-relaxed placeholder-gray-700"
                            placeholder="Liste seus itens, armas, armaduras e moedas de ouro..."
                            value={formData.inventory}
                            onChange={e => handleChange('inventory', e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 mt-auto">
               <button onClick={() => onSubmit(formData)} className="w-full py-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-white font-bold uppercase rounded shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:brightness-110 transition-all cinzel tracking-widest text-sm transform hover:-translate-y-0.5">
                 Salvar Ficha
               </button>
            </div>
        </div>
    </ScreenModal>
  );
};

const CharacterCard = ({ player, onOpenScreen }: any) => (
  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 h-full text-white">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl border border-gold/30 overflow-hidden relative">
        {player?.avatarUrl ? (
            <img src={player.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
            <span>{player?.class ? player.class[0] : '?'}</span>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold font-serif text-gold">{player?.name || "Desconhecido"}</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest">{player?.class || "Classe Indefinida"}</p>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm"><span>HP</span> <span className="text-green-400">{player?.stats?.hp_current}/{player?.stats?.hp_max}</span></div>
      <div className="flex justify-between text-sm"><span>XP</span> <span className="text-blue-400">{player?.stats?.xp}</span></div>
      <div className="flex justify-between text-sm"><span>Nível</span> <span className="text-yellow-400">{player?.stats?.level}</span></div>
    </div>
    <button onClick={() => onOpenScreen('CHAR_CREATION')} className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs uppercase tracking-wide transition-colors">Detalhes</button>
  </div>
);

const EntityCard = ({ npc }: any) => (
  <div className="bg-gray-900/80 p-3 rounded border border-gray-700 flex items-center gap-3 animate-fade-in text-white">
    <div className={`w-10 h-10 rounded flex items-center justify-center font-bold ${npc.type === 'enemy' ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
      {npc.name[0]}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h4 className="font-bold text-sm truncate">{npc.name}</h4>
        <span className="text-xs opacity-50">{npc.hp_percent}%</span>
      </div>
      <div className="w-full bg-gray-800 h-1 rounded-full mt-1 overflow-hidden">
        <div className={`h-full ${npc.type === 'enemy' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${npc.hp_percent}%` }}></div>
      </div>
    </div>
  </div>
);

// Constants
const SYSTEM_INSTRUCTION = `VOCÊ É O MESTRE DE JOGO (DM) E O MOTOR (ENGINE) DE UM CRPG TEXTUAL.
Cenário: Karameikos (Mystara). Regras: D&D 5e.
Objetivo: Guiar o jogador, gerenciar regras, narrar, e fornecer metadados JSON.

FASE INICIAL: Não peça ficha. Comece em Threshold ao amanhecer. Pergunte nome/identidade.
Depois, Cena da Carroça (perigo). Ação do jogador define classe sugerida.
Depois, sugira Raça/Antecedente/Atributos em JSON.

FORMATO DE RESPOSTA (SEMPRE):
1. BLOCO JSON (Obrigatório: Envolva este bloco em \`\`\`json ... \`\`\`):
{
  "location": "Local",
  "scene_image_prompt": "Prompt visual detalhado",
  "player_stats": { "hp_current": int, "hp_max": int, "xp": int, "level": int, "name": string, "class": string, "str": int, "dex": int, "con": int, "int": int, "wis": int, "cha": int },
  "active_npcs": [ { "name": "Nome", "type": "enemy"|"friendly", "status": "visible", "hp_percent": int } ],
  "suggestions": ["Ação 1", "Ação 2"],
  "phase": "CREATION" | "PLAYING"
}
2. BLOCO MARKDOWN (Narrativa para o jogador).

REGRAS:
- Regra do Cool: Descrições épicas evitam testes triviais.
- Combate: Peça testes se houver risco.
- Imersão: Alta fantasia, descritivo.
- Aguarde o primeiro "Olá" ou inicio do jogador para começar.
`;

const STORAGE_KEY = 'karameikos_save_v1';

const loadSavedState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Save file corrupted", e);
    return null;
  }
};

export default function GameInterface() {
  const [viewMode, setViewMode] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState('GAME');
  const [inputText, setInputText] = useState('');
  
  // State for AI Generated Images
  const [sceneImageUrl, setSceneImageUrl] = useState<string | null>(null);
  const lastScenePrompt = useRef<string>("");

  const savedData = useRef(loadSavedState());

  const [messages, setMessages] = useState<Array<{sender: 'system'|'dm'|'player'|'scene', text?: string, imageUrl?: string}>>(() => {
    return savedData.current?.messages || [
      { sender: 'system', text: 'Sistema inicializado. Conectando ao servidor neural...' }
    ];
  });
  
  const [gameState, setGameState] = useState(() => {
    return savedData.current?.gameState || {
      location: 'Threshold',
      player: { 
          name: 'Viajante', class: '', 
          stats: { hp_current: 10, hp_max: 10, xp: 0, level: 1 },
          str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
          skills: '', inventory: ''
      },
      npcs: [] as any[],
      suggestions: ['Olhar ao redor', 'Seguir para a cidade'],
      phase: 'CREATION',
      scene_image_prompt: ''
    };
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  // Auto-save effect
  useEffect(() => {
    // Filter out scene images from persistence to save localStorage space (base64 is huge)
    // The current scene is naturally regenerated on reload due to gameState.scene_image_prompt logic
    const messagesToSave = messages.map(m => {
        if (m.sender === 'scene') return null; 
        return m;
    }).filter(Boolean);

    const data = {
        messages: messagesToSave,
        gameState
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [messages, gameState]);

  // Scene Image Generation Effect
  useEffect(() => {
    const prompt = gameState.scene_image_prompt;
    if (prompt && prompt !== lastScenePrompt.current) {
        lastScenePrompt.current = prompt;
        const gen = async () => {
             try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ text: "Fantasy environment art, masterpiece, 8k, highly detailed, atmospheric lighting, " + prompt }] }
                });
                const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (part) {
                    const url = `data:image/png;base64,${part.inlineData.data}`;
                    setSceneImageUrl(url);
                    // Add the image directly to the chat stream for better visibility
                    setMessages(prev => [...prev, { sender: 'scene', imageUrl: url }]);
                }
             } catch (e) { 
                console.error("Scene gen error", e); 
            }
        };
        gen();
    }
  }, [gameState.scene_image_prompt]);

  // Initialize Chat with History
  useEffect(() => {
    const initAI = async () => {
      // Reconstruct history
      const history = messages
        .filter(m => m.sender === 'player' || m.sender === 'dm')
        .map(m => ({
          role: m.sender === 'player' ? 'user' : 'model',
          parts: [{ text: m.text || '' }]
        }));

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
            model: "gemini-3-pro-preview",
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            },
            history: history
        });
        
        setChatSession(chat);
        
        // Only trigger initial "Olá" if it's a NEW game (checking if substantive history exists)
        const hasHistory = history.length > 0;
        
        if (!hasHistory) {
             const response = await chat.sendMessage({ message: "Olá" });
             if (response.text) {
                  processResponse(response.text);
             }
        }
      } catch (e) {
        console.error("Failed to init AI", e);
        setMessages(prev => [...prev, { sender: 'system', text: 'Erro ao conectar com o Mestre. Verifique sua chave de API.' }]);
      }
    };
    initAI();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const processResponse = (rawText: string) => {
    let jsonPart = null;
    let markdownPart = rawText;

    // Strategy 1: Look for ```json ... ``` block
    const codeBlockMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (codeBlockMatch) {
        try {
            jsonPart = JSON.parse(codeBlockMatch[1]);
            markdownPart = rawText.replace(codeBlockMatch[0], '').trim();
        } catch (e) {
            console.error("Failed to parse JSON from code block", e);
        }
    } else {
        // Fallback Strategy 2: Find braces manually to handle nested objects correcty
        const firstOpen = rawText.indexOf('{');
        if (firstOpen !== -1) {
            let balance = 0;
            let endIndex = -1;
            for (let i = firstOpen; i < rawText.length; i++) {
                if (rawText[i] === '{') balance++;
                else if (rawText[i] === '}') balance--;
                
                if (balance === 0) {
                    endIndex = i + 1;
                    break;
                }
            }

            if (endIndex !== -1) {
                const potentialJson = rawText.substring(firstOpen, endIndex);
                try {
                    jsonPart = JSON.parse(potentialJson);
                    markdownPart = rawText.replace(potentialJson, '').trim();
                    // Cleanup leftover fences if regex missed them but we manually found the object
                    markdownPart = markdownPart.replace(/^```json/, '').replace(/^```/, '').trim();
                } catch (e) {
                    console.warn("Found brace block but failed to parse", e);
                }
            }
        }
    }

    // Update Game State
    if (jsonPart) {
      setGameState(prev => ({
        ...prev,
        location: (jsonPart as any).location || prev.location,
        player: { ...prev.player, ...(jsonPart as any).player_stats },
        npcs: (jsonPart as any).active_npcs || [],
        suggestions: (jsonPart as any).suggestions || [],
        phase: (jsonPart as any).phase || prev.phase,
        scene_image_prompt: (jsonPart as any).scene_image_prompt || prev.scene_image_prompt
      }));
    }

    // Append Narrative Message
    if (markdownPart) {
      setMessages(prev => [...prev, { sender: 'dm', text: markdownPart }]);
    }
    setLoading(false);
  };

  const sendMessageToAI = async (text: string) => {
    if (!text.trim() || !chatSession) return;
    
    const userMsg = text;
    setInputText('');
    setMessages(prev => [...prev, { sender: 'player', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const responseText = result.text;
      if (responseText) {
          processResponse(responseText);
      }
    } catch (error) {
      console.error("AI Error", error);
      setMessages(prev => [...prev, { sender: 'system', text: 'O Mestre está em silêncio... (Erro de conexão)' }]);
      setLoading(false);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    sendMessageToAI(sug);
  };

  const resetGame = () => {
    if (confirm("Tem certeza que deseja apagar seu progresso e reiniciar?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleCharacterSubmit = async (data: any) => {
      setGameState(prev => ({ ...prev, player: { ...prev.player, ...data }}));
      setActiveScreen('GAME');
      const msg = `[FICHA ATUALIZADA] O jogador definiu: Nome: ${data.name}, Raça: ${data.race}, Classe: ${data.class}. Continue a narrativa.`;
      sendMessageToAI(msg);

      // Generate Avatar
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Fantasy RPG portrait of ${data.name}, a ${data.race} ${data.class}, D&D character art, detailed face, headshot, dramatic lighting` }] }
          });
          const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (part) {
              const url = `data:image/png;base64,${part.inlineData.data}`;
              setGameState(prev => ({ ...prev, player: { ...prev.player, ...data, avatarUrl: url }}));
          }
      } catch (e) {
          console.error("Avatar gen error", e);
      }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        {sceneImageUrl ? (
            <img src={sceneImageUrl} className="w-full h-full object-cover opacity-30" alt="Scene Background" />
        ) : (
            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/95 to-gray-900/60"></div>
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 flex w-full h-full overflow-hidden">
        
        {/* Left Sidebar - Character */}
        <div className={`hidden md:block flex-shrink-0 w-72 z-20 shadow-2xl transition-all duration-500 ease-in-out ${viewMode ? '-ml-80 opacity-0' : 'ml-0 opacity-100'}`}>
          <CharacterCard player={gameState.player} onOpenScreen={setActiveScreen} />
        </div>

        {/* Center - Narrative Stage */}
        <div className="flex-1 flex flex-col h-full relative min-w-0 transition-all duration-500">
          
          {/* Header (Location & Controls) */}
          <div className={`w-full p-6 flex justify-between items-start z-30 flex-shrink-0 transition-colors duration-500 ${viewMode ? '' : 'bg-gradient-to-b from-gray-900/90 to-transparent'}`}>
            <div className={`transition-opacity duration-500 ${viewMode ? 'opacity-0' : 'opacity-100'}`}>
               <div className="flex items-center gap-2 text-gold/80 text-xs font-bold uppercase tracking-widest mb-1">
                 <MapIcon /> Karameikos
               </div>
               <h1 className="cinzel text-4xl text-white drop-shadow-lg tracking-wide font-bold">
                 {gameState.location}
               </h1>
            </div>
            
            <div className="flex gap-2 pointer-events-auto">
               <button 
                onClick={resetGame}
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 bg-black/50 text-red-400 hover:bg-red-900/30 transition-all`}
                title="Reiniciar Jogo"
               >
                 <TrashIcon />
               </button>
               <button 
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${isAudioEnabled ? 'bg-gold text-black' : 'bg-black/50 text-white hover:bg-white/10'}`}
               >
                 <VolumeIcon muted={!isAudioEnabled} />
               </button>
               <button 
                onClick={() => setViewMode(!viewMode)}
                className={`px-4 h-10 rounded-full backdrop-blur-md border border-white/20 text-white text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all ${viewMode ? 'bg-gold/20' : 'bg-black/50'}`}
               >
                 {viewMode ? <CloseIcon /> : <EyeIcon />} {viewMode ? 'Fechar Cena' : 'Ver Cena'}
               </button>
            </div>
          </div>

          {/* Chat Log */}
          <div className={`flex-1 overflow-y-auto px-4 md:px-12 py-4 custom-scrollbar scroll-smooth space-y-6 flex flex-col transition-opacity duration-500 ${viewMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex-1"></div>
            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.sender === 'player' ? 'items-end' : 'items-start'} animate-fade-in-up`}
              >
                {msg.sender === 'system' && (
                   <div className="flex items-center gap-3 text-gray-400 text-sm mb-2 opacity-80 pl-2">
                      <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                         <span className="text-xs">D20</span>
                      </div>
                      <span className="uppercase font-bold tracking-wide">Sistema</span>
                      <span>{msg.text}</span>
                   </div>
                )}
                
                {msg.sender === 'scene' && msg.imageUrl && (
                   <div className="flex flex-col gap-2 max-w-2xl w-full my-4">
                      <div className="flex items-center gap-2 text-gold/60 text-xs uppercase tracking-widest">
                         <ImageIcon /> Visualização da Cena
                      </div>
                      <div className="rounded-lg overflow-hidden border border-gold/20 shadow-2xl relative group">
                        <img src={msg.imageUrl} className="w-full h-auto object-cover max-h-80 transition-transform duration-700 group-hover:scale-105" alt="Visualização da Cena" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50"></div>
                      </div>
                   </div>
                )}

                {msg.sender === 'dm' && msg.text && (
                  <div className="flex gap-4 max-w-2xl">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-black border border-gold/50 overflow-hidden mt-1">
                       <img src="https://ui-avatars.com/api/?name=DM&background=000&color=d4af37" alt="DM" />
                    </div>
                    <div>
                      <span className="text-gold text-xs font-bold uppercase tracking-widest mb-1 block">Mestre de Jogo</span>
                      <div className="text-lg leading-relaxed text-shadow-sm font-serif text-gray-100">
                        <ReactMarkdown components={{p: ({node, ...props}) => <p className="mb-4" {...props} />}}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {msg.sender === 'player' && (
                  <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl rounded-tr-none py-3 px-5 max-w-xl text-lg shadow-lg">
                     {msg.text}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 max-w-2xl animate-pulse">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-black border border-gold/50 mt-1"></div>
                <div className="space-y-2 w-full pt-2">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom Action Panel */}
          <div className={`p-6 pt-2 z-30 flex-shrink-0 transition-opacity duration-500 ${viewMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            
            {gameState.suggestions.length > 0 && !loading && (
               <div className="flex flex-wrap gap-2 mb-4 justify-start animate-fade-in">
                  {gameState.suggestions.map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-4 py-1.5 rounded-full bg-gray-800/80 border border-gold/30 text-gold text-sm hover:bg-gold hover:text-black transition-colors backdrop-blur-sm"
                    >
                      {sug}
                    </button>
                  ))}
               </div>
            )}

            <div className="flex gap-3 items-end">
               {gameState.phase === 'PLAYING' && (
                 <>
                  <button onClick={() => setInputText("Eu ataco!")} className="h-12 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full flex items-center gap-2 shadow-lg shadow-red-900/50 transition-transform hover:scale-105 active:scale-95">
                    <SwordIcon /> <span className="hidden md:inline">Ataque</span>
                  </button>
                  <button onClick={() => setInputText("Lanço um truque.")} className="h-12 px-5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-full flex items-center gap-2 border border-gray-600 transition-transform hover:scale-105">
                    <MagicIcon /> <span className="hidden md:inline">Truque</span>
                  </button>
                 </>
               )}
               
               <button onClick={() => setActiveScreen('CHAR_CREATION')} className="h-12 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                 <DnaIcon /> <span className="hidden md:inline">Ficha</span>
               </button>

               <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessageToAI(inputText)}
                    placeholder={loading ? "Aguarde..." : "O que você deseja fazer?"}
                    disabled={loading}
                    className="w-full h-12 pl-6 pr-12 bg-black/60 backdrop-blur-md border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                  <button 
                    onClick={() => sendMessageToAI(inputText)}
                    disabled={loading || !inputText}
                    className="absolute right-2 top-1.5 h-9 w-9 bg-gray-700 hover:bg-gold hover:text-black text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendIcon />
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Right - Entity Cards */}
        <div className={`hidden lg:flex flex-col w-72 flex-shrink-0 z-20 p-4 gap-3 overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out ${viewMode ? '-mr-80 opacity-0' : 'mr-0 opacity-100'}`}>
          {gameState.npcs.length > 0 ? (
             gameState.npcs.map((npc, idx) => (
               <EntityCard key={idx} npc={npc} />
             ))
           ) : (
             <div className="mt-12 p-4 border border-dashed border-gray-700 rounded-lg text-center opacity-50 select-none">
               <div className="text-4xl grayscale mb-2">👁️</div>
               <p className="text-xs text-gray-500 uppercase font-bold">Nenhum ser visível</p>
             </div>
           )}
        </div>

      </div>

      {/* MODALS RENDER LOGIC */}
      {activeScreen === 'CHAR_CREATION' && (
        <CharacterCreationModal 
          onClose={() => setActiveScreen('GAME')}
          onSubmit={handleCharacterSubmit}
          initialData={gameState.player}
        />
      )}
    </div>
  );
}

// MOUNT APP
const root = createRoot(document.getElementById('root')!);
root.render(<GameInterface />);