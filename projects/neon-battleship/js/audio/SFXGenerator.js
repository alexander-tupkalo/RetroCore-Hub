import { AudioEngine } from './AudioEngine.js';

export class SFXGenerator {
    constructor(audioEngine) {
        this.audio = audioEngine;
        this.audio.init();
    }

    // Генератор белого шума (нужен для глитчей и взрывов)
    _createNoise(duration = 0.2) {
        const bufferSize = this.audio.ctx.sampleRate * duration;
        const buffer = this.audio.ctx.createBuffer(1, bufferSize, this.audio.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.audio.ctx.createBufferSource();
        noise.buffer = buffer;
        return noise;
    }

    // Сонар / Пинг при выстреле
    playPing() {
        const osc = this.audio.createNode('oscillator');
        const gain = this.audio.createNode('gain');
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, this.audio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.audio.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.3, this.audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.2);

        osc.connect(gain);
        this.audio.connectToMaster(gain);
        
        osc.start(this.audio.currentTime);
        osc.stop(this.audio.currentTime + 0.2);
    }

    // Промах (глухой тон)
    playMiss() {
        const osc = this.audio.createNode('oscillator');
        const gain = this.audio.createNode('gain');
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, this.audio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audio.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.2, this.audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.3);

        osc.connect(gain);
        this.audio.connectToMaster(gain);
        
        osc.start(this.audio.currentTime);
        osc.stop(this.audio.currentTime + 0.3);
    }

        // Механический клик при печати терминала
    playTypeClick() {
        if (!this.audio.isUnlocked) return; // Не играем до первого клика пользователя
        
        const noise = this._createNoise(0.03); // Очень короткий буфер шума (30мс)
        const filter = this.audio.createNode('filter');
        const gain = this.audio.createNode('gain');

        // Фильтруем шум, чтобы он звучал как пластиковый/металлический клик
        filter.type = 'bandpass';
        filter.frequency.value = 3500; 
        filter.Q.value = 2;

        // Резкая атака и моментальное затухание
        gain.gain.setValueAtTime(0.08, this.audio.currentTime); // Тихий, чтобы не бил по ушам
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.02);

        noise.connect(filter);
        filter.connect(gain);
        this.audio.connectToMaster(gain);

        noise.start(this.audio.currentTime);
        noise.stop(this.audio.currentTime + 0.03);
    }

    // Попадание (цифровой глитч / пробой)
    playHit() {
        const noise = this._createNoise(0.15);
        const filter = this.audio.createNode('filter');
        const gain = this.audio.createNode('gain');

        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 1.5;

        gain.gain.setValueAtTime(0.5, this.audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        this.audio.connectToMaster(gain);

        noise.start(this.audio.currentTime);
        noise.stop(this.audio.currentTime + 0.15);

        // Добавляем низкий гул
        const osc = this.audio.createNode('oscillator');
        const oscGain = this.audio.createNode('gain');
        osc.type = 'sawtooth';
        osc.frequency.value = 80;
        oscGain.gain.setValueAtTime(0.3, this.audio.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.2);
        osc.connect(oscGain);
        this.audio.connectToMaster(oscGain);
        osc.start(this.audio.currentTime);
        osc.stop(this.audio.currentTime + 0.2);
    }

    // Уничтожение корабля (протяжный глитч)
    playDestroy() {
        this.playHit(); // Базовый звук попадания
        const osc = this.audio.createNode('oscillator');
        const gain = this.audio.createNode('gain');
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, this.audio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.audio.currentTime + 0.8);
        
        gain.gain.setValueAtTime(0.2, this.audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.8);

        osc.connect(gain);
        this.audio.connectToMaster(gain);
        
        osc.start(this.audio.currentTime + 0.1); // Чуть с задержкой
        osc.stop(this.audio.currentTime + 0.9);
    }

    // Предупреждение (Ход врага)
    playWarning() {
        const osc = this.audio.createNode('oscillator');
        const gain = this.audio.createNode('gain');
        
        osc.type = 'sine';
        osc.frequency.value = 200;
        
        // Двойной бип
        gain.gain.setValueAtTime(0.15, this.audio.currentTime);
        gain.gain.setValueAtTime(0.001, this.audio.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, this.audio.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.3);

        osc.connect(gain);
        this.audio.connectToMaster(gain);
        
        osc.start(this.audio.currentTime);
        osc.stop(this.audio.currentTime + 0.3);
    }

    // Победа (Восходящий аккорд)
    playVictory() {
        [400, 500, 600].forEach((freq, i) => {
            const osc = this.audio.createNode('oscillator');
            const gain = this.audio.createNode('gain');
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, this.audio.currentTime + (i * 0.15));
            gain.gain.linearRampToValueAtTime(0.15, this.audio.currentTime + (i * 0.15) + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 1);
            osc.connect(gain);
            this.audio.connectToMaster(gain);
            osc.start(this.audio.currentTime + (i * 0.15));
            osc.stop(this.audio.currentTime + 1);
        });
    }

    // Поражение (Низкий нисходящий гул)
    playDefeat() {
        const osc = this.audio.createNode('oscillator');
        const gain = this.audio.createNode('gain');
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.audio.currentTime + 1.5);
        gain.gain.setValueAtTime(0.2, this.audio.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, this.audio.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 1.5);
        osc.connect(gain);
        this.audio.connectToMaster(gain);
        osc.start(this.audio.currentTime);
        osc.stop(this.audio.currentTime + 1.5);
    }
}