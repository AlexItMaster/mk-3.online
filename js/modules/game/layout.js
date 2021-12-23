import { createElement } from '../utils/index.js';
import { generateLogs } from '../logs/index.js';
import { player1, player2 } from '../players/index.js';

/**
 * Ф-я добавления нового елемента на арену
 *
 * @param {object} elem - Елемент который нужно добавить на арену
 */
export const addingToArena = (elem) => {
    const $ARENAS = document.querySelector('.arenas'); // обращение к арене
    $ARENAS.appendChild(elem);
}

/** Ф-я создает кнопку рестарт для обновления страницы */
const createReloadButton = () => {
    const $reloadButtonDiv = createElement('div', 'reloadWrap');
    const $reloadButton = createElement('button', 'button');
    $reloadButton.innerText = 'Restart';

    $reloadButton.addEventListener('click', function(){ // по клику на рестарт обновляем станицу
        window.location.reload();
    });

    $reloadButtonDiv.appendChild($reloadButton);
    addingToArena($reloadButtonDiv); //добавляэм кнопку рестарт на арену
}

/**
 * Ф-я формирует и выводит блок с результатом поединка на табло
 *
 * @param {string} championName - Имя победителя
 */
const showResultOnDisplay = (championName) => {
    const winsTitle = createElement('div', 'loseTitle'); // создание блока заголовка

    winsTitle.innerText = (championName === 'DRAW') ? 'DRAW' : championName + ' wins'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

    addingToArena(winsTitle); // выводим блок с результатом поединка на табло
}

/**
 * Ф-я заканчивает игру.
 *
 * @param {string} champion - имя победителя или ДРАУ
 */
export const gameOver = (champion) => {
    const $RANDOMBUTTON = document.querySelector('.button'); // обращение к кнопке
    $RANDOMBUTTON.disabled = true; // блочим кнопку от нажатия
    showResultOnDisplay(champion); // вызываем отображение результатов боя
    generateLogs('end', player1, player2); // прощаемся в логах
    createReloadButton(); // выводим кнопку возобновить игру
}



