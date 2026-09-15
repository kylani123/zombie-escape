import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/gameEngine';
import { MAP_HEIGHT, MAP_WIDTH } from '../game/mapData';
import { Coin, ExitDoor, Obstacle, Player, Zombie } from '../types';

interface GameCanvasProps {
  engine: GameEngine;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Prepare viewport and clear canvas
      ctx.save();

      // Screen shake
      if (engine.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * engine.screenShake;
        const shakeY = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // Draw background (Abandoned City Asphalt)
      drawBackground(ctx);

      // Draw obstacles (Buildings, Barricades, Abandoned Cars)
      for (const obstacle of engine.obstacles) {
        drawObstacle(ctx, obstacle);
      }

      // Draw Exit Door
      drawExitDoor(ctx, engine.exitDoor, engine.coinsCollected);

      // Draw Coins
      for (const coin of engine.coins) {
        if (!coin.collected) {
          drawCoin(ctx, coin);
        }
      }

      // Draw Zombies
      for (const zombie of engine.zombies) {
        drawZombie(ctx, zombie);
      }

      // Draw Player / Survivor
      drawPlayer(ctx, engine.player);

      // Draw Waypoint / Guidance Indicator (Helps player easily locate coins & exit!)
      drawGuidanceIndicator(ctx, engine);

      // Draw Particles
      drawParticles(ctx, engine);

      // Draw Floating Texts
      drawFloatingTexts(ctx, engine);

      // Draw Damage Red Vignette / Flash
      if (engine.flashRed > 0) {
        ctx.fillStyle = `rgba(220, 38, 38, ${Math.min(0.5, engine.flashRed * 0.4)})`;
        ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine]);

  return (
    <div className="relative w-full aspect-[1000/650] max-h-[75vh] flex items-center justify-center bg-zinc-950 rounded-xl overflow-hidden shadow-2xl border-2 border-zinc-800">
      <canvas
        id="zombie-game-canvas"
        ref={canvasRef}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="w-full h-full object-contain block select-none cursor-crosshair"
      />
    </div>
  );
};

// ================= RENDER HELPERS =================

