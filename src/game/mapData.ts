import { Coin, ExitDoor, Obstacle, Position, Zombie } from '../types';

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 650;

export const INITIAL_PLAYER_POS: Position = {
  x: 75,
  y: 575,
};

export const INITIAL_EXIT_DOOR: ExitDoor = {
  x: 910,
  y: 35,
  width: 65,
  height: 55,
  requiredCoins: 5,
  isOpen: false,
};

// Walls and obstacles forming the abandoned ruined city layout (balanced for smooth navigation)
export const MAP_OBSTACLES: Obstacle[] = [
  // Outer boundaries (top, bottom, left, right borders)
  { x: 0, y: 0, width: MAP_WIDTH, height: 20, type: 'wall' },
  { x: 0, y: MAP_HEIGHT - 20, width: MAP_WIDTH, height: 20, type: 'wall' },
  { x: 0, y: 0, width: 20, height: MAP_HEIGHT, type: 'wall' },
  { x: MAP_WIDTH - 20, y: 0, width: 20, height: MAP_HEIGHT, type: 'wall' },

  // Building 1: Abandoned Shelter / Warehouse (Lower Left near start)
  { x: 160, y: 470, width: 130, height: 95, type: 'building', label: 'WAREHOUSE' },

  // Building 2: Medical Clinic / Hospital Ruin (Upper Left)
  { x: 160, y: 80, width: 160, height: 120, type: 'building', label: 'CLINIC' },

  // Barricade blocking lower left alley (smaller now for easier evasion)
  { x: 20, y: 410, width: 65, height: 20, type: 'barricade' },

  // Abandoned Police Car in West-Center Street
  { x: 90, y: 280, width: 75, height: 40, type: 'car', label: 'POLICE' },

  // Building 3: Central Bank / Evacuation Office
  { x: 420, y: 80, width: 170, height: 130, type: 'building', label: 'METRO BANK' },

  // Building 4: Central Apartments
  { x: 400, y: 310, width: 140, height: 150, type: 'building', label: 'APARTMENT' },

  // Small sandbag barricade in Central Plaza
  { x: 590, y: 340, width: 20, height: 75, type: 'sandbag' },

  // Abandoned Ambulance in Central South Street
  { x: 280, y: 360, width: 50, height: 70, type: 'car', label: 'AMBULANCE' },

  // Building 5: Grocery / Supply Store (Bottom Right)
  { x: 670, y: 460, width: 150, height: 110, type: 'building', label: 'SUPPLIES' },

  // Abandoned Bus in Mid-East Highway
  { x: 680, y: 230, width: 110, height: 46, type: 'car', label: 'METRO BUS' },

  // Building 6: Power Substation
  { x: 700, y: 80, width: 130, height: 75, type: 'building', label: 'SUBSTATION' },

  // Exit pathway is open and clean - no trap bottleneck!
  { x: 890, y: 150, width: 16, height: 110, type: 'wall' },
];

// 11 Scattered Coins across open avenues so collecting 5 is easy and rewarding!
export const INITIAL_COINS: Omit<Coin, 'collected' | 'rotation'>[] = [
  { id: 1, x: 90, y: 500, radius: 12, value: 10 }, // Near starting point (easy pick!)
  { id: 2, x: 90, y: 180, radius: 12, value: 10 }, // Northwest road
  { id: 3, x: 240, y: 280, radius: 12, value: 10 }, // West plaza
  { id: 4, x: 350, y: 130, radius: 12, value: 10 }, // Between Clinic & Bank
  { id: 5, x: 340, y: 490, radius: 12, value: 10 }, // South boulevard
  { id: 6, x: 500, y: 520, radius: 12, value: 10 }, // South open avenue
  { id: 7, x: 620, y: 140, radius: 12, value: 10 }, // East of Bank
  { id: 8, x: 630, y: 340, radius: 12, value: 10 }, // Mid plaza
  { id: 9, x: 750, y: 360, radius: 12, value: 10 }, // East avenue
  { id: 10, x: 840, y: 480, radius: 12, value: 10 }, // Southeast corner
  { id: 11, x: 850, y: 220, radius: 12, value: 10 }, // Road approaching exit
];

// Zombies: Reduced to 4 slow, fair zombies with smaller detection range and generous avoidance gaps
export const INITIAL_ZOMBIES: Omit<Zombie, 'currentSpeed' | 'angle' | 'state' | 'currentPatrolIndex' | 'patrolWaitTimer' | 'alertAnimation' | 'walkCycle'>[] = [
  // Zombie 1: West Avenue Slow Roamer
  {
    id: 1,
    x: 80,
    y: 350,
    radius: 13,
    normalSpeed: 0.8,
    chaseSpeed: 1.5,
    detectionRadius: 115,
    patrolPoints: [
      { x: 70, y: 350 },
      { x: 70, y: 230 },
      { x: 190, y: 240 },
      { x: 80, y: 350 },
    ],
  },
  // Zombie 2: Central South Street
  {
    id: 2,
    x: 380,
    y: 530,
    radius: 13,
    normalSpeed: 0.85,
    chaseSpeed: 1.55,
    detectionRadius: 120,
    patrolPoints: [
      { x: 360, y: 530 },
      { x: 470, y: 530 },
      { x: 380, y: 480 },
    ],
  },
  // Zombie 3: Central Plaza
  {
    id: 3,
    x: 560,
    y: 260,
    radius: 13,
    normalSpeed: 0.8,
    chaseSpeed: 1.5,
    detectionRadius: 120,
    patrolPoints: [
      { x: 560, y: 260 },
      { x: 610, y: 380 },
      { x: 520, y: 380 },
    ],
  },
  // Zombie 4: Upper Corridor (Bank area)
  {
    id: 4,
    x: 400,
    y: 55,
    radius: 13,
    normalSpeed: 0.85,
    chaseSpeed: 1.55,
    detectionRadius: 120,
    patrolPoints: [
      { x: 380, y: 55 },
      { x: 600, y: 55 },
    ],
  },
];
