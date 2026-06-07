/**
 * @typedef {Object} Card
 * @property {string} id
 * @property {string} name
 * @property {'attack' | 'defense'} type
 * @property {number} cost
 * @property {number} value
 * @property {string} description
 */

export const STARTING_DECK_POOL = Object.freeze([
    { id: 'core_overclock', name: 'Overclock', type: 'attack', cost: 1, value: 3, description: 'Push neural limits for a rapid strike.' },
    { id: 'core_firewall', name: 'Firewall', type: 'defense', cost: 1, value: 4, description: 'Deploy intrusion countermeasures.' },
    { id: 'core_killer_app', name: 'Killer App', type: 'attack', cost: 2, value: 6, description: 'Tear through enemy armor.' },
    { id: 'core_chrome_plating', name: 'Chrome Plating', type: 'defense', cost: 2, value: 7, description: 'Subdermal alloy shielding.' }
]);

export const ENEMIES = [
    { id: 'gorlum', name: 'Gorlum', hp: 50, maxHp: 50, baseAttack: 7, baseDefend: 0 },
    { id: 'megatron', name: 'Megatron', hp: 80, maxHp: 80, baseAttack: 9, baseDefend: 9 },
    { id: 'tanos', name: 'Tanos', hp: 120, maxHp: 120, baseAttack: 11, baseDefend: 12 }
];

export const RARE_CARD_POOL = [
    { id: 'rare_malware', name: 'Malware', type: 'attack', cost: 3, value: 13, description: 'Heavy corruption. Tears through mainframes.' },
    { id: 'rare_ice_wall', name: 'Ice Wall', type: 'defense', cost: 3, value: 14, description: 'Impenetrable frozen firewall.' },
    { id: 'rare_spam_bot', name: 'Spam Bot', type: 'attack', cost: 0, value: 2, description: 'Free attack. Annoying but effective.' },
    { id: 'rare_emp_blast', name: 'EMP Blast', type: 'attack', cost: 2, value: 8, description: 'Electronic pulse. High damage, low cost.' },
    { id: 'rare_nano_armor', name: 'Nano Armor', type: 'defense', cost: 1, value: 6, description: 'Smart shield that adapts to threats.' }
];

// УМНАЯ ФУНКЦИЯ: Если передан твой личный пул - делает колоду из него. Если нет - из стартового.
export const createDeck = (customPool = null) => {
    const poolToUse = customPool || STARTING_DECK_POOL;
    return poolToUse.map(card => ({ ...card }));
};