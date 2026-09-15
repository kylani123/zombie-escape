import React from 'react';
import { Heart, Coins, Trophy, Pause, Volume2, VolumeX, ShieldAlert, DoorOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface HUDProps {
  lives: number;
  maxLives: number;
  score: number;
  coinsCollected: number;
  requiredCoins: number;
  isPaused: boolean;
  isInvulnerable: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  lives,
  maxLives,
  score,
  coinsCollected,
  requiredCoins,
  isPaused,
  isInvulnerable,
  isMuted,
  onTogglePause,
  onToggleMute,
}) => {
  const exitReady = coinsCollected >= requiredCoins;

  return (
    <header className="w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-xl px-4 py-2.5 shadow-lg text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Lives / Nyawa */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Nyawa:</span>
          <div className="flex items-center gap-1.5" id="hud-lives-container">
            {Array.from({ length: maxLives }).map((_, i) => {
              const active = i < lives;
              return (
                <div
                  key={i}
                  className={`transition-all duration-300 ${
                    active
                      ? 'scale-100 text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'scale-90 text-zinc-700 opacity-40'
                  } ${isInvulnerable && active ? 'animate-pulse' : ''}`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              );
            })}
          </div>
          {isInvulnerable && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-medium animate-pulse">
              <ShieldAlert className="w-3 h-3" /> Kebal
            </span>
          )}
        </div>

        {/* Score & Coins Progress */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Score */}
          <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 px-3 py-1 rounded-lg">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-zinc-400 font-medium">Score:</span>
              <span className="font-mono font-bold text-amber-300 text-base" id="hud-score-value">
                {score}
              </span>
            </div>
          </div>

          {/* Coins */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
              exitReady
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
            }`}
          >
            <Coins className={`w-4 h-4 ${exitReady ? 'text-emerald-400 animate-bounce' : 'text-yellow-400'}`} />
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-zinc-400 font-medium">Koin:</span>
              <span className="font-mono font-bold text-base" id="hud-coins-value">
                {coinsCollected}
              </span>
              <span className="text-xs text-zinc-400">/{requiredCoins} min</span>
            </div>

            {exitReady && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/50">
                <DoorOpen className="w-3.5 h-3.5" /> EXIT Terbuka!
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Pause & Audio */}
        <div className="flex items-center gap-2">
          <button
            id="hud-mute-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            id="hud-pause-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onTogglePause();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
            title="Pause Game (Space / ESC)"
            aria-label="Pause Game"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pause</span>
          </button>
        </div>
      </div>
    </header>
  );
};
