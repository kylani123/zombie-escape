import { Coin, ExitDoor, FloatingText, GameScore, Obstacle, Particle, Player, Position, Zombie } from '../types';
import { sound } from '../utils/audio';
import {
  INITIAL_COINS,
  INITIAL_EXIT_DOOR,
  INITIAL_PLAYER_POS,
  INITIAL_ZOMBIES,
  MAP_HEIGHT,
  MAP_OBSTACLES,
  MAP_WIDTH,
} from './mapData';

// Clamp utility
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Circle-Rectangle Collision Resolution
export function resolveCircleRectCollision(
  cx: number,
  cy: number,
  radius: number,
  rect: Obstacle
): { x: number; y: number; collided: boolean } {
  const closestX = clamp(cx, rect.x, rect.x + rect.width);
  const closestY = clamp(cy, rect.y, rect.y + rect.height);

  const distX = cx - closestX;
  const distY = cy - closestY;
  const distSq = distX * distX + distY * distY;

  if (distSq < radius * radius) {
    const dist = Math.sqrt(distSq);
    if (dist === 0) {
      // Circle center inside rect; push out to nearest edge
      const toLeft = Math.abs(cx - rect.x);
      const toRight = Math.abs(cx - (rect.x + rect.width));
      const toTop = Math.abs(cy - rect.y);
      const toBottom = Math.abs(cy - (rect.y + rect.height));
      const minEdge = Math.min(toLeft, toRight, toTop, toBottom);

      if (minEdge === toLeft) return { x: rect.x - radius, y: cy, collided: true };
      if (minEdge === toRight) return { x: rect.x + rect.width + radius, y: cy, collided: true };
      if (minEdge === toTop) return { x: cx, y: rect.y - radius, collided: true };
      return { x: cx, y: rect.y + rect.height + radius, collided: true };
    }

    const overlap = radius - dist;
    const nx = distX / dist;
    const ny = distY / dist;

    return {
      x: cx + nx * overlap,
      y: cy + ny * overlap,
      collided: true,
    };
  }

  return { x: cx, y: cy, collided: false };
}

export class GameEngine {
  public player: Player;
  public zombies: Zombie[];
  public coins: Coin[];
  public exitDoor: ExitDoor;
  public obstacles: Obstacle[];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  public score: number = 0;
  public coinsCollected: number = 0;
  public timeElapsed: number = 0;
  public screenShake: number = 0;
  public flashRed: number = 0;

  private lastGrowlTime: number = 0;
  private nextTextId: number = 1;

  constructor() {
    this.obstacles = [...MAP_OBSTACLES];
    this.exitDoor = { ...INITIAL_EXIT_DOOR };
    this.player = this.createPlayer();
    this.zombies = this.createZombies();
    this.coins = this.createCoins();
  }

  public reset() {
    this.score = 0;
    this.coinsCollected = 0;
    this.timeElapsed = 0;
    this.screenShake = 0;
    this.flashRed = 0;
    this.particles = [];
    this.floatingTexts = [];
    this.exitDoor = { ...INITIAL_EXIT_DOOR, isOpen: false };
    this.player = this.createPlayer();
    this.zombies = this.createZombies();
    this.coins = this.createCoins();
  }

  private createPlayer(): Player {
    return {
      x: INITIAL_PLAYER_POS.x,
      y: INITIAL_PLAYER_POS.y,
      radius: 14,
      speed: 3.8, // Faster player movement to comfortably dodge zombies
      angle: -Math.PI / 2, // facing upward initially
      lives: 3,
      maxLives: 3,
      isInvulnerable: false,
      invulnerableTimer: 0,
      walkCycle: 0,
    };
  }

  private createZombies(): Zombie[] {
    return INITIAL_ZOMBIES.map((z) => ({
      ...z,
      currentSpeed: z.normalSpeed,
      angle: 0,
      state: 'PATROL',
      currentPatrolIndex: 0,
      patrolWaitTimer: 0,
      alertAnimation: 0,
      walkCycle: Math.random() * Math.PI * 2,
    }));
  }

  private createCoins(): Coin[] {
    return INITIAL_COINS.map((c) => ({
      ...c,
      collected: false,
      rotation: Math.random() * Math.PI * 2,
    }));
  }

