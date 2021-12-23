/** Подключение модулей */
import { generateLogs } from './modules/logs/index.js';
import { addingToArena } from './modules/game/layout.js';
import { fight, definingChampions } from './modules/game/logic.js';
import { player1, player2, createPlayer } from './modules/players/index.js';

/** Ф-я зупускает игру */
const init = () => {
    const $formFight = document.querySelector('.control'); // обращение к форме

    /** Создание игроков и добавление их на арену */
    addingToArena(createPlayer(player1));
    addingToArena(createPlayer(player2));

    /** Вызов лога с приветствием о начале игры */
    generateLogs('start', player1, player2);

    /** Создание обработчика события клик по кнопке FIGHT */
    $formFight.addEventListener('submit', function(e) {
        e.preventDefault();

        /** Начинаем бой */
        fight(player1, player2);

        /** Узнаем кто победил */
        definingChampions();
    });
}

init();