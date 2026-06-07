// js/app.js
import { Game } from './engine.js';
import { Controls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const container = canvas.parentElement;

// Explicitly overwrite hardcoded HTML attributes with true layout dimensions
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

const game = new Game(canvas);
const controls = new Controls();

function gameLoop() {
  if (game.isGameOver && controls.enter) {
    game.restart();
  }
  
  game.render(controls);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);