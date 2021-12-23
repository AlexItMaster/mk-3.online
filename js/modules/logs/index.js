import { LOGS } from '../constants/index.js';
import { getRandom, time } from '../utils/index.js';

/**
 * Ф-я генерирует лог
 *
 * @param {string} type - Тип лога
 * @param {object} player1 - Тот кто наносит удар
 * @param {object} player2 - Тот кто защищается
 * @param {number} [valueHP] - На сколько единиц сгорает жизнь
 */
export const generateLogs = (type, player1, player2, valueHP) => {
    const {name:name1, hp:hp1} = player1;
    const {name:name2, hp:hp2} = player2;
    const logsType = LOGS[type];
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

    const $chat = document.querySelector('.chat'); // обращение к чату
    $chat.insertAdjacentHTML('afterbegin', el);
}

