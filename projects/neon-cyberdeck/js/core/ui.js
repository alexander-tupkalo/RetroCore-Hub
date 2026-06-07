/**
 * ui.js - DOM Rendering Module
 */

export function renderUI(state) {
        // --- 0. UPDATE ENEMY INTENT & SPRITE ---
    const enemyIntentEl = document.getElementById('enemy-intent');
    if (enemyIntentEl && state.enemyIntent) {
        const icon = state.enemyIntent.type === 'attack' ? '⚔️' : '🛡️';
        const typeName = state.enemyIntent.type.charAt(0).toUpperCase() + state.enemyIntent.type.slice(1);
        enemyIntentEl.textContent = `${icon} Intent: ${typeName} ${state.enemyIntent.value}`;
    }

    // Рисуем ASCII-арт вместо смайлика
    const enemySpriteEl = document.getElementById('enemy-sprite');
    if (enemySpriteEl && state.currentEnemy) {
        enemySpriteEl.innerHTML = `<span class="enemy-name-glow">${state.currentEnemy.name}</span><pre class="ascii-art">${state.currentEnemy.ascii}</pre>`;
    }

    // --- 1. UPDATE STATS & PROGRESS BARS ---
    const energyText = document.getElementById('energy-text');
    if (energyText) energyText.textContent = `${state.energy} / ${state.maxEnergy}`;

    const playerHpText = document.getElementById('player-hp-text');
    if (playerHpText) playerHpText.textContent = `${state.playerHp} / ${state.playerMaxHp}`;
    
    const playerHpBar = document.getElementById('player-hp');
    if (playerHpBar) {
        const playerHpPercent = Math.max(0, (state.playerHp / state.playerMaxHp) * 100);
        playerHpBar.style.width = `${playerHpPercent}%`;
    }

    const shieldText = document.getElementById('shield-text');
    if (shieldText) shieldText.textContent = state.playerShield;

    const enemyHpText = document.getElementById('enemy-hp-text');
    if (enemyHpText) enemyHpText.textContent = `${state.enemyHp} / ${state.enemyMaxHp}`;
    
    const enemyHpBar = document.getElementById('enemy-hp');
    if (enemyHpBar) {
        const enemyHpPercent = Math.max(0, (state.enemyHp / state.enemyMaxHp) * 100);
        enemyHpBar.style.width = `${enemyHpPercent}%`;
    }

    const deckCount = document.getElementById('deck-count');
    if (deckCount) deckCount.textContent = state.deck.length;

    const discardCount = document.getElementById('discard-count');
    if (discardCount) discardCount.textContent = state.discard.length;

    // --- 2. RENDER PLAYER HAND ---
    const handContainer = document.getElementById('player-hand');
    if (!handContainer) return;

    handContainer.innerHTML = '';

    state.hand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('cyber-card');
        cardElement.dataset.type = card.type;
        cardElement.dataset.id = card.id;

        // Drag and Drop
        cardElement.draggable = true;
        cardElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.id);
            e.target.style.opacity = '0.5';
        });
        cardElement.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });

        cardElement.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type-label">${card.type}</div>
            <div class="card-description">${card.description}</div>
            <div class="card-value">${card.value}</div>
        `;

        handContainer.appendChild(cardElement);
    });
}

/**
 * Показывает экран окончания игры.
 * @param {'win' | 'lose'} result 
 * @param {number} nextLevel - Какой уровень будет следующим (для текста)
 * @param {boolean} isFinalWin - Выиграли ли вообще всё
 */
export function showEndScreen(result, nextLevel, isFinalWin) {
    const overlay = document.getElementById('game-over-overlay');
    const title = document.getElementById('end-screen-title');
    const subtitle = document.getElementById('end-screen-subtitle');
    const btn = document.getElementById('end-screen-btn');

    if (!overlay) return;

    if (result === 'lose') {
        title.textContent = 'YOU DIED';
        subtitle.textContent = 'Connection terminated by hostile ICE.';
        btn.textContent = 'REBOOT SYSTEM';
        overlay.classList.remove('victory');
    } else {
        overlay.classList.add('victory');
        if (isFinalWin) {
            title.textContent = 'SYSTEM LIBERATED';
            subtitle.textContent = 'You have cleared the mainframe.';
            btn.textContent = 'RESTART GAME';
        } else {
            title.textContent = 'NODE CLEARED';
            subtitle.textContent = `Incoming connection from Level ${nextLevel + 1}...`;
            btn.textContent = 'JACK IN';
        }
    }

    overlay.classList.remove('hidden');
}

/**
 * Скрывает экран окончания игры.
 */
export function hideEndScreen() {
    const overlay = document.getElementById('game-over-overlay');
    if (overlay) overlay.classList.add('hidden');
}

/**
 * Показывает экран выбора награды (3 карты).
 * @param {Array} rewardCards - Массив из 3-х объектов карт.
 * @param {Function} onCardSelected - Callback, который сработает при клике на карту.
 */
export function showRewardScreen(rewardCards, onCardSelected) {
    const overlay = document.getElementById('game-over-overlay');
    const content = document.getElementById('end-screen-content');
    
    if (!overlay || !content) return;

    overlay.classList.add('victory');
    overlay.classList.remove('hidden');

    content.innerHTML = `
        <h1 id="end-screen-title">NODE CLEARED</h1>
        <p id="end-screen-subtitle" style="margin-bottom: 30px;">// CHOOSE UPGRADE TO ADD TO DECK //</p>
        <div id="reward-cards-container" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;"></div>
    `;

    const container = document.getElementById('reward-cards-container');

    rewardCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('cyber-card', 'reward-card'); // reward-card чтобы убрать драг-эффекты
        cardEl.dataset.type = card.type;
        
        cardEl.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type-label">${card.type.toUpperCase()}</div>
            <div class="card-description">${card.description}</div>
            <div class="card-value">${card.value}</div>
        `;

        // При клике на карту — забираем её
        cardEl.addEventListener('click', () => {
            onCardSelected(card);
        });

        container.appendChild(cardEl);
    });
}