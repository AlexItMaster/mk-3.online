import Logs from './Logs.js';
import { ATTACK, HEROES, HIT, ARENAS, ARENASSOUNDS, HITTYPE, DEFENCETYPE, ANIMATE } from '../constants/index.js';
import { getRandom, createNewTag, showPage, delay, camelize, createSoundTrack } from '../utils/index.js';
import { clearGarbageTags, generateHeroesCollection, getPlayer, formattingPlayerName } from '../logic/index.js';

class Game {
    constructor({player1Id, player2Id, $arena, $chat}) {
        this.playersCollection1 = generateHeroesCollection(HEROES);
        this.playersCollection2 = generateHeroesCollection(HEROES);
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.logs = new Logs($chat);
        this.$arena = $arena;
        this.$form = document.querySelector('form.control');
        this.$btn = this.$form.querySelector('.button');
    }
    
    /**
     * Функція для старту гри.
     */
    async start() {
        const player1 = getPlayer(this.playersCollection1, this.player1Id); // Гравець №1. 
        const player2 = getPlayer(this.playersCollection2, this.player2Id); // Гравець №2. 

        player1.playerNumber = 1; // Призначення гравцю номера №1.
        player2.playerNumber = 2; // Призначення гравцю номера №2.
        
        if (player1.name === player2.name) {
            player1.name = player1.name + '-' + player1.playerNumber;
            player2.name = player2.name + '-' + player2.playerNumber;
        }

        this.arenaAutoBgSelection(); // Підбір фону арени (виконується випадково).

        this.$player1 = this.createPlayer(player1); // Створення гравця.
        this.$player2 = this.createPlayer(player2); // Створення гравця.
        
        this.addingToArena(this.$player1); // Додавання гравця на арену.
        this.addingToArena(this.$player2); // Додавання гравця на арену.
        
        this.submitResult(player1, player2);

        this.logs.generateLogs({type: 'start', attackingPlayer: player1, defensivePlayer: player2}); // В логі виводиться перша фраза.

        await delay(0).then(() => showPage()); // Відбувається плавне відображення сторінки.            
        await delay(2500).then(() => this.createGong()); // Відобразити гонг.
        await delay(2000).then(() => this.removeGong()); // Прибрати гонг.
        await delay(500).then(() => this.showControls()); // Відобразити панель керування.        

        this.createSoundFormHover();
        this.formControlCheck();
    }

    /**
     * Функція для приховування повідомлення про початок битви.
     */
    removeGong = () => {
        document.querySelector('.gong-popup').remove();
    }

    /**
     * Функція для відображення форми керування.
     */
    showControls = () => {
        this.$form.classList.remove('disabled');
    }
    
    /**
     * Функція для приховування форми керування.
     */
    hideControls = () => {
        this.$form.classList.add('disabled');
    }

    /**
     * Функція для відображення повідомлення про початок битви.
     */
    createGong = () => {
        const $fightPopup = createNewTag({
            tagName: 'div',
            className: 'gong-popup',
        });

        createSoundTrack({
            className: 'sound-fight',
            src: 'sounds/game/mk3-sound-fight.mp3',
        });

        this.arenaAutoSoundSelection();       

        document.querySelector('body').append($fightPopup);
    }

    /**
     * Функція для автоматичного вибору фону арени.
     */
    arenaAutoBgSelection = () => {
        const arenaRandomImg = getRandom(ARENAS.length) - 1;
        const arenaNameImg = ARENAS[arenaRandomImg];
        const arenaSrc = `url(./images/arenas/${arenaNameImg}.png)`;
        
        this.$arena.style.backgroundImage = arenaSrc;
    }
 
    /**
     * Функція для автоматичного вибору фонового звуку на арені.
     */
    arenaAutoSoundSelection = () => {
        const arenaRandomSounds = getRandom(ARENASSOUNDS.length) - 1;
        const arenaNameSound = ARENASSOUNDS[arenaRandomSounds];        
        
        createSoundTrack({
            className: 'sound-arena-bg',
            src: `sounds/arena/${arenaNameSound}.mp3`,
            loop: true,
            volume: 0.5,
        });
    }

