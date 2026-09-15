export type GameState = 'MENU' | 'PLAYING' | 'HOW_TO_PLAY' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number; // in radians
  lives: number;
  maxLives: number;
  isInvulnerable: boolean;
  invulnerableTimer: number; // remaining immunity time in seconds
  walkCycle: number;
}

export type ZombieState = 'PATROL' | 'CHASE';

export interface Zombie {
  id: number;
  x: number;
  y: number;
  radius: number;
  normalSpeed: number;
  chaseSpeed: number;
  currentSpeed: number;
  angle: number;
  state: ZombieState;
  patrolPoints: Position[];
  currentPatrolIndex: number;
  patrolWaitTimer: number;
  detectionRadius: number;
  alertAnimation: number; // for showing "!"
  walkCycle: number;
}

export interface Coin {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  value: number;
  rotation: number;
}

export interface ExitDoor {
  x: number;
  y: number;
  width: number;
  height: number;
  requiredCoins: number;
  isOpen: boolean;
}

export type ObstacleType = 'wall' | 'building' | 'car' | 'barricade' | 'sandbag';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  color?: string;
  label?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface GameScore {
  score: number;
  coinsCollected: number;
  totalCoins: number;
  lives: number;
  timeElapsed: number; // seconds
}
