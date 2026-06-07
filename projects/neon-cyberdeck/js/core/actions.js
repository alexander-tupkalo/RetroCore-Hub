import { shuffle } from './deck.js';

export function initBattle(state, createDeckFn, shuffleFn) {
    // При старте игры permanentDeckPool пуст, поэтому createDeckFn() берет базовые карты
    state.deck = createDeckFn(state.permanentDeckPool);
    shuffleFn(state.deck);
    state.energy = state.maxEnergy;
    state.playerShield = 0;
}

export function drawCards(state, amount) {
    if (amount <= 0) return;
    for (let i = 0; i < amount; i++) {
        if (state.deck.length === 0) {
            if (state.discard.length === 0) break; 
            state.deck.push(...state.discard);
            state.discard.length = 0; 
            shuffle(state.deck);
        }
        const drawnCard = state.deck.pop();
        if (drawnCard) state.hand.push(drawnCard);
    }
}

export function playCard(state, cardId) {
    const cardIndex = state.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return false;
    
    const card = state.hand[cardIndex];
    if (state.energy < card.cost) return false;

    state.energy -= card.cost;

    if (card.type === 'attack') {
        state.enemyHp = Math.max(0, state.enemyHp - card.value);
    } else if (card.type === 'defense') {
        state.playerShield += card.value;
    }

    state.hand.splice(cardIndex, 1);
    state.discard.push(card);
    return true;
}

export function endTurn(state, drawCardsFn) {
    if (state.enemyIntent) {
        if (state.enemyIntent.type === 'attack') {
            let incomingDamage = state.enemyIntent.value;
            if (state.playerShield > 0) {
                if (incomingDamage > state.playerShield) {
                    incomingDamage -= state.playerShield;
                    state.playerShield = 0;
                    state.playerHp = Math.max(0, state.playerHp - incomingDamage);
                } else {
                    state.playerShield -= incomingDamage;
                }
            } else {
                state.playerHp = Math.max(0, state.playerHp - incomingDamage);
            }
        }
    }

    state.discard.push(...state.hand);
    state.hand.length = 0; 
    state.energy = state.maxEnergy;
    state.playerShield = 0;
    drawCardsFn(state, 5);

    if (state.currentEnemy) {
        const enemy = state.currentEnemy;
        if (enemy.baseDefend > 0 && Math.random() > 0.5) {
            state.enemyIntent = { type: 'defend', value: enemy.baseDefend };
        } else {
            const variance = Math.floor(Math.random() * 5) - 2;
            const attackDmg = Math.max(1, enemy.baseAttack + variance);
            state.enemyIntent = { type: 'attack', value: attackDmg };
        }
    }
}

export function checkGameEnd(state) {
    if (state.playerHp <= 0) return 'lose';
    if (state.enemyHp <= 0) return 'win';
    return null;
}

// НОВОЕ: Добавляет карту в твое постоянное хранилище
export function addCardToPlayerPool(state, cardData) {
    state.permanentDeckPool.push({ ...cardData });
}

export function advanceLevel(state, enemiesArray, createDeckFn, shuffleFn, drawCardsFn) {
    state.currentLevel++;
    if (state.currentLevel >= enemiesArray.length) return false; 

    const newEnemyData = enemiesArray[state.currentLevel];
    state.currentEnemy = { ...newEnemyData };
    state.enemyHp = state.currentEnemy.hp;
    state.enemyMaxHp = state.currentEnemy.maxHp;

    state.playerHp = state.playerMaxHp;
    state.playerShield = 0;
    state.maxEnergy = 3 + state.currentLevel;

    // ВАЖНО: Передаем твой обновленный пул карт при создании новой колоды на уровень!
    state.deck = createDeckFn(state.permanentDeckPool);
    shuffleFn(state.deck);
    drawCardsFn(state, 5);

    return true;
}