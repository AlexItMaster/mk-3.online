import { HIT, ATTACK } from './raund-config.js';
import getRandom from './randomiser.js';

/**
 * Ф-я создает атаку противника (компютера)
 *
 * @returns {{hit: (string), defence: (string), value: number}} - Объект с параметрами атаки противника
 */
const enemyAttack = () => {
    const attackLength = ATTACK.length;
    const hit = ATTACK[getRandom(attackLength - 1)]; // противник (компютер) совершает удар по случайной части тела своего протвника (игрока)
    const defence = ATTACK[getRandom(attackLength - 1)]; // противник (компютер) совершает защиту своей случайной части тела

    return {
        value: getRandom(HIT[hit]), // сила удара
        hit, // удар по какойто части тела
        defence, // защита какойто части тела
    }
}

export default enemyAttack;