    /**
     * Функція для створення звукового супроводження при наведенні на кнопки форми.
     */
     createSoundFormHover = () => {
        this.$form.addEventListener('mouseover', (e) => {
            const elem = e.target.closest('.target-list label span');

            if (elem) {
                createSoundTrack({
                    className: 'sound-action-hover',
                    src: 'sounds/game/mk3-sound-action-menu-hover.mp3',
                });
            }
        });
    }

    /**
     * Функція для створення звукового супроводження при натисканні на кнопки форми.
     */
    createSoundFormClick = () => {                
        createSoundTrack({
            className: 'sound-action-select',
            src: 'sounds/game/mk3-sound-action-menu-select.mp3',
        });                

        clearGarbageTags('.sound-action-hover');                                   
    }
    
    /**
     * Функція для активування кнопки 'Fight' в формі.
     */
    formControlCheck = () => {
        const approvList = new Set();

        this.$form.addEventListener('click', (e) => {            
            const $span = e.target.closest('.target-list label span');
            const $button = e.target.closest('form .button');

            if ($span) {
                if ($span.dataset.type === 'hit') {
                    approvList.add($span.dataset.type);
                }
    
                if ($span.dataset.type === 'defence') {
                    approvList.add($span.dataset.type);
                }
                
                if (approvList.size >= 2) {
                    this.$btn.disabled = false;
                } 
                
                this.createSoundFormClick();                
            } 

            if ($button) {
                approvList.clear();
            }
        });
    }

    /**
     * Функція для створення нового гравця.
     * 
     * @param {object} player - Об'єкт з даними гравця. 
     * @param {string} player.name - Ім'я гравця. 
     * @param {number} player.playerNumber - Номер гравця, може бути №1 або №2. 
     * @param {number} player.hp - Залишок життя гравця від 100% до 0%.
     * @param {string} player.currentImg - Путь до картинки героя.
     * @returns {HTMLElement} - Готовий гравець.
     */
    createPlayer = ({name, playerNumber, hp, currentImg}) => {
        const $player = createNewTag({
            tagName: 'div',
            className: 'player' + playerNumber, // 1|2.
        });
        
        const $progressbar = createNewTag({
            tagName: 'div',
            className: 'progressbar',
        });
        
        const $life = createNewTag({
            tagName: 'div',
            className: 'life',
        });    
        $life.style.width = hp + '%'; // life 100%.
        
        const $name = createNewTag({
            tagName: 'div',
            className: 'name',
            content: name,
        });
        
        const $character = createNewTag({
            tagName: 'div',
            className: 'character',
        });
        
        const $img = createNewTag({
            tagName: 'img',
            attrList: {
                src: currentImg, 
                alt: name,
            },            
        });
        
        $player.append($progressbar);
        $player.append($character);
        $progressbar.append($life);
        $progressbar.append($name);
        $character.append($img);
        
        return $player;
    }

    /**
     * Функція для додавання HTML елементів до арени.
     * 
     * @param {HTMLElement} $elem - HTMLElement який треба додати до арени.
     */
    addingToArena = $elem => this.$arena.append($elem);

