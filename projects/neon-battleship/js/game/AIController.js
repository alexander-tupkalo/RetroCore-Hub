import { GRID_SIZE } from '../core/Constants.js';

export class AIController {
    constructor() {
        this.visited = new Set(); // Стреляли сюда уже или нет
        this.targetQueue = [];   // Очередь ячеек для добивания
    }

    _key(x, y) { return `${x},${y}`; }

    _isValid(x, y) {
        return x >= 1 && x <= GRID_SIZE && y >= 1 && y <= GRID_SIZE;
    }

    /**
     * ИИ делает ход. Возвращает координаты {x, y}
     */
    getMove() {
        let x, y;

        // Если есть ячейки для добивания (режим Target)
        if (this.targetQueue.length > 0) {
            let target = this.targetQueue.shift();
            x = target.x;
            y = target.y;
            
            // Если почему-то уже стреляли сюда (могло остаться от предыдущего добивания), пропускаем
            while (this.visited.has(this._key(x, y)) && this.targetQueue.length > 0) {
                target = this.targetQueue.shift();
                x = target.x;
                y = target.y;
            }
        } 
        // Иначе случайный выстрел (режим Hunt)
        else {
            do {
                x = Math.floor(Math.random() * GRID_SIZE) + 1;
                y = Math.floor(Math.random() * GRID_SIZE) + 1;
            } while (this.visited.has(this._key(x, y)));
        }

        this.visited.add(this._key(x, y));
        return { x, y };
    }

    /**
     * Вызывается, если ИИ попал. Добавляет соседние ячейки в очередь на обстрел
     */
    processHit(x, y) {
        const directions = [
            {dx: 0, dy: -1}, // Вверх
            {dx: 0, dy: 1},  // Вниз
            {dx: -1, dy: 0}, // Влево
            {dx: 1, dy: 0}   // Вправо
        ];

        directions.forEach(dir => {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            const key = this._key(nx, ny);

            // Если ячейка в пределах поля и мы туда еще не стреляли
            if (this._isValid(nx, ny) && !this.visited.has(key)) {
                this.targetQueue.push({ x: nx, y: ny });
                this.visited.add(key); // Помечаем сразу, чтобы не дублировать в очереди
            }
        });
    }
}