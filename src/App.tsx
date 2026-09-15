/**
 * Zombie Escape - 2D Web Game
 * Top-down apocalyptic survival game.
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/gameEngine';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MenuModal } from './components/MenuModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { TouchControls } from './components/TouchControls';
import { GameScore, GameState } from './types';
import { sound } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [isInvulnerable, setIsInvulnerable] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<GameScore>({
    score: 0,
    coinsCollected: 0,
    totalCoins: 8,
    lives: 3,
    timeElapsed: 0,
  });

  // Keep a stable instance of GameEngine
  const engineRef = useRef<GameEngine>(new GameEngine());
  const engine = engineRef.current;

  // Keyboard input state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchDirRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Pause toggle
      if (e.key === 'Escape' || e.key === ' ' || key === 'p') {
        if (gameState === 'PLAYING') {
          e.preventDefault();
          sound.playClick();
          setGameState('PAUSED');
          return;
        } else if (gameState === 'PAUSED') {
          e.preventDefault();
          sound.playClick();
          setGameState('PLAYING');
          return;
        }
      }

      // Prevent scrolling for game controls
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(key)) {
        if (gameState === 'PLAYING') {
          e.preventDefault();
        }
      }

      keysRef.current[key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Clamp delta time to avoid large physics steps
      const dt = Math.min(0.08, rawDt);

      if (gameState === 'PLAYING') {
        // Calculate player movement vector
        let dx = 0;
        let dy = 0;

        if (keysRef.current['w'] || keysRef.current['arrowup']) dy -= 1;
        if (keysRef.current['s'] || keysRef.current['arrowdown']) dy += 1;
        if (keysRef.current['a'] || keysRef.current['arrowleft']) dx -= 1;
        if (keysRef.current['d'] || keysRef.current['arrowright']) dx += 1;

        // Combine with touch controls if active
        if (touchDirRef.current.dx !== 0 || touchDirRef.current.dy !== 0) {
          dx += touchDirRef.current.dx;
          dy += touchDirRef.current.dy;
        }

        // Run engine update
        engine.update(
          { dx, dy },
          dt,
          {
            onDamage: (remainingLives) => {
              setLives(remainingLives);
            },
            onGameOver: (endScore) => {
              setFinalScore(endScore);
              setGameState('GAMEOVER');
            },
            onVictory: (endScore) => {
              setFinalScore(endScore);
              setGameState('VICTORY');
            },
            onCoinCollected: (count) => {
              setCoinsCollected(count);
              setScore(engine.score);
            },
          }
        );

        // Sync react state for UI
        setScore(engine.score);
        setLives(engine.player.lives);
        setCoinsCollected(engine.coinsCollected);
        setIsInvulnerable(engine.player.isInvulnerable);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState, engine]);

  // Actions
  const startGame = () => {
    engine.reset();
    setScore(0);
    setLives(3);
    setCoinsCollected(0);
    setIsInvulnerable(false);
    keysRef.current = {};
    touchDirRef.current = { dx: 0, dy: 0 };
    setGameState('PLAYING');
  };

  const resumeGame = () => {
    setGameState('PLAYING');
  };

  const goToMenu = () => {
    setGameState('MENU');
  };

  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-2 sm:p-4 font-sans select-none overflow-x-hidden">
      {/* Container max width */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-3">
        {/* Top HUD */}
        <HUD
          lives={lives}
          maxLives={3}
          score={score}
          coinsCollected={coinsCollected}
          requiredCoins={5}
          isPaused={gameState === 'PAUSED'}
          isInvulnerable={isInvulnerable}
          isMuted={isMuted}
          onTogglePause={() => {
            if (gameState === 'PLAYING') setGameState('PAUSED');
            else if (gameState === 'PAUSED') setGameState('PLAYING');
          }}
          onToggleMute={toggleMute}
        />

        {/* Main Canvas Viewport with Overlays */}
        <div className="relative w-full">
          <GameCanvas engine={engine} />

          {/* Modals & Screens */}
          {gameState === 'MENU' && (
            <MenuModal
              onStartGame={startGame}
              onOpenHowToPlay={() => setGameState('HOW_TO_PLAY')}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          )}

          {gameState === 'HOW_TO_PLAY' && (
            <HowToPlayModal
              onClose={() => setGameState('MENU')}
              onStartGame={startGame}
            />
          )}

          {gameState === 'PAUSED' && (
            <PauseModal
              onResume={resumeGame}
              onRestart={startGame}
              onGoToMenu={goToMenu}
            />
          )}

          {gameState === 'GAMEOVER' && (
            <GameOverModal
              score={finalScore}
              onRestart={startGame}
              onGoToMenu={goToMenu}
            />
          )}

          {gameState === 'VICTORY' && (
            <VictoryModal
              score={finalScore}
              onPlayAgain={startGame}
              onGoToMenu={goToMenu}
            />
          )}
        </div>

        {/* On-screen controls for mobile/touch users */}
        {gameState === 'PLAYING' && (
          <TouchControls
            onDirectionChange={(dir) => {
              touchDirRef.current = dir;
            }}
          />
        )}

        {/* Bottom instructions badge */}
        <footer className="w-full flex items-center justify-between text-xs text-zinc-400 px-2 py-1">
          <div className="hidden sm:flex items-center gap-2">
            <span>Kontrol:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">W A S D</kbd>
            <span>atau</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">Panah</kbd>
            <span>| Jeda:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">Spasi</kbd>
          </div>
          <div className="text-right w-full sm:w-auto">
            <span>Target: Kumpulkan <strong className="text-amber-400">5 Koin</strong> &amp; capai <strong className="text-emerald-400">EXIT</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
