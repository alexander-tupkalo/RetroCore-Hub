import { GRID_SIZE, CELL_STATES } from '../core/Constants.js';

export class Board {
    constructor() {
        // Создаем пустую матрицу 10x10 (индексы 1-10 для удобства)
        this.grid = Array.from({ length: GRID_SIZE + 1 }, () => 
            Array.from({ length: GRID_SIZE + 1 }, () => CELL_STATES.EMPTY)
        );
        this.ships = [];
    }

    /**
     * Проверяет, можно ли поставить корабль в точку (x,y) с учетом размера и направления
     */
    _canPlace(ship, startX, startY, isHorizontal) {
        for (let i = 0; i < ship.size; i++) {
            const x = isHorizontal ? startX + i : startX;
            const y = isHorizontal ? startY : startY + i;

            // Выход за границы поля
            if (x < 1 || x > GRID_SIZE || y < 1 || y > GRID_SIZE) return false;

            // Проверка самой ячейки и всех соседних (запрет на касание)
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const checkX = x + dx;
                    const checkY = y + dy;
                    
                    if (checkX >= 1 && checkX <= GRID_SIZE && checkY >= 1 && checkY <= GRID_SIZE) {
                        if (this.grid[checkY][checkX] !== CELL_STATES.EMPTY) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     * Автоматическая случайная расстановка корабля
     */
    placeShipRandomly(ship) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 1000) {
            attempts++;
            const isHorizontal = Math.random() > 0.5;
            const startX = Math.floor(Math.random() * GRID_SIZE) + 1;
            const startY = Math.floor(Math.random() * GRID_SIZE) + 1;

            if (this._canPlace(ship, startX, startY, isHorizontal)) {
                for (let i = 0; i < ship.size; i++) {
                    const x = isHorizontal ? startX + i : startX;
                    const y = isHorizontal ? startY : startY + i;
                    
                    this.grid[y][x] = CELL_STATES.SHIP;
                    ship.addPosition(x, y);
                }
                this.ships.push(ship);
                placed = true;
            }
        }
        
        if (!placed) console.error(`Failed to place ${ship.name}!`);
    }

    /**
     * Обработка выстрела по доске
     * Возвращает объект с результатом
     */
    receiveAttack(x, y) {
        if (this.grid[y][x] === CELL_STATES.SHIP) {
            this.grid[y][x] = CELL_STATES.HIT;
            
            // Ищем какой корабль был hit
            const hitShip = this.ships.find(ship => 
                ship.positions.some(pos => pos.x === x && pos.y === y)
            );
            
            if (hitShip) {
                hitShip.receiveHit();
                return {
                    isHit: true,
                    ship: hitShip,
                    isDestroyed: hitShip.isDestroyed()
                };
            }
        } else if (this.grid[y][x] === CELL_STATES.EMPTY) {
            this.grid[y][x] = CELL_STATES.MISS;
            return { isHit: false };
        }
        
        return null; // Уже стреляли сюда
    }

    allShipsDestroyed() {
        return this.ships.every(ship => ship.isDestroyed());
    }
}