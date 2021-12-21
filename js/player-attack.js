import { HIT, ATTACK } from './raund-config.js';
import getRandom from './randomiser.js';
import { $formFight } from './main.js';

/**
 * Ф-я создает атаку игрока по противнику (компютеру)
 *
 * @returns {{hit: (string), defence: (string), value: number}} - Объект с параметрами атаки игрока
 */
const playerAttack = () => {
    const attack = {};

    // пробегаем по елементам формы
    for(let item of $formFight) {
        if(item.checked && item.name === 'hit') { // отфильтровываем выбранную часть тела для удара
            attack.value = getRandom(HIT[item.value]); // сила удара
            attack.hit = item.value; // удар по какойто части тела
        }

        if(item.checked && item.name === 'defence') { // отфильтровываем выбранную часть тела для защиты
            attack.defence = item.value; // защита какойто части тела
        }

        item.checked = false; // сбрасываем выбранные параметры атаки
    }

    return attack;
}

export default playerAttack;