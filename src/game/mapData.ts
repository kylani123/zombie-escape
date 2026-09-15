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

// Walls and obstacles forming the abandoned ruined city layout
export const MAP_OBSTACLES: Obstacle[] = [
  // Outer boundaries (top, bottom, left, right borders)
  { x: 0, y: 0, width: MAP_WIDTH, height: 20, type: 'wall' },
  { x: 0, y: MAP_HEIGHT - 20, width: MAP_WIDTH, height: 20, type: 'wall' },
  { x: 0, y: 0, width: 20, height: MAP_HEIGHT, type: 'wall' },
  { x: MAP_WIDTH - 20, y: 0, width: 20, height: MAP_HEIGHT, type: 'wall' },

  // Building 1: Abandoned Shelter / Warehouse (Lower Left near start)
  { x: 150, y: 460, width: 140, height: 110, type: 'building', label: 'WAREHOUSE' },

  // Building 2: Medical Clinic / Hospital Ruin (Upper Left)
  { x: 150, y: 80, width: 170, height: 130, type: 'building', label: 'CLINIC' },

  // Barricade blocking lower left alley
  { x: 20, y: 400, width: 80, height: 24, type: 'barricade' },

  // Abandoned Police Car & Van in West-Center Street
  { x: 80, y: 270, width: 80, height: 44, type: 'car', label: 'POLICE' },

  // Building 3: Central Bank / Evacuation Office
  { x: 420, y: 80, width: 180, height: 140, type: 'building', label: 'METRO BANK' },

  // Building 4: Central Apartments
  { x: 390, y: 300, width: 150, height: 160, type: 'building', label: 'APARTMENT' },

  // Barricade in Central Plaza
  { x: 590, y: 320, width: 25, height: 100, type: 'sandbag' },

  // Abandoned Ambulance in Central South Street
  { x: 280, y: 360, width: 50, height: 75, type: 'car', label: 'AMBULANCE' },

  // Building 5: Grocery / Supply Store (Bottom Right)
  { x: 670, y: 450, width: 160, height: 120, type: 'building', label: 'SUPPLIES' },

  // Abandoned Bus / Roadblock in Mid-East Highway
  { x: 680, y: 220, width: 120, height: 50, type: 'car', label: 'METRO BUS' },

  // Building 6: Power Substation (Top Right flanking Exit bunker)
  { x: 690, y: 80, width: 140, height: 80, type: 'building', label: 'SUBSTATION' },

  // Concrete Wall protecting Exit perimeter (channels player into checkpoint)
  { x: 890, y: 90, width: 20, height: 200, type: 'wall' },
  { x: 830, y: 270, width: 80, height: 20, type: 'barricade' },

  // Concrete barrier near south road
  { x: 480, y: 530, width: 100, height: 25, type: 'barricade' },
];

// Initial Coins layout (8 scattered coins across map)
export const INITIAL_COINS: Omit<Coin, 'collected' | 'rotation'>[] = [
  { id: 1, x: 70, y: 150, radius: 11, value: 10 }, // Far NW alley
  { id: 2, x: 240, y: 270, radius: 11, value: 10 }, // Near clinic & car
  { id: 3, x: 85, y: 470, radius: 11, value: 10 }, // Below west barricade
  { id: 4, x: 350, y: 120, radius: 11, value: 10 }, // Alley between clinic & bank
  { id: 5, x: 490, y: 485, radius: 11, value: 10 }, // South corridor
  { id: 6, x: 620, y: 150, radius: 11, value: 10 }, // East of bank
  { id: 7, x: 845, y: 510, radius: 11, value: 10 }, // Southeast corner by supplies
  { id: 8, x: 730, y: 350, radius: 11, value: 10 }, // Mid-east plaza
];

// Initial Zombies configuration
export const INITIAL_ZOMBIES: Omit<Zombie, 'currentSpeed' | 'angle' | 'state' | 'currentPatrolIndex' | 'patrolWaitTimer' | 'alertAnimation' | 'walkCycle'>[] = [
  // Zombie 1: West Avenue Patroller
  {
    id: 1,
    x: 80,
    y: 350,
    radius: 14,
    normalSpeed: 1.1,
    chaseSpeed: 2.1,
    detectionRadius: 160,
    patrolPoints: [
      { x: 70, y: 340 },
      { x: 70, y: 200 },
      { x: 190, y: 230 },
      { x: 80, y: 350 },
    ],
  },
  // Zombie 2: Central Street Roamer
  {
    id: 2,
    x: 350,
    y: 530,
    radius: 14,
    normalSpeed: 1.2,
    chaseSpeed: 2.2,
    detectionRadius: 170,
    patrolPoints: [
      { x: 340, y: 530 },
      { x: 450, y: 530 },
      { x: 400, y: 470 },
      { x: 250, y: 480 },
    ],
  },
  // Zombie 3: Central Plaza Stalker
  {
    id: 3,
    x: 580,
    y: 250,
    radius: 14,
    normalSpeed: 1.15,
    chaseSpeed: 2.15,
    detectionRadius: 165,
    patrolPoints: [
      { x: 570, y: 250 },
      { x: 630, y: 380 },
      { x: 560, y: 420 },
      { x: 480, y: 270 },
    ],
  },
  // Zombie 4: Upper Alley Lurker (Near Bank & Clinic)
  {
    id: 4,
    x: 370,
    y: 55,
    radius: 14,
    normalSpeed: 1.2,
    chaseSpeed: 2.2,
    detectionRadius: 160,
    patrolPoints: [
      { x: 370, y: 55 },
      { x: 620, y: 55 },
      { x: 500, y: 60 },
    ],
  },
  // Zombie 5: Exit Checkpoint Guard (Guards access corridor to Exit door)
  {
    id: 5,
    x: 770,
    y: 190,
    radius: 14,
    normalSpeed: 1.25,
    chaseSpeed: 2.25,
    detectionRadius: 180,
    patrolPoints: [
      { x: 740, y: 190 },
      { x: 850, y: 200 },
      { x: 840, y: 130 },
      { x: 750, y: 130 },
    ],
  },
  // Zombie 6: Southeast Supplies Scavenger
  {
    id: 6,
    x: 750,
    y: 580,
    radius: 14,
    normalSpeed: 1.1,
    chaseSpeed: 2.1,
    detectionRadius: 155,
    patrolPoints: [
      { x: 750, y: 580 },
      { x: 860, y: 580 },
      { x: 860, y: 440 },
      { x: 640, y: 440 },
    ],
  },
];
