/**
 * Night Observer — Terminal-style observation log
 */

export class ObservationLog {
  constructor(container) {
    this.container = container;
    this.entryCount = 0;
    this._renderEmpty();
  }

  _renderEmpty() {
    this.container.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'log-empty';
    empty.setAttribute('data-i18n', 'observer.noEntries');
    empty.textContent = 'Awaiting events\u2026';
    this.container.appendChild(empty);
  }

  addEntry(text) {
    // Remove empty state
    const empty = this.container.querySelector('.log-empty');
    if (empty) empty.remove();

    this.entryCount++;
    const num = String(this.entryCount).padStart(3, '0');
    const time = this._getTimestamp();

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(6px)';
    entry.innerHTML =
      '<span class="log-time">[' + time + ']</span> ' +
      '<span class="log-num">EVENT #' + num + '</span> ' +
      '<span class="log-text">' + text + '</span>';

    this.container.appendChild(entry);

    // Trigger animation
    requestAnimationFrame(() => {
      entry.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      entry.style.opacity = '1';
      entry.style.transform = 'translateY(0)';
    });

    // Auto-scroll
    this.container.scrollTop = this.container.scrollHeight;
  }

  _getTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return h + ':' + m + ':' + s;
  }
}