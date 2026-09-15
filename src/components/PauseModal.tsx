import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onGoToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart, onGoToMenu }) => {
  return (
    <div className="absolute inset-0 z-35 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-6 shadow-2xl text-center text-white">
        <h2 id="pause-title" className="text-2xl font-bold font-['Chakra_Petch'] tracking-wide text-zinc-100 uppercase mb-2">
          GAME DI-PAUSE
        </h2>
        <p className="text-xs text-zinc-400 mb-6">Permainan sedang dihentikan sementara.</p>

        <div className="flex flex-col gap-2.5">
          <button
            id="pause-resume-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm uppercase transition-colors cursor-pointer shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Lanjutkan</span>
          </button>

          <button
            id="pause-restart-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm border border-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
            <span>Restart Game</span>
          </button>

          <button
            id="pause-menu-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onGoToMenu();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium text-sm border border-zinc-700/60 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-zinc-400" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
