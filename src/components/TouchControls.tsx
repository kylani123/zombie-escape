import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface TouchControlsProps {
  onDirectionChange: (dir: { dx: number; dy: number }) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onDirectionChange }) => {
  const activeKeys = React.useRef({ up: false, down: false, left: false, right: false });

  const update = () => {
    let dx = 0;
    let dy = 0;
    if (activeKeys.current.left) dx -= 1;
    if (activeKeys.current.right) dx += 1;
    if (activeKeys.current.up) dy -= 1;
    if (activeKeys.current.down) dy += 1;
    onDirectionChange({ dx, dy });
  };

  const handlePointerDown = (key: 'up' | 'down' | 'left' | 'right') => (e: React.PointerEvent) => {
    e.preventDefault();
    activeKeys.current[key] = true;
    update();
  };

  const handlePointerUp = (key: 'up' | 'down' | 'left' | 'right') => (e: React.PointerEvent) => {
    e.preventDefault();
    activeKeys.current[key] = false;
    update();
  };

  return (
    <div className="flex md:hidden items-center justify-center pt-2 select-none touch-none">
      <div className="grid grid-cols-3 gap-1.5 w-44 bg-zinc-900/80 p-2 rounded-2xl border border-zinc-700/60 shadow-xl">
        <div />
        <button
          id="touch-btn-up"
          type="button"
          onPointerDown={handlePointerDown('up')}
          onPointerUp={handlePointerUp('up')}
          onPointerLeave={handlePointerUp('up')}
          onPointerCancel={handlePointerUp('up')}
          className="h-12 flex items-center justify-center rounded-xl bg-zinc-800 active:bg-emerald-600 text-zinc-200 border border-zinc-700 active:text-white transition-colors"
          aria-label="Atas"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          id="touch-btn-left"
          type="button"
          onPointerDown={handlePointerDown('left')}
          onPointerUp={handlePointerUp('left')}
          onPointerLeave={handlePointerUp('left')}
          onPointerCancel={handlePointerUp('left')}
          className="h-12 flex items-center justify-center rounded-xl bg-zinc-800 active:bg-emerald-600 text-zinc-200 border border-zinc-700 active:text-white transition-colors"
          aria-label="Kiri"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          id="touch-btn-down"
          type="button"
          onPointerDown={handlePointerDown('down')}
          onPointerUp={handlePointerUp('down')}
          onPointerLeave={handlePointerUp('down')}
          onPointerCancel={handlePointerUp('down')}
          className="h-12 flex items-center justify-center rounded-xl bg-zinc-800 active:bg-emerald-600 text-zinc-200 border border-zinc-700 active:text-white transition-colors"
          aria-label="Bawah"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          id="touch-btn-right"
          type="button"
          onPointerDown={handlePointerDown('right')}
          onPointerUp={handlePointerUp('right')}
          onPointerLeave={handlePointerUp('right')}
          onPointerCancel={handlePointerUp('right')}
          className="h-12 flex items-center justify-center rounded-xl bg-zinc-800 active:bg-emerald-600 text-zinc-200 border border-zinc-700 active:text-white transition-colors"
          aria-label="Kanan"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
