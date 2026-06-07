export class TransitionUI {
    static fadeOutCRT(elementId, duration = 1500) {
        return new Promise((resolve) => {
            const element = document.getElementById(elementId);
            if (!element) return resolve();

            element.style.animationDuration = `${duration}ms`;
            element.classList.add('crt-power-off');

            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }
}