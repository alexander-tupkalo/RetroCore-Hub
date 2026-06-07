import { audio } from './audio.js';

export class Controls {
  constructor() {
    this.left = false;
    this.right = false;
    this.fire = false;
    this.enter = false;

    // Unlock audio context on the first direct user interaction
    const unlockAudio = () => audio.init();
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    // Keyboard listeners
    window.addEventListener('keydown', (e) => this.#onKeyDown(e));
    window.addEventListener('keyup', (e) => this.#onKeyUp(e));

    // Mobile touch listeners
    this.#initMobileControls();
  }

  #initMobileControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnFire = document.getElementById('btnFire');

    if (!btnLeft || !btnRight || !btnFire) return;

    const bindTouchEvents = (element, property) => {
      element.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling and mouse event emulation
        this[property] = true;
      }, { passive: false });

      element.addEventListener('touchend', (e) => {
        e.preventDefault();
        this[property] = false;
      }, { passive: false });

      element.addEventListener('touchcancel', () => {
        this[property] = false; // Handle finger sliding off the button
      });
    };

    bindTouchEvents(btnLeft, 'left');
    bindTouchEvents(btnRight, 'right');
    bindTouchEvents(btnFire, 'fire');
  }

  #onKeyDown(e) {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.right = true;
        break;
      case 'Space':
        this.fire = true;
        break;
      case 'Enter':
        this.enter = true;
        break;
    }
  }

  #onKeyUp(e) {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.right = false;
        break;
      case 'Space':
        this.fire = false;
        break;
      case 'Enter':
        this.enter = false;
        break;
    }
  }
}