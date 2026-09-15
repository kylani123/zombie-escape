import React from 'react';
import { DoorOpen, RotateCcw, Home, Trophy, Coins, Clock, Sparkles } from 'lucide-react';
import { GameScore } from '../types';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  score: GameScore;
  onPlayAgain: () => void;
  onGoToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ score, onPlayAgain, onGoToMenu }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-900 border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center text-white overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Victory Icon Badge */}
        <div className="inline-flex p-3 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 mb-3 shadow-lg shadow-emerald-950/50">
          <DoorOpen className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 id="victory-title" className="text-3xl sm:text-4xl font-extrabold font-['Chakra_Petch'] text-emerald-400 tracking-wider uppercase mb-1 drop-shadow flex items-center justify-center gap-2">
          <span>YOU ESCAPED!</span>
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
        </h2>
        <p className="text-xs text-zinc-300 mb-5">
          Hebat! Kamu berhasil mengumpulkan koin dan lolos ke pintu keluar dengan selamat!
        </p>

        {/* Score & Stats Card */}
        <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-4 mb-6 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Skor Akhir:
            </span>
            <span className="font-mono font-bold text-xl text-amber-300" id="victory-final-score">
              {score.score} Poin
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-700/50 pt-2">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Coins className="w-3.5 h-3.5 text-yellow-400" /> Koin Terkumpul:
            </span>
            <span className="font-mono font-semibold text-sm text-zinc-200" id="victory-coins-collected">
              {score.coinsCollected} / {score.totalCoins}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-700/50 pt-2">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Waktu Pelarian:
            </span>
            <span className="font-mono font-semibold text-sm text-zinc-200">
              {score.timeElapsed} detik
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="victory-play-again-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-base uppercase transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          <button
            id="victory-menu-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onGoToMenu();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm border border-zinc-700 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