function drawBackground(ctx: CanvasRenderingContext2D) {
  // Dark cracked road / asphalt
  ctx.fillStyle = '#1c1f24';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // Subtle road grid texture
  ctx.strokeStyle = '#252930';
  ctx.lineWidth = 1;
  const gridSize = 40;
  ctx.beginPath();
  for (let x = 0; x < MAP_WIDTH; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, MAP_HEIGHT);
  }
  for (let y = 0; y < MAP_HEIGHT; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(MAP_WIDTH, y);
  }
  ctx.stroke();

  // Faded yellow / white street markings
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.18)';
  ctx.setLineDash([20, 20]);
  ctx.lineWidth = 3;

  // Main East-West Boulevard
  ctx.beginPath();
  ctx.moveTo(30, 255);
  ctx.lineTo(650, 255);
  ctx.stroke();

  // South Street line
  ctx.beginPath();
  ctx.moveTo(160, 520);
  ctx.lineTo(670, 520);
  ctx.stroke();

  // Central North-South Avenue line
  ctx.beginPath();
  ctx.moveTo(350, 30);
  ctx.lineTo(350, 600);
  ctx.stroke();

  ctx.setLineDash([]); // Reset dash

  // Abandoned city ground details: asphalt cracks and stains
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.arc(280, 260, 35, 0, Math.PI * 2);
  ctx.arc(620, 380, 45, 0, Math.PI * 2);
  ctx.arc(120, 520, 28, 0, Math.PI * 2);
  ctx.arc(770, 320, 40, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  ctx.save();

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  if (obs.type === 'building') {
    // Outer building body (dark brick)
    ctx.fillStyle = '#27272a';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Inner rooftop rim
    ctx.fillStyle = '#18181b';
    ctx.fillRect(obs.x + 6, obs.y + 6, obs.width - 12, obs.height - 12);

    // Border stroke
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

    // Roof vents / AC units
    ctx.fillStyle = '#52525b';
    ctx.fillRect(obs.x + 18, obs.y + 18, 22, 22);
    ctx.fillRect(obs.x + obs.width - 40, obs.y + obs.height - 35, 24, 18);

    // Sign label if present
    if (obs.label) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 10px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.label, obs.x + obs.width / 2, obs.y + obs.height / 2);
    }
  } else if (obs.type === 'car') {
    // Abandoned Car / Van
    const isPolice = obs.label === 'POLICE';
    const isAmbulance = obs.label === 'AMBULANCE';

    // Body
    ctx.fillStyle = isPolice ? '#1e293b' : isAmbulance ? '#f8fafc' : '#475569';
    ctx.beginPath();
    ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Windshield and roof
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(obs.x + 12, obs.y + 6, obs.width - 24, obs.height - 12);

    // Lightbar for emergency vehicles
    if (isPolice) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(obs.x + obs.width / 2 - 8, obs.y + obs.height / 2 - 4, 6, 8);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(obs.x + obs.width / 2 + 2, obs.y + obs.height / 2 - 4, 6, 8);
    } else if (isAmbulance) {
      // Red Cross
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(obs.x + obs.width / 2 - 6, obs.y + obs.height / 2 - 2, 12, 4);
      ctx.fillRect(obs.x + obs.width / 2 - 2, obs.y + obs.height / 2 - 6, 4, 12);
    }

    // Car label
    if (obs.label) {
      ctx.fillStyle = isAmbulance ? '#ef4444' : '#94a3b8';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.label, obs.x + obs.width / 2, obs.y + obs.height - 8);
    }
  } else if (obs.type === 'barricade') {
    // Road barricade with hazard stripes
    ctx.fillStyle = '#d97706';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Diagonal warning stripes
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = -obs.height; i < obs.width + obs.height; i += 14) {
      ctx.moveTo(obs.x + i, obs.y);
      ctx.lineTo(obs.x + i + obs.height, obs.y + obs.height);
    }
    ctx.stroke();

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  } else if (obs.type === 'sandbag') {
    // Sandbags stack
    ctx.fillStyle = '#a16207';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 1;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  } else {
    // Standard perimeter concrete wall
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  }

  ctx.restore();
}

function drawExitDoor(ctx: CanvasRenderingContext2D, exit: ExitDoor, coinsCollected: number) {
  ctx.save();
  const isOpen = exit.isOpen;

  // Outer gate bunker frame
  ctx.fillStyle = '#18181b';
  ctx.fillRect(exit.x, exit.y, exit.width, exit.height);

  // Glow effect
  ctx.shadowColor = isOpen ? '#10b981' : '#f59e0b';
  ctx.shadowBlur = isOpen ? 16 : 8;

  // Door surface
  ctx.fillStyle = isOpen ? '#065f46' : '#78350f';
  ctx.fillRect(exit.x + 4, exit.y + 4, exit.width - 8, exit.height - 8);

  // Border outline
  ctx.strokeStyle = isOpen ? '#34d399' : '#d97706';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(exit.x, exit.y, exit.width, exit.height);

  // Status Indicator Light (Flashing)
  const pulse = Math.sin(Date.now() / 250) * 0.5 + 0.5;
  ctx.fillStyle = isOpen ? '#10b981' : `rgba(239, 68, 68, ${0.4 + pulse * 0.6})`;
  ctx.beginPath();
  ctx.arc(exit.x + exit.width / 2, exit.y + 12, 6, 0, Math.PI * 2);
  ctx.fill();

  // Exit Sign Text
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Chakra Petch", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EXIT', exit.x + exit.width / 2, exit.y + 26);

  // Subtext: Open or Needed
  if (isOpen) {
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('BUKA!', exit.x + exit.width / 2, exit.y + 42);

    // Glowing arrows pointing into exit
    const arrowOffset = (Date.now() / 300) % 8;
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(exit.x - 14 + arrowOffset, exit.y + exit.height / 2);
    ctx.lineTo(exit.x - 22 + arrowOffset, exit.y + exit.height / 2 - 6);
    ctx.lineTo(exit.x - 22 + arrowOffset, exit.y + exit.height / 2 + 6);
    ctx.fill();
  } else {
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 8px sans-serif';
    const remaining = Math.max(0, exit.requiredCoins - coinsCollected);
    ctx.fillText(`${remaining} koin`, exit.x + exit.width / 2, exit.y + 42);
  }

  ctx.restore();
}

