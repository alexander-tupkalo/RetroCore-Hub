export class CRTOverlay {
    constructor(targetSelector) {
        this.container = document.querySelector(targetSelector);
        if (!this.container) throw new Error("CRTOverlay: Целевой контейнер не найден");
        this.flickerInterval = null;
    }

    init() {
        this._createLayers();
        this._startFlickerLoop();
    }

    _createLayers() {
        // 1. Слой виньетирования (затемнение краев)
        const vignette = document.createElement('div');
        vignette.classList.add('crt-layer', 'crt-vignette');
        this.container.appendChild(vignette);

        // 2. Слой scanlines
        const scanlines = document.createElement('div');
        scanlines.classList.add('crt-layer', 'crt-scanlines');
        scanlines.style.animation = 'scanline-move 8s linear infinite';
        this.container.appendChild(scanlines);

        // 3. Слой VHS шума
        const noise = document.createElement('div');
        noise.classList.add('crt-layer', 'crt-noise');
        this.container.appendChild(noise);
    }

    _startFlickerLoop() {
        // Случайные "просадки" напряжения терминала
        this.flickerInterval = setInterval(() => {
            const shouldFlicker = Math.random() > 0.92; // ~8% шанс
            if (shouldFlicker) {
                this.container.classList.add('flicker-active');
                
                // Убираем класс после завершения анимации
                setTimeout(() => {
                    this.container.classList.remove('flicker-active');
                }, 150);
            }
        }, 3000); // Проверяем каждые 3 секунды
    }

    destroy() {
        if (this.flickerInterval) {
            clearInterval(this.flickerInterval);
        }
    }
}