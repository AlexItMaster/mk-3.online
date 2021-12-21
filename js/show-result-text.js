import createElement from './create-element.js';

/**
 * Ф-я формирует заголовок с именем нового чемпиона
 *
 * @param {string} name - Имя победителя
 * @returns {HTMLElement} - возврат готового заголовка
 */
const showResultText = (name) => {
    const winsTitle = createElement('div', 'loseTitle'); // создание блока заголовка

    winsTitle.innerText = (name) ? name + ' wins' : 'DRAW'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

    return winsTitle;
}

export default showResultText;