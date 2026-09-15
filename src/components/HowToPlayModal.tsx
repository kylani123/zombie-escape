import React from 'react';
import { X, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Coins, Skull, DoorOpen, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
  onStartGame: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, onStartGame }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-6 sm:p-7 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <h2 id="how-to-play-title" className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] tracking-wide text-emerald-400 uppercase">
            CARA BERMAIN
          </h2>
          <button
            id="how-to-play-close-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions List */}
        <div className="space-y-3.5 text-sm text-zinc-300">
          {/* Movement controls */}
          <div className="flex items-start gap-3 bg-zinc-800/60 p-3 rounded-xl border border-zinc-700/60">
            <div className="flex flex-col gap-1 items-center shrink-0">
              <div className="grid grid-cols-3 gap-1 w-16">
                <div />
                <span className="bg-zinc-700 border border-zinc-600 rounded text-[10px] font-mono font-bold text-center py-0.5">W</span>
                <div />
                <span className="bg-zinc-700 border border-zinc-600 rounded text-[10px] font-mono font-bold text-center py-0.5">A</span>
                <span className="bg-zinc-700 border border-zinc-600 rounded text-[10px] font-mono font-bold text-center py-0.5">S</span>
                <span className="bg-zinc-700 border border-zinc-600 rounded text-[10px] font-mono font-bold text-center py-0.5">D</span>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white">1. Kontrol Karakter</div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Gunakan tombol <kbd className="bg-zinc-700 px-1 rounded text-zinc-200">W</kbd> <kbd className="bg-zinc-700 px-1 rounded text-zinc-200">A</kbd> <kbd className="bg-zinc-700 px-1 rounded text-zinc-200">S</kbd> <kbd className="bg-zinc-700 px-1 rounded text-zinc-200">D</kbd> atau tombol <kbd className="bg-zinc-700 px-1 rounded text-zinc-200">Panah (Arrow Keys)</kbd> untuk menggerakkan survivor ke segala arah.
              </p>
            </div>
          </div>

          {/* Coins instruction */}
          <div className="flex items-start gap-3 bg-zinc-800/60 p-3 rounded-xl border border-zinc-700/60">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">2. Kumpulkan Koin</div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Kumpulkan koin yang tersebar di peta untuk mendapatkan skor (+10 poin per koin). Kumpulkan <strong className="text-amber-300">minimal 5 koin</strong> sebelum pintu keluar dapat terbuka!
              </p>
            </div>
          </div>

          {/* Zombie danger & health */}
          <div className="flex items-start gap-3 bg-zinc-800/60 p-3 rounded-xl border border-zinc-700/60">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">3. Hindari Zombie</div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Zombie berpatroli dan akan mengejar ketika kamu mendekat! Kamu memiliki <strong>3 nyawa</strong>. Jika terkena zombie, nyawa berkurang 1 dan kamu mendapat waktu kebal 1 detik.
              </p>
            </div>
          </div>

          {/* Escape Exit */}
          <div className="flex items-start gap-3 bg-zinc-800/60 p-3 rounded-xl border border-zinc-700/60">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">4. Capai Pintu EXIT</div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Setelah mengumpulkan minimal 5 koin, segera pergi ke pintu <strong className="text-emerald-400">EXIT</strong> di pojok kanan atas untuk memenangkan permainan!
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-5">
          <button
            id="how-to-play-back-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-sm border border-zinc-700 transition-colors cursor-pointer"
          >
            Kembali ke Menu
          </button>
          <button
            id="how-to-play-start-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer shadow-md shadow-emerald-900/30"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