    /**
     * Функція для обробки події при відправці форми "control".
     * 
     * @param {object} player1 - Об'єкт гравця №1. 
     * @param {object} player2 - Об'єкт гравця №2. 
     */
    submitResult = (player1, player2) => {
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault();   

            this.$btn.disabled = true; 
            this.play(player1, player2);

            clearGarbageTags('.sound-action-select');
            clearGarbageTags('.sound-action-hover');
        });
    }

    /**
     * Функція для послідовного виконання дій під час гри.
     * 
     * @param {object} player1 - Об'єкт гравця №1. 
     * @param {object} player2 - Об'єкт гравця №2. 
     */
    async play(player1, player2) {
        await delay(0).then(() => this.hideControls());
        await delay(500).then(() => this.fight(player1, player2));
        await delay(4000).then(() => this.showResult(player1, player2));
    }

    /**
     * Функція для створення параметрів атаки гравця (комп'ютера).
     * 
     * @returns {object} - Об'єкт параметрів атаки виду: 
     * {
     *   hit: 'head|body|foot',      // - удар.
     *   defence: 'head|body|foot',  // - захист.
     *   value: 30                   // - сила удару.
     * }
     */
    generateComputerPlayerAttackParams = () => {
        const hit = ATTACK[getRandom(ATTACK.length) - 1];
        const defence = ATTACK[getRandom(ATTACK.length) - 1];

        return {
            value: getRandom(HIT[hit]),
            hit,
            defence,
        }
    }

    /**
     * Функція для створення параметрів атаки гравця (живого гравця).
     * 
     * @returns {object} - Об'єкт параметрів атаки виду: 
     * {
     *   hit: 'head|body|foot',      // - удар.
     *   defence: 'head|body|foot',  // - захист.
     *   value: 30                   // - сила удару.
     * }
     */
    generateRealPlayerAttackParams = () => {
        const attackParams = {};

        if (this.$form) {
            for (let item of this.$form) {
                if (item.checked && item.name === 'hit') {
                    attackParams.value = getRandom(HIT[item.value]); // Розмір заподіяної втрати життя (сила удару).
                    attackParams.hit = item.value;
                }
                
                if (item.checked && item.name === 'defence') {
                    attackParams.defence = item.value;
                }
                
                item.checked = false; // Очищення форми.                
            }
        }

        return attackParams;
    }

    /**
     * Функція для здійснення атаки на противника, успішної або ні.
     * 
     * @param {object[]} attacking - Масив атакуючого гравця.
     * @param {object} attacking[].attackingPlayer - Об'єкт гравця №1.
     * @param {object} attacking[].attackingParams - Об'єкт параметрів атаки.
     * @param {object[]} defensive - Масив обороняючого гравця.
     * @param {object} defensive[].defensivePlayer - Об'єкт гравця №2.
     * @param {object} defensive[].defensiveParams - Об'єкт параметрів атаки.
     */
    makeAttack = ([attackingPlayer, attackingParams], [defensivePlayer, defensiveParams]) => {
        if (attackingPlayer.hp > 0 && defensivePlayer.hp > 0) {
            const attackingPlayerHit = attackingParams.hit;
            const defensivePlayerDefence = defensiveParams.defence;

            this.animationAttackingPlayer(attackingPlayer, attackingPlayerHit);            
            this.animationDefensivePlayer(defensivePlayer, defensivePlayerDefence);

            setTimeout(() => { // Затримка тут щоб залишок життя не зменшувався до нанесення удару.  
                if (!(attackingPlayerHit === defensivePlayerDefence || attackingPlayerHit !== defensivePlayerDefence && defensivePlayerDefence === 'special')) { // Успішна атака.
                    const damage = attackingParams.value; // Нанесена шкода (сила удару атакуючого).          

                    defensivePlayer.changeHP(damage); // Зміна залишку життя у обороняючого.         
                                        
                    createSoundTrack({
                        className: 'sound-fight',
                        src: 'sounds/player-actions/mk3-sound-hit.mp3',
                    });

                    if (defensivePlayer.hp <= 0) {
                        this[`$player${defensivePlayer.playerNumber}`].querySelector('.character img').src = defensivePlayer.dizzy; // Поплив (смерть).
                        
                        createSoundTrack({
                            className: 'sound-finish',
                            src: 'sounds/player-actions/mk3-sound-damage3.mp3',
                            gender: defensivePlayer.name,
                        });       
                    } else if (defensivePlayer.hp > 0 && damage >= 10) {
                        this[`$player${defensivePlayer.playerNumber}`].querySelector('.character img').src = defensivePlayer.dizzy; // Переніс дуже сильний удар.
                        
                        createSoundTrack({
                            className: 'sound-fight',
                            src: 'sounds/player-actions/mk3-sound-damage2.mp3',
                            gender: defensivePlayer.name,
                        });

                        setTimeout(() => {
                            this[`$player${defensivePlayer.playerNumber}`].querySelector('.character img').src = defensivePlayer.stance;
                        }, 1100);
                    } else if (defensivePlayer.hp > 0 && damage < 10) {
                        this[`$player${defensivePlayer.playerNumber}`].querySelector('.character img').src = defensivePlayer.slipping; // Переніс удар.
                        
                        createSoundTrack({
                            className: 'sound-fight',
                            src: 'sounds/player-actions/mk3-sound-damage.mp3',
                            gender: defensivePlayer.name,
                        });    
                        
                        setTimeout(() => {
                            this[`$player${defensivePlayer.playerNumber}`].querySelector('.character img').src = defensivePlayer.stance;
                        }, 1100);
                    }

                    defensivePlayer.renderHP(); // Оновлення залишку життя обороняючого на табло.
                    
                    this.logs.generateLogs({type: 'hit', attackingPlayer, defensivePlayer, damage}); // Опис дій що відбулися під час вдалої атаки.
                } else { // Атака не вдалася.
                    this.logs.generateLogs({type: 'defence', attackingPlayer, defensivePlayer}); // Опис дій що відбулися під час не вдалої атаки.

                    createSoundTrack({
                        className: 'sound-fight',
                        src: 'sounds/player-actions/mk3-sound-hit2.mp3',
                    });
                    
                    createSoundTrack({
                        className: 'sound-fight',
                        src: 'sounds/player-actions/mk3-sound-defence.mp3',
                        gender: defensivePlayer.name,
                    });
                    
                    setTimeout(() => { 
                        this[`$player${defensivePlayer.playerNumber}`].querySelector('.character img').src = defensivePlayer.stance;
                    }, 1000);
                }             
            }, 2000);
        } 
    }

    /**
     * Функція для автоматичного вибору удару чи захисту з можливих варіантів.
     * 
     * @param {object} player - Об'єкт героя.
     * @param {string} type - Тип удару чи захисту.
     * @returns {string} - Тип удару чи захисту.
     */
    createTypeVariant = (player, type, action) => {
        const hitPlayerName= player.name.toLowerCase().replace(/-(\d)+$/gim, ''); // Видаляємо закінчення -1|-2 з імені героя.
        const typeVariants = (action === 'hit') ? HITTYPE[type] : DEFENCETYPE[type]; // Массив із можливих варіантів як здійснити удар або захист.
        const typeVariantsCount = typeVariants.length; // Доступна кількість можливих варіантів здійснення удару або захисту.
        let typeVariant = typeVariants[getRandom(typeVariantsCount) - 1]; // Випадковий варіант.

        if (!ANIMATE[hitPlayerName].some(item => item === typeVariant)) {            
            typeVariant = this.createTypeVariant(player, type, action);
        }

        return typeVariant;
    }

    /**
     * Функція для здійснення алгоритму анімації героя що обороняється, тип захисту - супер захист, діє від всіх видів ударів.
     * 
     * @param {object} params - Об'єкт з даними про тип захисту. 
     * @param {object} params.defensivePlayer - Об'єкт героя що обороняється.. 
     * @param {string} params.defenceMethodName - Назва властивості об'єкта (команда анімації). 
     * @param {HTMLElement} params.$character - Елемент героя. 
     * @param {HTMLElement} params.$characterImg - Елемент картинка героя. 
     */
    async animationDefensiveTypeSpecial({defensivePlayer, defenceMethodName, $character, $characterImg}) {
        await delay(0).then(() => {
            //$character.classList.add('walk-back'); // Відбувається переміщення героя по арені відходе назад. 
            this.movePlayerOnArena(defensivePlayer, $character, 'walk-back'); // Відбувається переміщення героя по арені відходе назад. 
            $characterImg.src = defensivePlayer[defenceMethodName]; // Підставляємо анімацію герой відходе назад.

            createSoundTrack({
                className: 'sound-defensive-running',
                src: 'sounds/player-actions/mk3-sound-running.mp3',
                loop: true,
            });
        });        
        await delay(2000).then(() => {
            //$character.classList.remove('walk-back'); // Відбувається переміщення героя по арені повертається на своє місце.       
            this.movePlayerOnArena(defensivePlayer, $character, 'back'); // Відбувається переміщення героя по арені повертається на своє місце.       
            $characterImg.src = defensivePlayer.walk; // Підставляємо анімацію герой йде вперед.
        }); 
        await delay(500).then(() => {
            clearGarbageTags('.sound-defensive-running');

            $characterImg.src = defensivePlayer.stance; // Підставляємо анімацію стійка.
        }); 
    }
    
    /**
     * Функція для здійснення алгоритму анімації героя що обороняється, тип захисту - скачок вгору.
     * 
     * @param {object} params - Об'єкт з даними про тип захисту. 
     * @param {object} params.defensivePlayer - Об'єкт героя що обороняється.. 
     * @param {string} params.defenceMethodName - Назва властивості об'єкта (команда анімації). 
     * @param {HTMLElement} params.$character - Елемент героя. 
     * @param {HTMLElement} params.$characterImg - Елемент картинка героя. 
     */
    async animationDefensiveTypeJumpToTop({defensivePlayer, defenceMethodName, $character, $characterImg}) {
        await delay(0).then(() => $characterImg.src = defensivePlayer[defenceMethodName]); // Підставляємо анімацію герой підскакує вгору.
        await delay(300).then(() => $character.classList.add('jump-to-top')); // Відбувається переміщення героя по арені підскакує вгору.        
        await delay(2000).then(() => $character.classList.remove('jump-to-top')); // Відбувається переміщення героя по арені повертається на своє місце.        
    }
    
    /**
     * Функція для здійснення алгоритму анімації героя що обороняється, тип захисту - звичайна оборона.
     * 
     * @param {object} params - Об'єкт з даними про тип захисту. 
     * @param {object} params.defensivePlayer - Об'єкт героя що обороняється.. 
     * @param {string} params.defenceMethodName - Назва властивості об'єкта (команда анімації). 
     * @param {HTMLElement} params.$characterImg - Елемент картинка героя. 
     */
    async animationDefensiveTypeDefault({defensivePlayer, defenceMethodName, $characterImg}) {
        await delay(0).then(() => $characterImg.src = defensivePlayer[defenceMethodName]); // Підставляємо анімацію.
    }

    /**
     * Функція для здійснення алгоритму анімації героя що обороняється.
     * 
     * @param {object} defensivePlayer - Об'єкт героя що обороняється.
     * @param {string} defenceType - Тип захисту.
     */
    animationDefensivePlayer = (defensivePlayer, defenceType) => {    
        const defenceTypeVariant = this.createTypeVariant(defensivePlayer, defenceType, 'defence'); // Випадковий варіант дії.                
        const defenceMethodName = camelize(defenceTypeVariant); // Назва властивості об'єкта (команда анімації).
        const $player = this[`$player${defensivePlayer.playerNumber}`]; // Елемент гравець.
        const $character = $player.querySelector('.character'); // Елемент героя.
        const $characterImg = $character.querySelector('img'); // Елемент картинка героя.

        $player.classList.remove('priority');

        switch (defenceTypeVariant) {
            case 'walk-back':
                this.animationDefensiveTypeSpecial({defensivePlayer, defenceMethodName, $character, $characterImg});
                
                break;
            case 'jump-to-top':
                this.animationDefensiveTypeJumpToTop({defensivePlayer, defenceMethodName, $character, $characterImg});

                break;        
            default:
                this.animationDefensiveTypeDefault({defensivePlayer, defenceMethodName, $characterImg});
                
                break;
        }

        clearGarbageTags('.sound-fight');
    }

    /**
     * Функція для здійснення алгоритму анімації героя що атакує, тип атаки - супер удар. 
     * 
     * @param {object} params - Об'єкт з даними для здійснення атаки.
     * @param {object} params.attackingPlayer - Об'єкт гравця що атакує.
     * @param {string} params.hitMethodName - Вид удару для атаки.
     * @param {HTMLElement} params.$character - Елемент гравець на арені.
     * @param {HTMLElement} params.$characterImg - Зображення гравця на арені. 
     */
    async animationAttackingTypeSpecial({attackingPlayer, hitMethodName, $character, $characterImg}) {
        await delay(0).then(() => {
            createSoundTrack({
                className: 'sound-fight',
                src: 'sounds/player-actions/mk3-sound-attack.mp3',
                gender: attackingPlayer.name,
            }); // Звук атаки кія.
        }); // Наносяться удари противнику.                                
        await delay(0).then(() => $characterImg.src = attackingPlayer[hitMethodName]); // Наноситься супер удар противнику.                                            
        await delay(500).then(() => {            
            const $fly = createNewTag({
                tagName: 'img',
                className: 'player' + attackingPlayer.playerNumber + '-fly', // 1|2.
                attrList: {
                    src: attackingPlayer.specialFly, 
                    alt: attackingPlayer.name + 'Super Hit',
                },            
            });            

            $character.append($fly);
            this.getFlyDestanceForPlayerHit(attackingPlayer);
            //$character.classList.add('special')
        }); // Відбувається переміщення вогню героя по арені.        
        await delay(2500).then(() => {
            document.querySelector('.player' + attackingPlayer.playerNumber + '-fly').src = '';
            document.querySelector('.player' + attackingPlayer.playerNumber + '-fly').remove();
            $characterImg.src = attackingPlayer.stance; // Підставляємо анімацію стійка.
        });
    }

    /**
     * Функція для здійснення переміщення об'єкту (снаряду) що випустив герой здійснивши супер удар.
     * 
     * @param {object} attackingPlayer - об'єкт героя що атакує.
     */
    getFlyDestanceForPlayerHit = (attackingPlayer) => {        
        const arenaCurrentCoordinates = this.$arena.getBoundingClientRect();

        if (attackingPlayer.playerNumber === 1) {
            document.querySelector('.player1-fly').style.left = arenaCurrentCoordinates.width + 'px'; 
        } else {
            document.querySelector('.player2-fly').style.right = arenaCurrentCoordinates.width + 'px';
        }
    }

    /**
     * Функція для здійснення переміщення героя по арені.
     * 
     * @param {object} player - Об'єкт гравця що має переміститися.
     * @param {HTMLElement} $character - Елемент гравець на арені.
     * @param {string} pointer - Точка в яку має переміститися герой.
     */
    movePlayerOnArena = (player, $character, pointer) => {
        const arenaCurrentCoordinates = this.$arena.getBoundingClientRect();
        const player1CurrentCoordinates = document.querySelector('.player1 .character img').getBoundingClientRect();
        const player2CurrentCoordinates = document.querySelector('.player2 .character img').getBoundingClientRect();    
        const distance = player2CurrentCoordinates.left - player1CurrentCoordinates.right;    
        const player1Half = player1CurrentCoordinates.width / 2;   
        const player2Half = player2CurrentCoordinates.width / 2;   
        const player1Indent = player1CurrentCoordinates.left - arenaCurrentCoordinates.left; 
        const player2Indent = arenaCurrentCoordinates.right - player2CurrentCoordinates.right; 
        
        switch (pointer) {
            case 'run':
                if (player.playerNumber === 1) { 
                    $character.style.left = player1Indent + distance + player2Half + 'px'; 
                } else {
                    $character.style.right = player2Indent + distance + player1Half + 'px';            
                }

                break;                
            case 'back':
                if (player.playerNumber === 1) {
                    $character.style.left = 20 + '%'; 
                } else {
                    $character.style.right = 20 + '%'; 
                }

                break;
            case 'walk-back':
                if (player.playerNumber === 1) {
                    $character.style.left = - player1Half + 'px'; 
                } else {
                    $character.style.right = - player2Half + 'px'; 
                }

                break;
        }        
    }   
    
    /**
     * Функція для здійснення алгоритму анімації героя що атакує, тип атаки - звичайна атака.
     * 
     * @param {object} params - Об'єкт з даними для здійснення атаки.
     * @param {object} params.attackingPlayer - Об'єкт гравця що атакує.
     * @param {string} params.hitMethodName - Вид удару для атаки.
     * @param {HTMLElement} params.$character - Елемент гравець на арені.
     * @param {HTMLElement} params.$characterImg - Зображення гравця на арені.
     */
    async animationAttackingTypeDefault({attackingPlayer, hitMethodName, $character, $characterImg}) {
        await delay(0).then(() => {
            $characterImg.src = attackingPlayer.run; // Підставляємо анімацію біг вперед.
            this.movePlayerOnArena(attackingPlayer, $character, 'run'); // Відбувається переміщення героя по арені.   

            createSoundTrack({
                className: 'sound-attacking-running',
                src: 'sounds/player-actions/mk3-sound-running.mp3',
                loop: true,
            }); // Звук біг.                
        }); 
        await delay(600).then(() => {
            createSoundTrack({
                className: 'sound-fight',
                src: 'sounds/player-actions/mk3-sound-attack.mp3',
                gender: attackingPlayer.name,
            }); // Звук атаки кія.  
        }); 
        await delay(500).then(() => {
            clearGarbageTags('.sound-attacking-running');        
            $characterImg.src = attackingPlayer[hitMethodName]; // Наносяться удари противнику.
        });                 
        await delay(1000).then(() => {      
            $characterImg.src = attackingPlayer.run; // Підставляємо анімацію біг вперед.        
            $character.classList.add('run-back'); // Відбувається переміщення героя по арені назад.   
            this.movePlayerOnArena(attackingPlayer, $character, 'back');

            createSoundTrack({
                className: 'sound-attacking-running',
                src: 'sounds/player-actions/mk3-sound-running.mp3',
                loop: true,
            }); // Звук біг.
        });              
        await delay(1000).then(() => {
            $character.classList.remove('run-back'); // Очищається клас що здійснює біг.                
            
            clearGarbageTags('.sound-attacking-running');        
        }); 
        await delay(0).then(() => $characterImg.src = attackingPlayer.stance); // Підставляємо анімацію стійка.
    }
    
    /**
     * Функція для здійснення алгоритму анімації героя що атакує.
     * 
     * @param {object} attackingPlayer - Об'єкт атакуючого героя.
     * @param {string} hitType - Тип удару.
     */
    animationAttackingPlayer = (attackingPlayer, hitType) => {        
        const hitTypeVariant = this.createTypeVariant(attackingPlayer, hitType, 'hit'); // Випадковий варіант.            
        const hitMethodName = camelize(hitTypeVariant); // Назва властивості об'єкта (команда анімації).        
        const $player = this[`$player${attackingPlayer.playerNumber}`];
        const $character = $player.querySelector('.character');
        const $characterImg = $character.querySelector('img');

        $player.classList.add('priority');

        switch (hitTypeVariant) {        
            case 'special':
                this.animationAttackingTypeSpecial({attackingPlayer, hitMethodName, $character, $characterImg});

                break;        
            default:
                this.animationAttackingTypeDefault({attackingPlayer, hitMethodName, $character, $characterImg});

                break;
        }        
    }

    /**
     * Функція для здійснення поєдинку.
     * 
     * @param {object} player1 - Обект гравця №1. 
     * @param {object} player2 - Обект гравця №2.
     */
    async fight(player1, player2) {
        const computerPlayerAttack = this.generateComputerPlayerAttackParams(); // Створення параметрів атаки (живий гравець).
        const realPlayerAttack = this.generateRealPlayerAttackParams(); // Створення параметрів атаки (комп'ютер).
        
        await delay(0).then(() => this.makeAttack([player1, realPlayerAttack], [player2, computerPlayerAttack])); // Атакує гравець №1, гравець №2 захищається.
        await delay(4000).then(() => this.makeAttack([player2, computerPlayerAttack], [player1, realPlayerAttack])); // Атакує гравець №2, гравець №1 захищається.
    }

    /**
     * Функція для створення фінального повідомлення (заголовка).
     * 
     * @param {string|undefined} [championName] - Не обов'язковий параметр, приймає або строчку, ім'я переможця "string" або нічого "undefined", у випадку нічиєї.
     */
    createResultTitle = championName => {    
        const $resultTitle = createNewTag({
            tagName: 'div',
            className: 'resultTitle',
        });

        $resultTitle.innerHTML = (championName) ? championName + ' wins!' : 'Draw!';
        this.addingToArena($resultTitle);
    }

    /**
     * Функція для визначення переможця і програвшого.
     * 
     * @param {object} player1 - Обект гравця №1. 
     * @param {object} player2 - Обект гравця №2.
     */
    showResult = (player1, player2) => {
        let champion, lose;

        if (player2.hp === 0 && player2.hp < player1.hp) { // Переміг реальний гравець.
            champion = player1.name;
            lose = player2.name;

            this.createResultTitle(champion); 
            this.$player1.querySelector('.character img').src = player1.victory;
            this.$player2.querySelector('.character img').src = player2.falling;

            createSoundTrack({
                className: 'sound-finish',
                src: `sounds/wins/mk3-sound-wins-${formattingPlayerName(champion)}.mp3`,
            });
        } else if (player1.hp === 0 && player1.hp < player2.hp) { // Переміг комп'ютер.
            champion = player2.name;
            lose = player1.name;

            this.createResultTitle(champion); 
            this.$player1.querySelector('.character img').src = player1.falling;
            this.$player2.querySelector('.character img').src = player2.victory;

            createSoundTrack({
                className: 'sound-finish',
                src: `sounds/wins/mk3-sound-wins-${formattingPlayerName(champion)}.mp3`,
            });
        } else if (player1.hp === 0 && player2.hp === 0) { // Нічия.
            this.createResultTitle(); 
            this.$player1.querySelector('.character img').src = player1.victory;
            this.$player2.querySelector('.character img').src = player2.victory;

            createSoundTrack({
                className: 'sound-finish',
                src: `sounds/wins/mk3-sound-wins-${formattingPlayerName(player1.name)}.mp3`,
            });

            createSoundTrack({
                className: 'sound-finish',
                src: `sounds/wins/mk3-sound-wins-${formattingPlayerName(player2.name)}.mp3`,
            });
        }

        if (player1.hp === 0 || player2.hp === 0) { // Кінець гри.
            this.gameOver(champion, lose);
            
            clearGarbageTags('.sound-arena-bg');

            createSoundTrack({
                className: 'sound-finish',
                src: 'sounds/game/mk3-sound-mortal-kombat.mp3',
            });
        } else {
            this.showControls(); // Відобразити панель керування.
        }
    }

    /**
     * Функція для створення кнопки 'Restart' щоб перезавантажити сторінку і почати нову гру.
     */
    createReloadButton = () => {
        const $reloadWrap = createNewTag({
            tagName: 'div',
            className: 'reloadWrap',
        });    
        const $reloadButton = createNewTag({
            tagName: 'button',
            className: 'button',
            attrList: {
                className: 'button', 
                type: 'button',
            },
        });

        $reloadButton.innerText = 'Restart';
        $reloadButton.addEventListener('click', () => window.location.pathname = 'index.html'); // Перенаправлення на сторінку.
        $reloadWrap.append($reloadButton);
        this.addingToArena($reloadWrap);
    }
    
    /**
     * Функція для завершення гри після закінчення бою.
     * 
     * @param {string} championName - Ім'я переможця. 
     * @param {string} loseName - Ім'я програвшого.
     */
    gameOver = (championName, loseName) => {
        this.$btn.disabled = true; // Кнопка 'Fight' стає не активна.
        this.logs.generateLogs({type: (championName && loseName) ? 'end' : 'draw', championName, loseName}); // Генерація фінального лога.
        this.createReloadButton(); // Створення кнопки 'Restart'.
    }
}

export default Game;
