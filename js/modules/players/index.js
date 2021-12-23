import { createElement } from '../utils/index.js';

/**
 * Ф-я обращается к шкале жизни игрока
 *
 * @returns {Element|null}
 */
function elHP() {
    return document.querySelector('.player' + this.player + ' .life'); // обращение к шкале жизни игрока
}

/** Ф-я изменяет шкалу жизни игрока */
function renderHP() {
    this.elHP().style.width = this.hp + '%'; // визуально ширину шкалы приводим в соответствие с остатком жизни
}

/**
 * Ф-я высчитывает остаток жизни по пропущеным ударам
 *
 * @param {number} lossesStep - Сила пропущенного удара или на сколько процентов нужно уменьшить жизнь
 * @returns {number} - Остаток жизни
 */
function changeHP(lossesStep) {
    this.hp -= lossesStep;

    if (this.hp <= 0) {
        this.hp = 0; // если шкала уходит в минуса то перезаписываем в 0
    }

    return this.hp;
}

/** Объект с данными игрока 1 */
export const player1 = {
    player: 1,
    name: 'Scorpion',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
    waepon: ['sword', 'dagger', 'nunchucks'],
    changeHP,
    elHP,
    renderHP
};

/** Объект с данными игрока 2 */
export const player2 = {
    player: 2,
    name: 'Subzero',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/subzero.gif',
    waepon: ['dagger', 'nunchucks'],
    changeHP,
    elHP,
    renderHP
};

/**
 * Ф-я создания нового игрока
 *
 * @param {object} playerObj - Объект игрока
 * @returns {HTMLElement} - HTML елемент игрока
 */
export const createPlayer = (obj) => {
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
