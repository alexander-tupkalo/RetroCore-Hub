export const GRID_SIZE = 10;

export const CELL_STATES = {
    EMPTY: 0,
    SHIP: 1,
    HIT: 2,
    MISS: 3
};

// Сбалансированный флот (8 кораблей)
export const SHIP_DEFINITIONS = [
    { id: 'battleship', name: 'BATTLESHIP', size: 4 },
    { id: 'cruiser-1', name: 'CRUISER-1', size: 3 },
    { id: 'cruiser-2', name: 'CRUISER-2', size: 3 },
    { id: 'destroyer-1', name: 'DESTROYER-1', size: 2 },
    { id: 'destroyer-2', name: 'DESTROYER-2', size: 2 },
    { id: 'destroyer-3', name: 'DESTROYER-3', size: 2 },
    { id: 'patrol-1', name: 'PATROL-1', size: 1 },
    { id: 'patrol-2', name: 'PATROL-2', size: 1 }
];