export class GameState {
    constructor() {
        this.playerHp = 0;
        this.playerMaxHp = 0;
        this.playerShield = 0;
        this.enemyHp = 0;
        this.enemyMaxHp = 0;
        this.energy = 0;
        this.maxEnergy = 0;
        this.deck = [];
        this.hand = [];
        this.discard = [];
        this.enemyIntent = { type: 'attack', value: 10 };
        
        // Прогрессия
        this.currentLevel = 0;
        this.currentEnemy = null;
        
        // НОВОЕ: Твоя личная колода, которая растет после наград
        this.permanentDeckPool = []; 

        this.reset();
    }

    reset() {
        this.playerHp = 80;
        this.playerMaxHp = 80;
        this.playerShield = 0;
        this.enemyHp = 50;
        this.enemyMaxHp = 50;
        this.energy = 3;
        this.maxEnergy = 3;
        this.deck = [];
        this.hand = [];
        this.discard = [];
        this.enemyIntent = { type: 'attack', value: 10 };
        this.currentLevel = 0;
        this.currentEnemy = null;
        this.permanentDeckPool = []; 
    }
}