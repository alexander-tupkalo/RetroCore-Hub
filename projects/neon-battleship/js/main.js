import { CRTOverlay } from './effects/CRTOverlay.js';
import { TerminalUI } from './ui/TerminalUI.js';
import { TransitionUI } from './ui/TransitionUI.js';
import { GridRenderer } from './ui/GridRenderer.js';
import { SHIP_DEFINITIONS } from './core/Constants.js';
import { Ship } from './game/Ship.js';
import { Board } from './game/Board.js';
import { AIController } from './game/AIController.js';
import { AudioEngine } from './audio/AudioEngine.js';
import { SFXGenerator } from './audio/SFXGenerator.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 0. Инициализация звука
        const audioEngine = new AudioEngine();
        const sfx = new SFXGenerator(audioEngine);

        // Функция разблокировки аудио
        const unlockAudio = () => audioEngine.unlock();
        // Разблокируем звук по клику на загрузочном экране (для звука печати)
        document.getElementById('boot-screen').addEventListener('click', unlockAudio);
        // И по клику в самой игре
        document.body.addEventListener('click', unlockAudio);

        // 1. Атмосфера и Загрузка
        const crtEffect = new CRTOverlay('#app');
        crtEffect.init();

        // Передаем функцию звука печати прямо в терминал (вторая переменная)
        const terminal = new TerminalUI('terminal-output', () => sfx.playTypeClick());
        terminal.init();

        const skipBtn = document.getElementById('boot-skip-btn');
        skipBtn.addEventListener('click', () => {
            terminal.skip();
            skipBtn.style.display = 'none';
        });

        const bootSequence = [
            '> RETROCORE://NAVAL-CMD v2.087',
            '> COPYRIGHT (C) 1997 SYNTHEX DYNAMICS',
            '-----------------------------------------',
            'INITIALIZING NAVAL UPLINK... [OK]',
            'SCANNING SUBMARINE FREQUENCIES... [OK]',
            'DECRYPTING ENEMY TRANSMISSIONS... [OK]',
            'CALIBRATING TACTICAL RADAR ARRAY...',
            'LOADING HOLOGRAPHIC GRID SCHEMATICS...',
            '',
            'WARNING: UNIDENTIFIED SIGNAL DETECTED',
            'HOSTILE FLEET POSITION LOCKED',
            '',
            '>>> BATTLE STATIONS. SYSTEMS READY. <<<'
        ];

        await terminal.typeLines(bootSequence, 25, 500);
        skipBtn.style.display = 'none'; 
        
        const shutdownDelay = terminal.skipped ? 100 : 1200;
        await new Promise(r => setTimeout(r, shutdownDelay));
        await TransitionUI.fadeOutCRT('boot-screen', terminal.skipped ? 400 : 1500);

        // 2. Инициализация UI
        const gameUI = document.getElementById('game-ui');
        gameUI.classList.remove('hidden');

        const playerGrid = new GridRenderer('player-board', 'player');
        playerGrid.render();

        const enemyGrid = new GridRenderer('enemy-board', 'enemy');
        enemyGrid.render();

        const msgContainer = document.getElementById('battle-messages');
        const turnIndicator = document.getElementById('turn-indicator');

        // 3. Инициализация Логики
        const playerBoard = new Board();
        const enemyBoard = new Board();
        const ai = new AIController();

        let isPlayerTurn = true;
        let gameOver = false;

        SHIP_DEFINITIONS.forEach(def => {
            playerBoard.placeShipRandomly(new Ship(def.id, def.name, def.size));
            enemyBoard.placeShipRandomly(new Ship(def.id, def.name, def.size));
        });

        playerBoard.ships.forEach(ship => playerGrid.renderShip(ship));

        // --- Вспомогательные функции UI ---

        function setTurnIndicator(text, isPlayer) {
            turnIndicator.textContent = text;
            turnIndicator.className = isPlayer ? 'turn-player' : 'turn-enemy';
        }

        function logBattle(message, isHit = false) {
            const p = document.createElement('p');
            p.classList.add('msg-line');
            if (isHit) p.classList.add('text-red');
            p.textContent = `> ${message}`;
            msgContainer.appendChild(p);
            
            while (msgContainer.children.length > 7) {
                msgContainer.removeChild(msgContainer.firstChild);
            }
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }

        function showGameOverScreen(isWin) {
            if (isWin) { sfx.playVictory(); } else { sfx.playDefeat(); }

            const overlay = document.createElement('div');
            overlay.classList.add('game-over-overlay');
            
            const title = document.createElement('h1');
            title.classList.add('game-over-title', isWin ? 'win' : 'lose');
            title.textContent = isWin ? 'YOU WIN' : 'YOU LOSE';
            
            const subtitle = document.createElement('p');
            subtitle.classList.add('game-over-subtitle');
            subtitle.textContent = isWin ? 'HOSTILE FLEET ANNIHILATED' : 'CORE SYSTEMS OFFLINE';
            
            const btn = document.createElement('button');
            btn.classList.add('btn-action');
            btn.textContent = 'NEXT LEVEL // REBOOT';
            
            btn.addEventListener('click', () => location.reload()); 
            
            overlay.appendChild(title);
            overlay.appendChild(subtitle);
            overlay.appendChild(btn);
            gameUI.appendChild(overlay);
        }

        // 4. Логика Игрока
        document.getElementById('enemy-board').addEventListener('click', (e) => {
            if (!isPlayerTurn || gameOver) return;

            const cell = e.target;
            if (!cell.classList.contains('cell')) return;
            
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            const result = enemyBoard.receiveAttack(x, y);
            if (!result) return; 

            sfx.playPing();

            if (result.isHit) {
                enemyGrid.renderHit(x, y);
                if (result.isDestroyed) {
                    sfx.playDestroy();
                    logBattle(`DIRECT HIT: ${result.ship.name} DESTROYED!`, true);
                } else {
                    sfx.playHit();
                    logBattle(`TARGET HIT AT ${String.fromCharCode(64+x)}${y}`, true);
                }
                
                // ИСПРАВЛЕНО: Проверка победы игрока
                if (enemyBoard.allShipsDestroyed()) {
                    gameOver = true;
                    setTurnIndicator('HOSTILE FLEET ANNIHILATED', true);
                    logBattle('!!! TARGET NEUTRALIZED. VICTORY !!!', true);
                    showGameOverScreen(true);
                    return;
                }

                setTurnIndicator('TARGET HIT - FIRE AGAIN', true);
                
            } else {
                enemyGrid.renderMiss(x, y);
                sfx.playMiss();
                logBattle(`SIGNAL LOST AT ${String.fromCharCode(64+x)}${y}`);
                
                isPlayerTurn = false;
                setTurnIndicator('ENEMY TURN', false);
                sfx.playWarning();
                setTimeout(executeAITurn, 1500);
            }
        });

        // 5. Логика ИИ
        function executeAITurn() {
            if (gameOver) return;

            const { x, y } = ai.getMove();
            const result = playerBoard.receiveAttack(x, y);

            // Имитация задержки полета снаряда
            setTimeout(() => {
                if (result.isHit) {
                    playerGrid.renderHit(x, y);
                    ai.processHit(x, y); 
                    
                    if (result.isDestroyed) {
                        sfx.playDestroy();
                        logBattle(`ALERT: OUR ${result.ship.name} IS DOWN!`, true);
                    } else {
                        sfx.playHit();
                        logBattle(`HULL BREACH AT ${String.fromCharCode(64+x)}${y}`, true);
                    }

                    // ИСПРАВЛЕНО: Проверка поражения игрока
                    if (playerBoard.allShipsDestroyed()) {
                        gameOver = true;
                        setTurnIndicator('SYSTEMS OFFLINE', false);
                        logBattle('!!! CORE SYSTEMS OFFLINE. DEFEAT !!!', true);
                        showGameOverScreen(false); 
                        return;
                    }

                    // ИСПРАВЛЕНО: ИИ стреляет еще раз при попадании
                    setTurnIndicator('ENEMY TURN - TARGETING', false);
                    setTimeout(executeAITurn, 1200);

                } else {
                    playerGrid.renderMiss(x, y);
                    sfx.playMiss();
                    logBattle(`ENEMY MISS AT ${String.fromCharCode(64+x)}${y}`);
                    
                    // Промах - возврат хода игроку
                    isPlayerTurn = true;
                    setTurnIndicator('YOUR TURN', true);
                }
            }, 300);
        }

        setTurnIndicator('YOUR TURN', true);

    } catch (error) {
        console.error('[RETROCORE://SYS] Critical failure:', error);
    }
});