export class TerminalUI {
    constructor(containerId, onTypeCallback = null) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error("TerminalUI: Контейнер не найден");
        this.cursor = null;
        this.isTyping = false;
        this.skipped = false;
        this.onTypeCallback = onTypeCallback; // Функция звука
    }

    init() {
        this.container.innerHTML = '';
        this.cursor = document.createElement('span');
        this.cursor.classList.add('terminal-cursor');
        this.skipped = false;
    }

    skip() {
        this.skipped = true;
    }

    async typeLines(lines, charDelay = 30, lineDelay = 600) {
        this.isTyping = true;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.container.appendChild(this.cursor);

            for (let j = 0; j < line.length; j++) {
                if (this.skipped) {
                    if (this.cursor.parentNode) this.cursor.remove();
                    
                    let remainingText = line.substring(j);
                    for (let k = i + 1; k < lines.length; k++) {
                        remainingText += '\n' + lines[k];
                    }
                    
                    this.container.appendChild(document.createTextNode(remainingText));
                    this.container.appendChild(this.cursor);
                    this.isTyping = false;
                    return;
                }

                const charNode = document.createTextNode(line[j]);
                this.container.insertBefore(charNode, this.cursor);
                
                // Вызываем звук печати (если передан)
                if (this.onTypeCallback) this.onTypeCallback();

                await this._delay(charDelay + Math.random() * 20);
            }

            if (i < lines.length - 1) {
                this.container.insertBefore(document.createTextNode('\n'), this.cursor);
                await this._delay(lineDelay);
            }
        }

        this.isTyping = false;
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}