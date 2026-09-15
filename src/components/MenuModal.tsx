import React from 'react';
import { Play, BookOpen, Skull, Flame, Coins, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

interface MenuModalProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  onStartGame,
  onOpenHowToPlay,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Decorative corner hazard tape lines */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top apocalypse badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-semibold text-emerald-400 mb-4 tracking-wide uppercase">
          <Skull className="w-3.5 h-3.5 text-emerald-400" />
          <span>Survive the Ruined City</span>
        </div>

        {/* Title */}
        <h1
          id="menu-title"
          className="text-4xl sm:text-5xl font-extrabold tracking-wider text-white font-['Chakra_Petch'] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        >
          <span className="text-emerald-400">ZOMBIE</span> ESCAPE
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-300 text-base sm:text-lg mt-3 font-medium">
          Kumpulkan koin dan kabur dari zombie!
        </p>

        {/* Feature quick highlights */}
        <div className="grid grid-cols-3 gap-2.5 my-6 text-left">
          <div className="bg-zinc-800/70 border border-zinc-700/60 p-2.5 rounded-xl">
            <Coins className="w-4 h-4 text-amber-400 mb-1" />
            <div className="text-[11px] text-zinc-400">Target</div>
            <div className="text-xs font-bold text-zinc-200">Min. 5 Koin</div>
          </div>
          <div className="bg-zinc-800/70 border border-zinc-700/60 p-2.5 rounded-xl">
            <Flame className="w-4 h-4 text-rose-400 mb-1" />
            <div className="text-[11px] text-zinc-400">Bahaya</div>
            <div className="text-xs font-bold text-zinc-200">Kejar Zombie</div>
          </div>
          <div className="bg-zinc-800/70 border border-zinc-700/60 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <div className="text-[11px] text-zinc-400">Kesempatan</div>
            <div className="text-xs font-bold text-zinc-200">3 Nyawa</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            id="menu-start-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-lg tracking-wide uppercase transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI GAME</span>
          </button>

          <button
            id="menu-how-to-play-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-750 text-zinc-200 hover:text-white font-semibold text-base border border-zinc-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span>CARA BERMAIN</span>
          </button>
        </div>

        {/* Audio Toggle in Menu */}
        <div className="mt-5 flex items-center justify-center">
          <button
            id="menu-sound-toggle"
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Suara Efek: {isMuted ? 'Mati' : 'Aktif'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
