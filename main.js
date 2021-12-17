//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
const $ARENAS = document.querySelector('.arenas'); // обращение к арене
const $RANDOMBUTTON = document.querySelector('.button'); // обращение к кнопке
const $formFight = document.querySelector('.control'); // обращение к форме

// объект удар служит для определени силы удара
const HIT = {
    head: 30,
    body: 25,
    foot: 20,
}

const ATTACK = ['head', 'body', 'foot']; // варианты куда может быть направлена атака

// обект с данными игрока 1
const player1 = {
    player: 1,
    name: 'Scorpion',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
    waepon: ['sword', 'dagger', 'nunchucks'],
    attack,
    changeHP,
    elHP,
    renderHP
};

// обект с данными игрока 2
const player2 = {
    player: 2,
    name: 'Subzero',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/subzero.gif',
    waepon: ['dagger', 'nunchucks'],
    attack,
    changeHP,
    elHP,
    renderHP
};

// Ф-я обращается к шкале жизни игрока
function elHP() {
    return document.querySelector('.player' + this.player + ' .life'); // обращение к шкале жизни игрока
}

// Ф-я изменяет шкалу жизни игрока
function renderHP() {
    this.elHP().style.width = this.hp + '%'; // визуально ширину шкалы приводим в соответствие с остатком жизни
}

// Ф-я высчитывает остаток жизни по пропущеным ударам
function changeHP(lossesStep) {
    // вычитаем и сохраняем остаток жизни в объект
    if (this.hp - lossesStep >= 0) {
        this.hp -= lossesStep;
    } else {
        this.hp = 0; // если шкала уходит в минуса то перезаписываем в 0
    }

    return this.hp;
}

function attack() {
    console.log(this.name + ' Fight...');
}

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

// Ф-я рандомайзер, создает случайное число из указываемого диапазона
function getRandom(range) {
    return Math.ceil(Math.random() * range);
}

//ф-я добавления нового елемента на арену
function addingToArena(elem) {
    $ARENAS.appendChild(elem);
}

// Ф-я формирует заголовок с именем нового чемпиона
function showResultText(name) {
    const winsTitle = createElement('div', 'loseTitle'); // создание блока заголовка

    winsTitle.innerText = (name) ? name + ' wins' : 'DRAW'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

    // возврат готового заголовка
    return winsTitle;
}

//Ф-я создает кнопку рестарт для обновления страницы
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

//Ф-я создает атаку противника (компютера)
function enemyAttack() {
    const hit = ATTACK[getRandom(3) - 1]; // противник (компютер) совершает удар по случайной части тела своего протвника (игрока)
    const defence = ATTACK[getRandom(3) - 1]; // противник (компютер) совершает защиту своей случайной части тела

    return {
        value: getRandom(HIT[hit]), // сила удара
        hit, // удар по какойто части тела
        defence, // защита какойто части тела
    }
}

// Ф-я создает атаку игрока по противнику (компютеру)
function myAttack() {
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

// создание игроков и добавление их на арену
addingToArena(createPlayer(player1));
addingToArena(createPlayer(player2));

// Создание обработчика события клик по кнопке FIGHT
$formFight.addEventListener('submit', function(e) {
    e.preventDefault();
    const enemy = enemyAttack();
    const attack = myAttack();
    let player1HP = player1.hp;
    let player2HP = player2.hp;

    if(enemy.hit !== attack.defence) {
        player1HP = player1.changeHP(attack.value);
        player1.renderHP();
    }

    if(attack.hit !== enemy.defence) {
        player2HP = player2.changeHP(enemy.value);
        player2.renderHP();
    }

    if (player1HP === 0 && player1HP < player2HP) {
        addingToArena(showResultText(player2.name)); // выводим имя чемпиона на табло
    } else if (player2HP === 0 && player2HP < player1HP) {
        addingToArena(showResultText(player1.name)); // выводим имя чемпиона на табло
    } else if (player1HP === 0 && player2HP === 0) {
        addingToArena(showResultText()); // выводим нечью на табло
    }

    // НОКАУТ
    if (player1HP === 0 || player2HP === 0) {
        $RANDOMBUTTON.disabled = true; // блочим кнопку от нажатия
        createReloadButton();
    }
});