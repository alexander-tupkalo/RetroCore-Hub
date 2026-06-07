export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isUnlocked = false;
    }

    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        // Общая громкость (делаем тихим, как в терминале)
        this.masterGain.gain.value = 0.4; 
        this.masterGain.connect(this.ctx.destination);
    }

    // Вызывать при первом клике пользователя
    unlock() {
        if (this.isUnlocked) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isUnlocked = true;
    }

    // Утилита для создания точек соединения
    createNode(type = 'oscillator') {
        if (!this.ctx) this.init();
        if (type === 'oscillator') return this.ctx.createOscillator();
        if (type === 'gain') return this.ctx.createGain();
        if (type === 'filter') return this.ctx.createBiquadFilter();
    }

    get currentTime() {
        return this.ctx ? this.ctx.currentTime : 0;
    }

    connectToMaster(node) {
        node.connect(this.masterGain);
    }
}