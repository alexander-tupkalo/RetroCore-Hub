export class GridRenderer {
    /**
     * @param {string} boardId - ID элемента grid-board
     * @param {string} type - 'player' или 'enemy'
     */
    constructor(boardId, type) {
        this.boardEl = document.getElementById(boardId);
        this.type = type;
        this.cells = []; // Двумерный массив для быстрого доступа к ячейкам
    }

    render() {
        this.boardEl.innerHTML = '';
        this.cells = [];

        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for (let y = 0; y <= 10; y++) {
            this.cells[y] = [];
            for (let x = 0; x <= 10; x++) {
                const el = document.createElement('div');

                // Верхний левый угол пустой
                if (x === 0 && y === 0) {
                    el.classList.add('coord');
                } 
                // Верхняя строка (цифры)
                else if (y === 0) {
                    el.classList.add('coord');
                    el.textContent = x;
                } 
                // Левый столбец (буквы)
                else if (x === 0) {
                    el.classList.add('coord');
                    el.textContent = letters[y - 1];
                } 
                // Игровые ячейки
                else {
                    el.classList.add('cell');
                    el.dataset.x = x;
                    el.dataset.y = y;
                    this.cells[y][x] = el;
                }

                this.boardEl.appendChild(el);
            }
        }
    }

    /**
     * Получить DOM элемент ячейки по координатам
     */
    getCell(x, y) {
        if (this.cells[y] && this.cells[y][x]) {
            return this.cells[y][x];
        }
        return null;
    }

        /**
     * Отрисовывает голографический силуэт корабля
     */
    renderShip(ship) {
        ship.positions.forEach(pos => {
            const cell = this.getCell(pos.x, pos.y);
            if (cell) {
                cell.classList.add('cell-ship');
            }
        });
        
    }

        /**
     * Отрисовка попадания
     */
    renderHit(x, y) {
        const cell = this.getCell(x, y);
        if (cell) cell.classList.add('cell-hit');
    }

    /**
     * Отрисовка промаха
     */
    renderMiss(x, y) {
        const cell = this.getCell(x, y);
        if (cell) cell.classList.add('cell-miss');
    }
}