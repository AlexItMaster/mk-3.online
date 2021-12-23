import { player1, player2 } from '../players/index.js';
import {ATTACK, HIT, LOGS} from '../constants/index.js';
import {createElement, getRandom, time} from "../utils/index.js";

class Game {
    constructor (props){
        this.player1 = props.player1;
        this.player2 = props.player2;
    }

    /** Начало игры */
    start = () => {
        const $formFight = document.querySelector('.control'); // обращение к форме

        /** Создание игроков и добавление их на арену */
        this.addingToArena(this.createPlayer(this.player1));
        this.addingToArena(this.createPlayer(this.player2));

        /** Вызов лога с приветствием о начале игры */
        this.generateLogs('start', this.player1, this.player2);

        /** Создание обработчика события клик по кнопке FIGHT */
        $formFight.addEventListener('submit', (e) => {
            e.preventDefault();

            /** Начинаем бой */
            this.fight(this.player1, this.player2);

            /** Узнаем кто победил */
            this.definingChampions();
        });
    }

    /**
     * Ф-я создания нового игрока
     *
     * @param {object} playerObj - Объект игрока
     * @returns {HTMLElement} - HTML елемент игрока
     */
    createPlayer = (playerObj) => {
        const {name, player, img, hp} = playerObj;

        // динамическое создание хтмл блоков для нового игрока
        const $player = createElement('div', 'player' + player);
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

    /**
     * Ф-я добавления нового елемента на арену
     *
     * @param {object} elem - Елемент который нужно добавить на арену
     */
    addingToArena = (elem) => {
        const $ARENAS = document.querySelector('.arenas'); // обращение к арене
        $ARENAS.appendChild(elem);
    }

    /**
     * Ф-я провоцырует драку описуя в логе что происходит в бою
     * также по окончанию боя вызывает вывод результатов
     *
     * @param {Object} player1
     * @param {Object} player2
     */
    fight = () => {
        const enemy = this.enemyAttack(); // нападение противника
        const player = this.playerAttack(); // мой ответ

        if(enemy.hit !== player.defence) { // я пропустил удар
            this.player1.changeHP(enemy.value); // у меня сгорают жизни
            this.player1.renderHP();
            this.generateLogs('hit', this.player2, this.player1, enemy.value); // что произошло, читай лог
        } else {
            this.generateLogs('defence', this.player2, this.player1); // я поставил блок
        }

        if(player.hit !== enemy.defence) { // я угадал его...
            this.player2.changeHP(player.value); // у него сгорают жизни
            this.player2.renderHP();
            this.generateLogs('hit', this.player1, this.player2, player.value); // что произошло, читай лог
        } else {
            this.generateLogs('defence', this.player1, this.player2); // у него хорошая защита
        }
    }

    /**
     * Ф-я создает атаку противника (компютера)
     *
     * @returns {{hit: (string), defence: (string), value: number}} - Объект с параметрами атаки противника
     */
    enemyAttack = () => {
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
    playerAttack = () => {
        const attack = {};
        const $formFight = document.querySelector('.control'); // обращение к форме

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

    /**
     * Ф-я генерирует лог
     *
     * @param {string} type - Тип лога
     * @param {object} player1 - Тот кто наносит удар
     * @param {object} player2 - Тот кто защищается
     * @param {number} [valueHP] - На сколько единиц сгорает жизнь
     */
    generateLogs = (type, player1, player2, valueHP) => {
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

    /** Ф-я определяет результат поединка */
    definingChampions = () => {
        const {name:name1, hp:hp1} = this.player1;
        const {name:name2, hp:hp2} = this.player2;

        if (hp1 === 0 && hp1 < hp2) {
            this.gameOver(name2); // чемпион игрок 2
        } else if (hp2 === 0 && hp2 < hp1) {
            this.gameOver(name1); // чемпион игрок 1
        } else if (hp1 === 0 && hp2 === 0) {
            this.gameOver('DRAW'); // ничья
        }
    }

    /**
     * Ф-я формирует и выводит блок с результатом поединка на табло
     *
     * @param {string} championName - Имя победителя
     */
    showResultOnDisplay = (championName) => {
        const winsTitle = createElement('div', 'loseTitle'); // создание блока заголовка

        winsTitle.innerText = (championName === 'DRAW') ? 'DRAW' : championName + ' wins'; // создание правильной фразы (ПОБЕДА ИЛИ НИЧЬЯ)

        this.addingToArena(winsTitle); // выводим блок с результатом поединка на табло
    }

    /**
     * Ф-я заканчивает игру.
     *
     * @param {string} champion - имя победителя или ДРАУ
     */
    gameOver = (champion) => {
        const $RANDOMBUTTON = document.querySelector('.button'); // обращение к кнопке
        $RANDOMBUTTON.disabled = true; // блочим кнопку от нажатия
        this.showResultOnDisplay(champion); // вызываем отображение результатов боя
        this.generateLogs('end', this.player1, this.player2); // прощаемся в логах
        this.createReloadButton(); // выводим кнопку возобновить игру
    }

    /** Ф-я создает кнопку рестарт для обновления страницы */
    createReloadButton = () => {
        const $reloadButtonDiv = createElement('div', 'reloadWrap');
        const $reloadButton = createElement('button', 'button');
        $reloadButton.innerText = 'Restart';

        $reloadButton.addEventListener('click', function(){ // по клику на рестарт обновляем станицу
            window.location.reload();
        });

        $reloadButtonDiv.appendChild($reloadButton);
        this.addingToArena($reloadButtonDiv); //добавляэм кнопку рестарт на арену
    }
}

export const game = new Game({
    player1: player1,
    player2: player2
});