function drawCoin(ctx: CanvasRenderingContext2D, coin: Coin) {
  ctx.save();
  ctx.translate(coin.x, coin.y);

  // Gentle floating oscillation
  const floatY = Math.sin(Date.now() / 200 + coin.id) * 2;
  ctx.translate(0, floatY);

  // Golden glow aura
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 10;

  // Soft pulsing halo for easy visibility
  const pulse = Math.sin(Date.now() / 300 + coin.id) * 0.3 + 0.7;
  ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 * pulse})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, coin.radius + 5, 0, Math.PI * 2);
  ctx.stroke();

  // Outer gold rim
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner coin face
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, 0, coin.radius - 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Star emblem inside coin
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ca8a04';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 0, 1);

  // Shimmer ring
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  ctx.save();
  ctx.translate(player.x, player.y);

  // Invulnerability flicker
  if (player.isInvulnerable) {
    const blink = Math.floor(player.invulnerableTimer * 12) % 2 === 0;
    if (blink) {
      ctx.globalAlpha = 0.4;
    }
  }

  // Flashlight beam illuminating the forward direction
  ctx.save();
  ctx.rotate(player.angle);

  const beamGradient = ctx.createRadialGradient(0, 0, 10, 120, 0, 140);
  beamGradient.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
  beamGradient.addColorStop(0.6, 'rgba(254, 240, 138, 0.12)');
  beamGradient.addColorStop(1, 'rgba(254, 240, 138, 0)');

  ctx.fillStyle = beamGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 130, -Math.PI / 5, Math.PI / 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Rotate player body
  ctx.rotate(player.angle);

  // Tactical Backpack (Dark gray)
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-15, -9, 7, 18, 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Survivor Shoulders & Jacket (Vivid Blue / Navy Survivor Outfit)
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(-9, -13, 14, 26, 4);
  ctx.fill();
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hands & Flashlight held forward
  const handOffset = Math.sin(player.walkCycle) * 2;
  ctx.fillStyle = '#fdba74'; // skin
  // Right Hand
  ctx.beginPath();
  ctx.arc(6 + handOffset, 10, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // Left Hand
  ctx.beginPath();
  ctx.arc(6 - handOffset, -10, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Flashlight casing in hand
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(7, 7, 8, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(14, 7, 2, 4);

  // Survivor Head (Skin tone)
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cap / Hair (Dark brown survival cap)
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(-1, 0, 7.5, -Math.PI / 2, Math.PI / 2, true);
  ctx.fill();
  // Cap brim facing forward
  ctx.fillRect(0, -5, 5, 10);

  ctx.restore();
}

function drawZombie(ctx: CanvasRenderingContext2D, zombie: Zombie) {
  ctx.save();
  ctx.translate(zombie.x, zombie.y);

  // Alert indicator if chasing
  if (zombie.state === 'CHASE') {
    // Pulsing alert ring
    const alertPulse = Math.sin(Date.now() / 150) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 * alertPulse})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, zombie.detectionRadius * 0.9, 0, Math.PI * 2);
    ctx.stroke();

    // "!" Floating Alert Exclamation Mark
    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const bounce = Math.sin(Date.now() / 100) * 3;
    ctx.fillText('!', 0, -18 + bounce);
    ctx.restore();
  }

  // Rotate towards movement direction
  ctx.rotate(zombie.angle);

  // Shambling arm bobbing animation
  const armSwing = Math.sin(zombie.walkCycle) * 4;

  // Reaching Claws / Zombie Hands (Sickly green)
  ctx.fillStyle = '#4ade80'; // Pale rot green
  // Right Arm extended forward
  ctx.beginPath();
  ctx.arc(10 + armSwing, 9, 3.8, 0, Math.PI * 2);
  ctx.fill();
  // Left Arm extended forward
  ctx.beginPath();
  ctx.arc(10 - armSwing, -9, 3.8, 0, Math.PI * 2);
  ctx.fill();

  // Zombie Body / Torso (Ragged dirty olive / dark tattered shirt)
  ctx.fillStyle = zombie.state === 'CHASE' ? '#14532d' : '#1e3a1e';
  ctx.beginPath();
  ctx.roundRect(-8, -13, 14, 26, 4);
  ctx.fill();
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Dirty blood/tear stain on shirt
  ctx.fillStyle = '#881337';
  ctx.beginPath();
  ctx.arc(-2, 3, 3, 0, Math.PI * 2);
  ctx.fill();

  // Zombie Head (Decayed sickly green)
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#166534';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Glowing Red Zombie Eyes
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(4, -3, 1.8, 0, Math.PI * 2);
  ctx.arc(4, 3, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Ragged decaying hair
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(-3, 0, 6, -Math.PI / 2, Math.PI / 2, true);
  ctx.fill();

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const p of engine.particles) {
    ctx.save();
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const ft of engine.floatingTexts) {
    ctx.save();
    const alpha = Math.max(0, ft.life / ft.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ft.color;
    ctx.font = `bold ${ft.size}px "Chakra Petch", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}

function drawGuidanceIndicator(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  const player = engine.player;
  const exitReady = engine.coinsCollected >= engine.exitDoor.requiredCoins;

  if (exitReady) {
    // When exit is ready: show bright pulsing green arrow orbiting player towards exit door
    const exitTargetX = engine.exitDoor.x + engine.exitDoor.width / 2;
    const exitTargetY = engine.exitDoor.y + engine.exitDoor.height / 2;
    const angle = Math.atan2(exitTargetY - player.y, exitTargetX - player.x);

    ctx.save();
    ctx.translate(player.x, player.y);

    const orbitDist = 34 + Math.sin(Date.now() / 180) * 3;
    const arrowX = Math.cos(angle) * orbitDist;
    const arrowY = Math.sin(angle) * orbitDist;

    ctx.translate(arrowX, arrowY);
    ctx.rotate(angle);

    // Glowing green arrow
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-6, -7);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-6, 7);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Floating text above player: "MENUJU EXIT ➔"
    ctx.save();
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MENUJU EXIT ➔', player.x, player.y - 25);
    ctx.restore();
  } else {
    // Show subtle pointer towards the nearest uncollected coin
    let nearestCoin: Coin | null = null;
    let minDist = Infinity;
    for (const c of engine.coins) {
      if (!c.collected) {
        const d = Math.hypot(c.x - player.x, c.y - player.y);
        if (d < minDist) {
          minDist = d;
          nearestCoin = c;
        }
      }
    }

    if (nearestCoin && minDist > 60) {
      const angle = Math.atan2(nearestCoin.y - player.y, nearestCoin.x - player.x);
      ctx.save();
      ctx.translate(player.x, player.y);

      const orbitDist = 28;
      const arrowX = Math.cos(angle) * orbitDist;
      const arrowY = Math.sin(angle) * orbitDist;

      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);

      // Subtle gold indicator
      ctx.fillStyle = 'rgba(250, 204, 21, 0.75)';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-1, 0);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }
}
