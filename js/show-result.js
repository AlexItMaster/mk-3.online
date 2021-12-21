import { player1, player2, $RANDOMBUTTON, generateLogs } from './main.js';
import showResultText from './show-result-text.js';
import addingToArena from './arena.js';
import createReloadButton from './reload-button.js';

/** Ф-я выводит результат поединка */
const showResult = () => {
    const {name:name1, hp:hp1} = player1;
    const {name:name2, hp:hp2} = player2;

    if (hp1 === 0 && hp1 < hp2) {
        addingToArena(showResultText(name2)); // выводим имя чемпиона на табло
    } else if (hp2 === 0 && hp2 < hp1) {
        addingToArena(showResultText(name1)); // выводим имя чемпиона на табло
    } else if (hp1 === 0 && hp2 === 0) {
        addingToArena(showResultText()); // выводим нечью на табло
    }

    // НОКАУТ
    if (hp1 === 0 || hp2 === 0) {
        $RANDOMBUTTON.disabled = true; // блочим кнопку от нажатия
        createReloadButton();
        generateLogs('end', player1, player2);
    }
}

export default showResult;