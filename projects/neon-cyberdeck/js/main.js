import { STARTING_DECK_POOL, ENEMIES, RARE_CARD_POOL, createDeck } from './config.js';
import { shuffle } from './core/deck.js';

import { GameState } from './core/state.js';
import { initBattle, drawCards, playCard, endTurn, checkGameEnd, advanceLevel, addCardToPlayerPool } from './core/actions.js';
import { renderUI, hideEndScreen, showRewardScreen } from './core/ui.js';
import { setupDragAndDrop } from './core/input.js';

const state = new GameState();

function getRandomRewards(pool, amount) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
}

function startGame() {
    state.reset();
    // Копируем стартовые карты в твой постоянный пул
    state.permanentDeckPool = STARTING_DECK_POOL.map(c => ({...c})); 
    
    const firstEnemy = ENEMIES[state.currentLevel];
    state.currentEnemy = { ...firstEnemy };
    state.enemyHp = state.currentEnemy.hp;
    state.enemyMaxHp = state.currentEnemy.maxHp;
    
    initBattle(state, createDeck, shuffle);
    drawCards(state, 5);
    
    hideEndScreen();
    renderUI(state);
}

const handleCardPlay = (cardId) => {
    const wasPlayed = playCard(state, cardId);
    if (wasPlayed) {
        renderUI(state);
        const result = checkGameEnd(state);
        if (result === 'win') {
            const isFinalWin = (state.currentLevel >= ENEMIES.length - 1);
            if (isFinalWin) {
                // ЗАЧИСТКА ВСЕХ УЗЛОВ
                const overlay = document.getElementById('game-over-overlay');
                const content = document.getElementById('end-screen-content');
                overlay.classList.add('victory');
                overlay.classList.remove('hidden');
                content.innerHTML = `
                    <h1 id="end-screen-title">SYSTEM LIBERATED</h1>
                    <p id="end-screen-subtitle">You have cleared the mainframe.</p>
                    <button id="end-screen-btn" style="margin-top:30px;">RESTART GAME</button>
                `;
                document.getElementById('end-screen-btn').addEventListener('click', startGame);
            } else {
                // ПОБЕДА НА УРОВНЕ: ВЫБОР НАГРАДЫ
                const rewards = getRandomRewards(RARE_CARD_POOL, 3);
                showRewardScreen(rewards, (chosenCard) => {
                    addCardToPlayerPool(state, chosenCard);
                    console.log(`%c[ REWARD ] Добавлена: ${chosenCard.name}`, 'color: #f0f');
                    
                    const success = advanceLevel(state, ENEMIES, createDeck, shuffle, drawCards);
                    if (success) {
                        hideEndScreen();
                        renderUI(state);
                    } else {
                        startGame();
                    }
                });
            }
        }
    }
};

const handleEndTurn = () => {
    endTurn(state, drawCards);
    renderUI(state);
    const result = checkGameEnd(state);
    if (result === 'lose') {
        const overlay = document.getElementById('game-over-overlay');
        const content = document.getElementById('end-screen-content');
        overlay.classList.remove('victory');
        overlay.classList.remove('hidden');
        content.innerHTML = `
            <h1 id="end-screen-title">YOU DIED</h1>
            <p id="end-screen-subtitle">Connection terminated by hostile ICE.</p>
            <button id="end-screen-btn" style="margin-top:30px;">REBOOT SYSTEM</button>
        `;
        document.getElementById('end-screen-btn').addEventListener('click', startGame);
    }
};

function bootstrapGame() {
    console.clear();
    console.log('%c[ SYSTEM BOOT ] INITIALIZING NEON DECK...', 'color: #0f0; font-weight: bold;');

    const dropZoneElement = document.getElementById('drop-zone');
    if (dropZoneElement) setupDragAndDrop(dropZoneElement, handleCardPlay);

    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) endTurnBtn.addEventListener('click', handleEndTurn);

    startGame();
}

bootstrapGame();