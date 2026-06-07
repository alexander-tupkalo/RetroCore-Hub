import { STARTING_DECK_POOL } from '../config.js';

/**
 * Shuffles an array in-place using the Fisher-Yates (aka Knuth) algorithm.
 * Time complexity: O(n). Perfectly uniform distribution.
 * 
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The same array reference, now shuffled.
 */
export function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element using ES6 destructuring.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

/**
 * Generates a fresh deck instance by deep copying the starting pool.
 * Because our card objects are currently flat (only primitive properties),
 * a shallow copy via spread operator acts as a deep copy and is much 
 * faster than JSON.parse(JSON.stringify()).
 * 
 * @returns {import('../config.js').Card[]} A fresh, independent array of card objects.
 */
export function createDeck() {
    return STARTING_DECK_POOL.map(card => ({ ...card }));
}