/**
 * input.js - Drag and Drop Event Handler
 * Manages purely the mechanical interaction of dragging DOM elements.
 */

/**
 * Wires up the drop zone to listen for HTML5 Drag and Drop events.
 * 
 * @param {HTMLElement} dropZoneElement - The DOM element acting as the drop target.
 * @param {Function} onCardDroppedCallback - The function to call with the card ID upon successful drop.
 * @returns {void}
 */
export function setupDragAndDrop(dropZoneElement, onCardDroppedCallback) {
    if (!dropZoneElement) {
        console.error('[ Input ] Drop zone element not found.');
        return;
    }

    // 1. DRAGOVER: Required to allow dropping. 
    // By default, browsers prevent dropping elements.
    dropZoneElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        // Add visual feedback class (matches our CSS :hover state)
        dropZoneElement.classList.add('active');
    });

    // 2. DRAGLEAVE: Clean up visual feedback if the cursor leaves the zone
    dropZoneElement.addEventListener('dragleave', (e) => {
        // We check relatedTarget to prevent flickering when hovering over child elements
        if (!dropZoneElement.contains(e.relatedTarget)) {
            dropZoneElement.classList.remove('active');
        }
    });

    // 3. DROP: The user released the mouse button over the drop zone
    dropZoneElement.addEventListener('drop', (e) => {
        e.preventDefault(); // Stop the browser from opening the dragged data as a link
        
        // Remove visual feedback immediately
        dropZoneElement.classList.remove('active');

        // Extract the card ID that we packed in ui.js using 'text/plain'
        const cardId = e.dataTransfer.getData('text/plain');

        // If we successfully grabbed an ID, trigger the callback
        if (cardId) {
            onCardDroppedCallback(cardId);
        }
    });
}