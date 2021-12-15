//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
const $ARENAS = document.querySelector('.arenas');
const $RANDOMBUTTON = document.querySelector('.button');

// обект с данными игрока 1
const player1 = {
    player: 1,
    name: 'Scorpion',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
    waepon: ['sword', 'dagger', 'nunchucks'],
    attack: function (name) {
        console.log(name + ' Fight...');
    },
    changehp: changeHP,
    elhp: elHP,
    renderhp: renderHP
};

// обект с данными игрока 2
const player2 = {
    player: 2,
    name: 'Subzero',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/subzero.gif',
    waepon: ['dagger', 'nunchucks'],
    attack: function (name) {
        console.log(name + ' Fight...');
    },
    changehp: changeHP,
    elhp: elHP,
    renderhp: renderHP
};

// Ф-Я СОЗДАНИЯ НОВОГО хтмл БЛОКА
function createElement(tag, className, atrList) {
    // создание тега
    const $tag = document.createElement(tag);

    // добавление класа тегу если он был передан
    if (className) {
        $tag.classList.add(className);
    }

    // добавление нового атрибута тегу если он был передан
    if (atrList) {
        $tag[atrList[0]] = atrList[1];
    }

    // возврат готового тега
    return $tag;
}

// Ф-Я СОЗДАНИЯ НОВОГО ИГРОКА
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

// Ф-я высчитывает остаток жизни по пропущеным ударам
function changeHP(lossesStep) {
    // вычитаем и сохраняем остаток жизни в объект
    if (this.hp - lossesStep >= 0) {
        this.hp -= lossesStep;
    } else {
        this.hp = 0; // если шкала уходит в минуса то перезаписываем в 0
    }

    this.renderhp();

    return this.hp;
}

function elHP() {
    return document.querySelector('.player' + this.player + ' .life');
}

function renderHP() {
    let life = this.elhp();
    life.style.width = this.hp + '%'; // визуально ширину шкалы приводим в соответствие с остатком жизни
}

// Ф-я формирует заголовок с именем нового чемпиона
function showResultText(name) {
    const cloneTitle = document.querySelector('div.wins-title');
    const winsTitle = createElement('div', 'wins-title'); // создание блока заголовка

    if (cloneTitle) {
        cloneTitle.remove();
    }

    winsTitle.innerText = (name) ? name + ' wins' : 'DRAW'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

    // возврат готового заголовка
    return winsTitle;
}

// Ф-я рандомайзер от 1-20
function getRandom(range) {
    return Math.ceil(Math.random() * range);
}

function createReloadButton() {
    const $reloadWrap = createElement('div', 'reload-wrap');
    const $restart = createElement('button', 'button');

    $restart.innerText = 'Restart';

    $reloadWrap.appendChild($restart);

    return $reloadWrap;
}

// Создание обработчика события клик по кнопке РАНДОМ
$RANDOMBUTTON.addEventListener('click', function() {
    let player1HP = player1.changehp(getRandom(20));
    let player2HP = player2.changehp(getRandom(20));

    if (player1HP === 0 && player1HP < player2HP){
        $ARENAS.appendChild(showResultText(player2.name)); // выводим имя чемпиона на табло
    } else if (player2HP === 0 && player2HP < player1HP) {
        $ARENAS.appendChild(showResultText(player1.name)); // выводим имя чемпиона на табло
    } else if (player1HP === 0 && player2HP === 0) {
        $ARENAS.appendChild(showResultText()); // выводим нечью на табло
    }

    // НОКАУТ
    if (player1HP === 0 || player2HP === 0) {
        $RANDOMBUTTON.disabled = true; // блочим кнопку от нажатия

        $ARENAS.appendChild(createReloadButton()); //добавляэм кнопку рестарт на арену
        const $RESTART = document.querySelector('.reload-wrap .button'); // находим кнопку рестарт в дом

        $RESTART.addEventListener('click', function(){ // по клику на рестарт обновляем станицу
            window.location.reload();
        });
    }
});

// создание игроков и добавление их на арену
$ARENAS.appendChild(createPlayer(player1));
$ARENAS.appendChild(createPlayer(player2));

