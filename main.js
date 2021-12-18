/** ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ */
/** Объект удар служит для определения силы удара */
const HIT = {
    head: 30,
    body: 25,
    foot: 20,
};

/** Массив атака содержит варианты участков тела для атаки */
const ATTACK = ['head', 'body', 'foot'];

/** Объект с данными игрока 1 */
const player1 = {
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
const player2 = {
    player: 2,
    name: 'Subzero',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/subzero.gif',
    waepon: ['dagger', 'nunchucks'],
    changeHP,
    elHP,
    renderHP
};

const $ARENAS = document.querySelector('.arenas'); // обращение к арене
const $RANDOMBUTTON = document.querySelector('.button'); // обращение к кнопке
const $formFight = document.querySelector('.control'); // обращение к форме
const $chat = document.querySelector('.chat'); // обращение к

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

/**
 * Ф-я создания нового хтмл блока
 *
 * @param {string} tag - Имя тэга
 * @param {string|boolean} [className] - Имя css класса
 * @param {object|undefined} [attrList] - Имя атрибута attrList[0] и его значение attrList[1]
 * @returns {HTMLElement} - Возвращает готовый тег
 */
function createElement(tag, className, attrList) {
    // создание тега
    const $tag = document.createElement(tag);

    // добавление класа тегу если он был передан
    if (className) {
        $tag.classList.add(className);
    }

    // добавление нового атрибута тегу если он был передан
    if (attrList) {
        $tag[attrList[0]] = attrList[1];
    }

    // возврат готового тега
    return $tag;
}

/**
 * Ф-я создания нового игрока
 *
 * @param {object} playerObj - Объект игрока
 * @returns {HTMLElement} - HTML елемент игрока
 */
function createPlayer(playerObj) {
    // динамическое создание хтмл блоков для нового игрока
    const $player = createElement('div', 'player' + playerObj.player);
    const $progressbar = createElement('div', 'progressbar');
    const $character = createElement('div', 'character');
    const $life = createElement('div', 'life');
    const $name = createElement('div', 'name');
    const $img = createElement('img', false, ['src', playerObj.img]);

    // небольшая динамическая модификация стилей и наполнение блоков текстом
    $life.style.width = playerObj.hp +'%';
    $name.innerText = playerObj.name;

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
 * Ф-я рандомайзер, создает случайное число из указываемого диапазона
 *
 * @param {number} range - Диапазон из которого будет вибрано случайное число
 * @returns {number} - случайное целое число или 20
 */
function getRandom(range) {
    return (range) ? Math.ceil(Math.random() * range) : 20;
}

/**
 * Ф-я добавления нового елемента на арену
 *
 * @param {object} elem - Елемент который нужно добавить на арену
 */
function addingToArena(elem) {
    $ARENAS.appendChild(elem);
}

/**
 * Ф-я формирует заголовок с именем нового чемпиона
 *
 * @param {string} name - Имя победителя
 * @returns {HTMLElement} - возврат готового заголовка
 */
function showResultText(name) {
    const winsTitle = createElement('div', 'loseTitle'); // создание блока заголовка

    winsTitle.innerText = (name) ? name + ' wins' : 'DRAW'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

    return winsTitle;
}

/** Ф-я создает кнопку рестарт для обновления страницы */
function createReloadButton() {
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
 * Ф-я создает атаку противника (компютера)
 *
 * @returns {{hit: (string), defence: (string), value: number}} - Объект с параметрами атаки противника
 */
function enemyAttack() {
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
function playerAttack() {
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

/** Ф-я выводит результат поединка */
function showResult() {
    if (player1.hp === 0 && player1.hp < player2.hp) {
        addingToArena(showResultText(player2.name)); // выводим имя чемпиона на табло
    } else if (player2.hp === 0 && player2.hp < player1.hp) {
        addingToArena(showResultText(player1.name)); // выводим имя чемпиона на табло
    } else if (player1.hp === 0 && player2.hp === 0) {
        addingToArena(showResultText()); // выводим нечью на табло
    }

    // НОКАУТ
    if (player1.hp === 0 || player2.hp === 0) {
        $RANDOMBUTTON.disabled = true; // блочим кнопку от нажатия
        createReloadButton();
        generateLogs('end', player1, player2);
    }
}

/**
 * Ф-я создает время
 * @returns {string} - time 02:05:00
 */
function time() {
    const date = new Date();
    const hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    const min = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    const sec = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();

    return `${hour}:${min}:${sec}`;
}
/**
 * Ф-я генерирует лог
 *
 * @param {string} type - Тип лога
 * @param {object} player1 - Тот кто наносит удар
 * @param {object} player2 - Тот кто защищается
 */
function generateLogs(type, player1, player2, valueHP) {
    const logsType = logs[type];
    const logsTypeLength = logsType.length;
    const randomIndexLog = getRandom(logsTypeLength - 1);
    const log = logsType[randomIndexLog];
    const timeX = time();

    let text;
    let el;

    switch (type) {
        case 'start':
            text = logsType.replace('[player1]', player1.name).replace('[player2]', player2.name).replace('[time]', timeX);
            el = `<p>${text}</p>`;
            break;
        case 'end':
            let playerWins, playerLose;
            if(player1.hp === 0 && player2.hp > player1.hp) {
                playerWins = player2.name;
                playerLose = player1.name;
            } else if(player2.hp === 0 && player1.hp > player2.hp) {
                playerWins = player1.name;
                playerLose = player2.name;
            }

            text = log.replace('[playerWins]', playerWins).replace('[playerLose]', playerLose);
            el = `<p>${timeX} ${text}</p>`;
            break;
        case 'hit':
            text = log.replace('[playerKick]', player1.name).replace('[playerDefence]', player2.name);
            el = `<p>${timeX} ${text} <br>${player2.name} потерял жизни: (-${valueHP}) остаток жизни: ${player2.hp}/100</p>`;
            break;
        case 'defence':
            if(!valueHP){
                valueHP = 0;
            }
            text = log.replace('[playerKick]', player2.name).replace('[playerDefence]', player1.name);
            el = `<p>${timeX} ${text} <br>${player2.name} потерял жизни: (-${valueHP}) остаток жизни: ${player2.hp}/100</p>`;
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