import { gameOver } from './layout.js';
import { ATTACK, HIT } from '../constants/index.js';
import { getRandom } from '../utils/index.js';
import { generateLogs } from '../logs/index.js';
import { player1, player2 } from '../players/index.js';

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

/**
 * Ф-я создает атаку игрока по противнику (компютеру)
 *
 * @returns {{hit: (string), defence: (string), value: number}} - Объект с параметрами атаки игрока
 */
const playerAttack = () => {
    const attack = {};
    const $formFight = document.querySelector('.control'); // обращение к форме

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

/** Ф-я определяет результат поединка */
export const definingChampions = () => {
    const {name:name1, hp:hp1} = player1;
    const {name:name2, hp:hp2} = player2;

    if (hp1 === 0 && hp1 < hp2) {
        gameOver(name2); // чемпион игрок 2
    } else if (hp2 === 0 && hp2 < hp1) {
        gameOver(name1); // чемпион игрок 1
    } else if (hp1 === 0 && hp2 === 0) {
        gameOver('DRAW'); // ничья
    }
}

/**
 * Ф-я провоцырует драку описуя в логе что происходит в бою
 * также по окончанию боя вызывает вывод результатов
 *
 * @param {Object} player1
 * @param {Object} player2
 */
export const fight = (player1, player2) => {
    const enemy = enemyAttack(); // нападение противника
    const player = playerAttack(); // мой ответ

    if(enemy.hit !== player.defence) { // я пропустил удар
        player1.changeHP(enemy.value); // у меня сгорают жизни
        player1.renderHP();
        generateLogs('hit', player2, player1, enemy.value); // что произошло, читай лог
    } else {
        generateLogs('defence', player2, player1); // я поставил блок
    }

    if(player.hit !== enemy.defence) { // я угадал его...
        player2.changeHP(player.value); // у него сгорают жизни
        player2.renderHP();
        generateLogs('hit', player1, player2, player.value); // что произошло, читай лог
    } else {
        generateLogs('defence', player1, player2); // у него хорошая защита
    }
}

