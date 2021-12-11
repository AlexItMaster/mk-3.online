//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
const $ARENAS = document.querySelector('.arenas');
const $RANDOMBUTTON = document.querySelector('.button');
let CHAMPION = false;

// обект с данными игрока 1
const player1 = {
    player: 1,
    name: 'Scorpion',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
    waepon: ['sword', 'dagger', 'nunchucks'],
    attack: function (name) {
        console.log(name + ' Fight...');
    }
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
    }
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
function changeHP(player) {
    // находим шкалу жизни и генерируем пропущенный удар силой от 0-20
    const playerLife = document.querySelector('.player' + player.player + ' .life');
    const lossesStep = generateRandomNumber20();

    // вычитаем и сохраняем остаток жизни в объект
    if (player.hp - lossesStep >= 0) {
        player.hp -= lossesStep;
    } else {
        player.hp = 0; // если шкала уходит в минуса то перезаписываем в 0
    }

    playerLife.style.width = player.hp + '%'; // визуально ширину шкалы приводим в соответствие с остатком жизни

    // НОКАУТ
    if (player.hp <= 0) {
        addSalute(CHAMPION); // вызов ф-и вывода нового чемпиона на табло
        $RANDOMBUTTON.disabled = 'disabled'; // блочим кнопку от нажатия
    }

    // фиксируем результаты остатка жизни
    return {name: player.name, hp: player.hp};
}

// Ф-я формирует заголовок с именем нового чемпиона
function playerWins(name) {
    const title = document.querySelector('div.wins-title');
    if (title) {
        title.remove();
    }
    const winsTitle = createElement('div', 'wins-title'); // создание блока заголовка
    winsTitle.innerText = (name) ? name + ' wins' : 'DRAW'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

    // возврат готового заголовка
    return winsTitle;
}

// Ф-я рандомайзер от 1-20
function generateRandomNumber20() {
    return Math.ceil(Math.random() * 20);
}

// Ф-я вывода заголовка имени нового чемпиона
function addSalute (nameChampion) {
    $ARENAS.appendChild(playerWins(nameChampion)); // выводим имя нового чемпиона на табло
}

// Ф-я обрабатывает балы и оглашает чемпиона
function bestOfTheBest (playerHP1, playerHP2){
    if (playerHP1.hp > playerHP2.hp){
        CHAMPION = playerHP1.name;
    } else if (playerHP2.hp > playerHP1.hp) {
        CHAMPION = playerHP2.name;
    } else {
        CHAMPION = false;
        addSalute(CHAMPION); // выводим имя нового чемпиона на табло
    }
    //console.log(playerHP1.name + ' - ' + playerHP1.hp + ' | ' + playerHP2.name + ' - ' + playerHP2.hp);
}

// Создание обработчика события клик по кнопке РАНДОМ
$RANDOMBUTTON.addEventListener('click', function() {
    // сохранение результатов боя....
    const playerHP1 = changeHP(player1);
    const playerHP2 = changeHP(player2);

    // вызов функции которая вичислит победителя получив судейские балы
    bestOfTheBest(playerHP1, playerHP2);
});

// создание игроков и добавление их на арену
$ARENAS.appendChild(createPlayer(player1));
$ARENAS.appendChild(createPlayer(player2));