  public update(
    input: { dx: number; dy: number },
    dt: number,
    callbacks: {
      onDamage: (remainingLives: number) => void;
      onGameOver: (finalScore: GameScore) => void;
      onVictory: (finalScore: GameScore) => void;
      onCoinCollected: (count: number, total: number) => void;
    }
  ) {
    this.timeElapsed += dt;

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 15);
    }
    if (this.flashRed > 0) {
      this.flashRed = Math.max(0, this.flashRed - dt * 3);
    }

    // --- Update Invulnerability ---
    if (this.player.isInvulnerable) {
      this.player.invulnerableTimer -= dt;
      if (this.player.invulnerableTimer <= 0) {
        this.player.isInvulnerable = false;
        this.player.invulnerableTimer = 0;
      }
    }

    // --- Update Player Movement ---
    if (input.dx !== 0 || input.dy !== 0) {
      const len = Math.hypot(input.dx, input.dy);
      const nx = input.dx / len;
      const ny = input.dy / len;

      let nextX = this.player.x + nx * this.player.speed;
      let nextY = this.player.y + ny * this.player.speed;

      this.player.angle = Math.atan2(ny, nx);
      this.player.walkCycle += dt * 10;

      // Keep inside map bounds
      nextX = clamp(nextX, this.player.radius + 20, MAP_WIDTH - this.player.radius - 20);
      nextY = clamp(nextY, this.player.radius + 20, MAP_HEIGHT - this.player.radius - 20);

      // Collide with obstacles (sliding)
      for (const obstacle of this.obstacles) {
        const res = resolveCircleRectCollision(nextX, nextY, this.player.radius, obstacle);
        nextX = res.x;
        nextY = res.y;
      }

      this.player.x = nextX;
      this.player.y = nextY;
    }

    // --- Check Exit Door Collision ---
    const exitOverlap = resolveCircleRectCollision(
      this.player.x,
      this.player.y,
      this.player.radius,
      {
        x: this.exitDoor.x,
        y: this.exitDoor.y,
        width: this.exitDoor.width,
        height: this.exitDoor.height,
        type: 'wall',
      }
    );

    if (exitOverlap.collided) {
      if (this.coinsCollected >= this.exitDoor.requiredCoins) {
        // Player escaped!
        sound.playVictory();
        this.spawnVictoryParticles(this.player.x, this.player.y);
        const finalScore = this.getGameScore();
        callbacks.onVictory(finalScore);
        return;
      } else {
        // Not enough coins
        const needed = this.exitDoor.requiredCoins - this.coinsCollected;
        this.addFloatingText(
          this.exitDoor.x + 30,
          this.exitDoor.y - 10,
          `Butuh ${needed} koin lagi!`,
          '#f59e0b'
        );
      }
    }

    // Update Exit Door Open status
    if (this.coinsCollected >= this.exitDoor.requiredCoins && !this.exitDoor.isOpen) {
      this.exitDoor.isOpen = true;
      sound.playExitUnlock();
      this.addFloatingText(
        this.exitDoor.x + 30,
        this.exitDoor.y - 15,
        'PINTU EXIT DIBUKA!',
        '#10b981',
        18
      );
    }

    // --- Update Coins ---
    for (const coin of this.coins) {
      if (!coin.collected) {
        coin.rotation += dt * 3.5;
        const distToPlayer = Math.hypot(this.player.x - coin.x, this.player.y - coin.y);

        // Generous pickup radius so collecting coins feels smooth and responsive
        if (distToPlayer < this.player.radius + coin.radius + 6) {
          coin.collected = true;
          this.coinsCollected += 1;
          this.score += coin.value;

          sound.playCoin();
          this.spawnCoinParticles(coin.x, coin.y);
          this.addFloatingText(coin.x, coin.y - 10, '+10 Poin', '#fbbf24', 16);

          callbacks.onCoinCollected(this.coinsCollected, this.coins.length);
        }
      }
    }

    // --- Update Zombies ---
    for (const zombie of this.zombies) {
      zombie.walkCycle += dt * 6;

      const distToPlayer = Math.hypot(this.player.x - zombie.x, this.player.y - zombie.y);

      // AI Decision: Patrol vs Chase
      if (distToPlayer <= zombie.detectionRadius) {
        if (zombie.state !== 'CHASE') {
          zombie.state = 'CHASE';
          zombie.alertAnimation = 1.0;
          const now = performance.now();
          if (now - this.lastGrowlTime > 2500) {
            sound.playZombieGrowl();
            this.lastGrowlTime = now;
          }
        }
        zombie.currentSpeed = zombie.chaseSpeed;
        zombie.angle = Math.atan2(this.player.y - zombie.y, this.player.x - zombie.x);
      } else if (distToPlayer > zombie.detectionRadius * 1.35) {
        zombie.state = 'PATROL';
        zombie.currentSpeed = zombie.normalSpeed;
      }

      if (zombie.alertAnimation > 0) {
        zombie.alertAnimation = Math.max(0, zombie.alertAnimation - dt * 1.5);
      }

      // Move Zombie
      let targetX = zombie.x;
      let targetY = zombie.y;

      if (zombie.state === 'CHASE') {
        targetX = this.player.x;
        targetY = this.player.y;
      } else {
        // Waypoint patrol
        const currentTarget = zombie.patrolPoints[zombie.currentPatrolIndex];
        const distToWaypoint = Math.hypot(currentTarget.x - zombie.x, currentTarget.y - zombie.y);

        if (distToWaypoint < 15) {
          zombie.currentPatrolIndex = (zombie.currentPatrolIndex + 1) % zombie.patrolPoints.length;
        } else {
          targetX = currentTarget.x;
          targetY = currentTarget.y;
        }
      }

      const zdx = targetX - zombie.x;
      const zdy = targetY - zombie.y;
      const zlen = Math.hypot(zdx, zdy);

      if (zlen > 2) {
        zombie.angle = Math.atan2(zdy, zdx);
        let nextZX = zombie.x + (zdx / zlen) * zombie.currentSpeed;
        let nextZY = zombie.y + (zdy / zlen) * zombie.currentSpeed;

        // Keep inside map bounds
        nextZX = clamp(nextZX, zombie.radius + 20, MAP_WIDTH - zombie.radius - 20);
        nextZY = clamp(nextZY, zombie.radius + 20, MAP_HEIGHT - zombie.radius - 20);

        // Collide with obstacles
        for (const obstacle of this.obstacles) {
          const res = resolveCircleRectCollision(nextZX, nextZY, zombie.radius, obstacle);
          nextZX = res.x;
          nextZY = res.y;
        }

        zombie.x = nextZX;
        zombie.y = nextZY;
      }

      // Zombie-Player collision check (touching zombie)
      if (!this.player.isInvulnerable) {
        const contactDist = Math.hypot(this.player.x - zombie.x, this.player.y - zombie.y);
        if (contactDist < this.player.radius + zombie.radius - 4) {
          // Take Damage!
          this.player.lives -= 1;
          this.player.isInvulnerable = true;
          this.player.invulnerableTimer = 1.8; // 1.8 seconds immunity gives plenty of time to escape!

          this.screenShake = 12;
          this.flashRed = 1.0;
          sound.playDamage();
          this.spawnHitParticles(this.player.x, this.player.y);
          this.addFloatingText(this.player.x, this.player.y - 20, '-1 NYAWA!', '#ef4444', 18);

          callbacks.onDamage(this.player.lives);

          if (this.player.lives <= 0) {
            sound.playGameOver();
            const finalScore = this.getGameScore();
            callbacks.onGameOver(finalScore);
            return;
          }
        }
      }
    }

    // --- Update Particles ---
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // --- Update Floating Texts ---
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= dt * 25;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  public getGameScore(): GameScore {
    return {
      score: this.score,
      coinsCollected: this.coinsCollected,
      totalCoins: this.coins.length,
      lives: this.player.lives,
      timeElapsed: Math.round(this.timeElapsed),
    };
  }

  public addFloatingText(x: number, y: number, text: string, color: string, size = 15) {
    // Avoid duplicate texts in the exact same spot within short duration
    const existing = this.floatingTexts.find((t) => t.text === text && Math.hypot(t.x - x, t.y - y) < 20);
    if (existing) return;

    this.floatingTexts.push({
      id: this.nextTextId++,
      x,
      y,
      text,
      color,
      size,
      life: 1.2,
      maxLife: 1.2,
    });
  }

  private spawnCoinParticles(x: number, y: number) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.2;
      const speed = 1.2 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.3 ? '#facc15' : '#fef08a',
        size: 3 + Math.random() * 3,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
      });
    }
  }

  private spawnHitParticles(x: number, y: number) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? '#ef4444' : '#dc2626',
        size: 3 + Math.random() * 3.5,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
      });
    }
  }

  private spawnVictoryParticles(x: number, y: number) {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      const colors = ['#10b981', '#34d399', '#fbbf24', '#60a5fa', '#f43f5e'];
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 4,
        life: 0.8 + Math.random() * 0.5,
        maxLife: 1.3,
      });
    }
  }
}
