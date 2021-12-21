/** Подключение модулей */
import { logs } from './js/logs.js';
import { player1, player2 } from './js/players.js';
import { HIT, ATTACK } from './js/raund-config.js';
import addingToArena from './js/arena.js';
import time from './js/date.js';
import getRandom from './js/randomiser.js';
import createReloadButton from './js/reload-button.js';
import showResultText from './js/show-result-text.js';
import showResult from './js/show-result.js';
import enemyAttack from './js/enemy-attack.js';
import playerAttack from './js/player-attack.js';
import elHP from './js/elhp.js';
import renderHP from './js/render-hp.js';
import changeHP from './js/change-hp.js';
import createElement from './js/create-element.js';

const $ARENAS = document.querySelector('.arenas'); // обращение к арене
const $RANDOMBUTTON = document.querySelector('.button'); // обращение к кнопке
const $formFight = document.querySelector('.control'); // обращение к форме
const $chat = document.querySelector('.chat'); // обращение к

/**
 * Ф-я создания нового игрока
 *
 * @param {object} playerObj - Объект игрока
 * @returns {HTMLElement} - HTML елемент игрока
 */
const createPlayer = (obj) => {
    const {id = obj.player, name = obj.name, hp = obj.hp, img = obj.img} = obj;
    // динамическое создание хтмл блоков для нового игрока
    const $player = createElement('div', 'player' + id);
    const $progressbar = createElement('div', 'progressbar');
    const $character = createElement('div', 'character');
    const $life = createElement('div', 'life');
    const $name = createElement('div', 'name');
    const $img = createElement('img', false, ['src', img]);

    // небольшая динамическая модификация стилей и наполнение блоков текстом
    $life.style.width = hp +'%';
    $name.innerText = name;

    // динамическое формирование структуры хтмл блоков нового игрока
    $character.appendChild($img);
    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $player.appendChild($progressbar);
    $player.appendChild($character);

    // возврат готовой структуры блоков (новый игрок)
    return $player;
}

/**
 * Ф-я генерирует лог
 *
 * @param {string} type - Тип лога
 * @param {object} player1 - Тот кто наносит удар
 * @param {object} player2 - Тот кто защищается
 */
const generateLogs = (type, player1, player2, valueHP) => {
    const {name:name1, hp:hp1} = player1;
    const {name:name2, hp:hp2} = player2;
    const logsType = logs[type];
    const logsTypeLength = logsType.length;
    const randomIndexLog = getRandom(logsTypeLength - 1);
    const log = logsType[randomIndexLog];
    const timeX = time();

    let text;
    let el;

    switch (type) {
        case 'start':
            text = logsType.replace('[player1]', name1).replace('[player2]', name2).replace('[time]', timeX);
            el = `<p>${text}</p>`;
            break;
        case 'end':
            let playerWins, playerLose;
            if(hp1 === 0 && hp2 > hp1) {
                playerWins = name2;
                playerLose = name1;
            } else if(hp2 === 0 && hp1 > hp2) {
                playerWins = name1;
                playerLose = name2;
            }

            text = log.replace('[playerWins]', playerWins).replace('[playerLose]', playerLose);
            el = `<p>${timeX} ${text}</p>`;
            break;
        case 'hit':
            text = log.replace('[playerKick]', name1).replace('[playerDefence]', name2);
            el = `<p>${timeX} ${text} <br>${name2} потерял жизни: (-${valueHP}) остаток жизни: ${hp2}/100</p>`;
            break;
        case 'defence':
            if(!valueHP){
                valueHP = 0;
            }
            text = log.replace('[playerKick]', name2).replace('[playerDefence]', name1);
            el = `<p>${timeX} ${text} <br>${name2} потерял жизни: (-${valueHP}) остаток жизни: ${hp2}/100</p>`;
            break;
        default:
            text = logsType;
            el = `<p>${type} ${text}</p>`;
            break;
    }

    $chat.insertAdjacentHTML('afterbegin', el);
}

/** Создание игроков и добавление их на арену */
addingToArena(createPlayer(player1));
addingToArena(createPlayer(player2));

generateLogs('start', player1, player2);

/** Создание обработчика события клик по кнопке FIGHT */
$formFight.addEventListener('submit', function(e) {
    e.preventDefault();
    const enemy = enemyAttack();
    const player = playerAttack();

    if(enemy.hit !== player.defence) {
        player1.changeHP(enemy.value);
        player1.renderHP();
        generateLogs('hit', player2, player1, enemy.value);
    } else {
        generateLogs('defence', player2, player1);
    }

    if(player.hit !== enemy.defence) {
        player2.changeHP(player.value);
        player2.renderHP();
        generateLogs('hit', player1, player2, player.value);
    } else {
        generateLogs('defence', player1, player2);
    }

    showResult();
});