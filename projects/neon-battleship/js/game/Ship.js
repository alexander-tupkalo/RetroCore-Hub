export class Ship {
    constructor(id, name, size) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.positions = []; // Массив объектов {x, y}
        this.hits = 0;
    }

    addPosition(x, y) {
        this.positions.push({ x, y });
    }

    receiveHit() {
        this.hits++;
    }

    isDestroyed() {
        return this.hits >= this.size;
    }
}