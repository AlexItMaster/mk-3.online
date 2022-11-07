import { HEROES } from '../constants/index.js';
import { createNewTag, hidePage, delay, createSoundTrack } from '../utils/index.js';
import { clearGarbageTags, generateHeroesCollection, getPlayer } from '../logic/index.js';

class Menu {
    constructor({menuHolder, menu, title, loader, biography}) {        
        this.$menuHolder = menuHolder;
        this.$menu = menu;
        this.$title = title;
        this.$loader = loader;        
        this.$biography = biography;        
        this.player1Img = null; // Путь до поточної картинки героя що відображається на постаменті для гравця №1 (коли курсор виходить за межі меню постамент має очищатися).         
        this.player2Img = null; // Путь до поточної картинки героя що відображається на постаменті для гравця №2 (коли курсор виходить за межі меню постамент має очищатися).         
    }

    /**
     * Функція для приховування стартового лоадера.
     */
    hideStartLoader() {   
        this.$loader.classList.add('disabled');                
    }

    /**
     * Функція для приховування меню.
     */
    hideMenu = () => {
        this.$menuHolder.classList.add('disabled');
    }
    
    /**
     * Функція для відображення меню.
     */
    showMenu = () => {
        this.$menuHolder.classList.remove('disabled');
    }

    /**
     * Функція для відображення спливаючого вікна біографія.
     */
    showBiographyPopup = () => {
        this.$biography.classList.remove('disabled');
    }
    
    /**
     * Функція для приховування спливаючого вікна біографія.
     */
    hideBiographyPopup = () => {
        this.$biography.classList.add('disabled');
    }

    /**
     * Функція для блокування вибору героїв в меню.
     */
    blockPlayersSelection = () => {
        this.$menu.classList.add('blocked');
    };
    
    /**
     * Функція для активації вибору героїв в меню.
     */
    unlockPlayersSelection = () => {
        this.$menu.classList.remove('blocked');        
    };

    /**
     * Функція для очищення localStorage від даних героїв.
     */
    clearLocalStorage = () => {
        localStorage.removeItem('player1Id'); // Видаляємо дані героя з пам'яті якщо вони були.
        localStorage.removeItem('player2Id'); // Видаляємо дані героя з пам'яті якщо вони були.
    };

    /**
     * Функція для синхронизації записів про ідентифікатори обраних героїв в класі меню з локальним сховищем.
     */
    syncWithLocalStorage = playersCollectionNumber => {
        this[`player${playersCollectionNumber}IdLocalStorage`] = +localStorage.getItem(`player${playersCollectionNumber}Id`); // Зберігаємо запис про ідентифікатор обраного героя із локальго сховища в клас меню. 
    }

    /**
     * Функція для створення аватарки в головному меню.
     * 
     * @param {object} params - Параметри для створення аватарки src, alt, className. 
     * @param {string=} params.src - Путь до аватарки.
     * @param {string=} params.alt - Альт для аватарки.
     * @param {string} params.className - Ім'я класу елементу.
     * @returns {HTMLElement} - Аватар або логотип. 
     */
    createMenuItem = ({src = './images/avatars/logo.gif', alt = 'Mortal Kombat', className}) => {
        const $el = createNewTag({
            tagName: 'div',
            className: ['avatar', `div${className}`],
        });

        const $img = createNewTag({tagName: 'img'});
       
        $img.src = src;
        $img.alt = alt;

        if (className === '-logo') {
            const $a = createNewTag({
                tagName: 'a', 
                attrList: {
                    href: '/',
                },                 
            });

            $a.append($img);
            $el.append($a);
        } else {
            $el.append($img);
        }

        return $el;
    };

    /**
     *  Створення постаменту для героя.      
     * 
     * @param {number} playersCollectionNumber - Номер колекції героїв (1 - це колекція героїв для живого гравця або 2 - це колекція героїв для комп'ютера).
     * @returns {HTMLElement} - HTML елемент, постамент для героя.
     */
    createPedestal = playersCollectionNumber => {
        return createNewTag({
            tagName: 'div',
            className: 'pedestal' + playersCollectionNumber,
        });
    };

    /**
     * Функція для зміни пози на постаменті.
     * 
     * @param {string} src - Путь до картинки з новою позою.
     * @param {number} playersCollectionNumber - Номер колекції героїв (1 - це колекція героїв для живого гравця або 2 - це колекція героїв для комп'ютера).
     */
    changePosition = (srcImg, playersCollectionNumber) => {
        const $pedestal = this[`$pedestal${playersCollectionNumber}`];
        const playerSrc = `player${playersCollectionNumber}Img`;
        let src = srcImg;
        
        this[playerSrc] = (playersCollectionNumber === 2) ? src = src.replace('.gif', '2.gif') : src; // Треба щоб повторно з початку програвались картинки обраних одинакових героїв.                        
        this.upgradePedestal($pedestal, src, playersCollectionNumber, true);
    }

    /**
     * Функція для здійснення оновлення постаменту. 
     * 
     * @param {HTMLElement} $pedestal - Елемент постамент. 
     * @param {string} src - Путь до картинки.
     * @param {number} playersCollectionNumber - Номер колекції героїв (1 - це колекція героїв для живого гравця або 2 - це колекція героїв для комп'ютера).
     * @param {boolean} [update] - Мітка яка вказує на необхідність в оновленні постаменту. 
     */
    upgradePedestal = ($pedestal, src, playersCollectionNumber, update) => {
        const playerImg = `player${playersCollectionNumber}Img`;  
        
        if (this[playerImg] === null || update) {            
            const $img = createNewTag({tagName: 'img'});                
            
            this[playerImg] = src;            
            $img.src = this[playerImg];
            
            $pedestal.innerHTML = '';
            $pedestal.append($img);
        }
    }

    /**
     * Функція для очищення постаменту після прибирання курсору з області аватарки.
     * 
     * @param {HTMLElement} $avatar - Елемент аватар.
     * @param {HTMLElement} $pedestal - Елемент постамент (pedestal1 або pedestal2).
     */
    clearPedestal = ($avatar, $pedestal) => {
        $avatar.addEventListener('mouseout', () => {
            if (!this.player1IdLocalStorage && this.player1Img || this.player1Img === undefined) {            
                this.player1Img = null;
                $pedestal.innerHTML = '';
            } else if (this.player1IdLocalStorage && !this.player2IdLocalStorage && this.player2Img || this.player2Img === undefined) {
                this.player2Img = null;
                $pedestal.innerHTML = '';
            }
        });
    };

    /** 
     * Функція для створення галереї з аватарок. 
     * 
     * @param {object[]} playersCollection - Колекція героїв, масив об'єктів з героями.
     * @param {number} playersCollectionNumber - Номер колекції героїв (1 - це колекція героїв для живого гравця або 2 - це колекція героїв для комп'ютера).
     */
    createGalleryMenu = (playersCollection, playersCollectionNumber) => {        
        if (!this.$logo) {
            this.$logo = this.createMenuItem({className: '-logo'}); // Створення логотипу для меню.
        }

        const $logo = this.$logo;
        const $pedestal = this[`$pedestal${playersCollectionNumber}`] = this.createPedestal(playersCollectionNumber); // Створюємо постамент для героя.
        
        playersCollection.forEach((item, index) => {         
            const $avatar = this.createMenuItem({ // Створення аватарки.
                src: item.avatar, 
                alt: item.name, 
                className: index + 1,
            });

            $avatar.setAttribute('data-players-collection', playersCollectionNumber);
                        
            this.lookPlayer($avatar, $pedestal, item.stance, playersCollectionNumber);        
            this.selectPlayer($avatar, item);        
            this.clearPedestal($avatar, $pedestal);   

            this.$menu.append($avatar);      
        });       

        this.$menu.append($logo);
        this.$menu.append($pedestal);
    };

    /**
     * Функція для перегляду героя та додавання його на постамент.
     * 
     * @param {HTMLElement} $avatar - Елемент аватар.
     * @param {HTMLElement} $pedestal - Елемент постамент (player1 або player2).
     * @param {string} src - Путь до картинки аватару.
     * @param {number} playersCollectionNumber - Номер колекції героїв (1 - це колекція героїв для живого гравця або 2 - це колекція героїв для комп'ютера).
     */
    lookPlayer = ($avatar, $pedestal, src, playersCollectionNumber) => {  
        $avatar.addEventListener('mouseover', () => {
            this.upgradePedestal($pedestal, src, playersCollectionNumber);

            if(!$avatar.closest('.blocked')) { // Звук ховера меню.    
                createSoundTrack({
                    className: 'sound-menu-hover',
                    src: 'sounds/game/mk3-sound-main-menu-hover.mp3',    
                });             
            }            
        });
    };
    
    /** 
     * Функція для вибору героя при натисканні по ньому. 
     * 
     * @param {HTMLElement} $avatar - Елемент аватар.
     * @param {object} item - Об'єкт з даними героя.
     */
    selectPlayer($avatar, item) {
        $avatar.addEventListener('click', () => {
            if (this.player1IdLocalStorage && !this.player2IdLocalStorage && this.player2Img) { // Вибір героя для ворога.                                                                                                
                this.savingPlayer($avatar, item, 2);
                this.createBiographyPopup();
                this.beforeStartingGame();  
            } else if (!this.player1IdLocalStorage && !this.player2IdLocalStorage) { // Вибір свого героя.               
                this.savingPlayer($avatar, item, 1);               
                    
                setTimeout(() => {
                    this.$title.innerHTML = 'SELECT A FIGHTER FOR YOUR ENEMY';
                    this.replacePlayersCollection();
                    this.unlockPlayersSelection();
                    this.activateMarker();
                }, 3000);
            }  

            clearGarbageTags('.sound-menu-hover');
        });
    }

    /**
     * Функція для збереження обраного героя гравцем.
     * 
     * @param {HTMLElement} $avatar - Елемент аватар обраного героя.
     * @param {object} item - Об'єкт з даними про героя із колекції героїв.
     * @param {number} playersCollectionNumber - Номер колекції героїв (1 - це колекція героїв для живого гравця або 2 - це колекція героїв для комп'ютера).
     */
    savingPlayer = ($avatar, item, playersCollectionNumber) => {
        localStorage.setItem(`player${playersCollectionNumber}Id`, JSON.stringify(item.id)); // Додаємо запис про вибраного героя в localStorage.
        $avatar.classList.add(`active${playersCollectionNumber}`); // Додаємо клас active вибраному аватару.        
        this.blockPlayersSelection(); // Відключаємо можливість вибору героїв в меню.
        this.changePosition(item.victory, playersCollectionNumber); // Змінюємо позу героя після збереження вибору.           
        this.syncWithLocalStorage(playersCollectionNumber); // Зберігаємо запис про ідентифікатор обраного героя із локальго сховища в клас меню. 
        this[`player${playersCollectionNumber}`] = getPlayer(this[`playersCollection${playersCollectionNumber}`], this[`player${playersCollectionNumber}IdLocalStorage`]); // Зберігаємо об'єкт з даними про героя в клас меню.         
        this.$title.innerHTML = `YOUR FIGHTER - ${item.name.toUpperCase()} (Player-${playersCollectionNumber})`; // Змінюємо повідомлення в заголовкі.      
        
        createSoundTrack({
            className: 'sound-select-player',
            src: `sounds/names/mk3-sound-${item.name.toLowerCase()}.mp3`,    
        });
    };

    /**
     * Функція для зміни колекції героїв на ту в якій вибір героя ще не здійснювався.
     */
    replacePlayersCollection = () => {
        this.$menu.setAttribute('data-players-collection', 2);
    };    

    /**
     * Функція для відображення обраного героя із колекції живого гравця в колекції комп'ютера.
     */
    activateMarker = () => {
        const player1Collection2 = this.$menu.querySelector(`.div${this.player1IdLocalStorage}[data-players-collection='2']`); // Знаходимо вибраного player1 в playersCollection2.

        player1Collection2.classList.add(`active1`); // Робимо активним вибраного player1 в playersCollection2.
    }

    /**
     * Функція для наповнення спливаючого вікна біографія.
     */
    createBiographyPopup = () => {
        const $player1Img = createNewTag({
            tagName: 'img',
            className: 'player1',
        });
        
        const $player2Img = createNewTag({
            tagName: 'img',
            className: 'player2',
        });

        $player1Img.src = this.player1.biography;
        $player2Img.src = this.player2.biography;
        $player1Img.alt = this.player1.name;
        $player2Img.alt = this.player2.name;

        this.$biography.append($player1Img);
        this.$biography.append($player2Img);
    }

    /**
     * Функція для перенаправлення у гру та завершення роботи в меню.
     */
    async beforeStartingGame() {
        await delay(3000).then(() => this.hideMenu());
        await delay(700).then(() => this.showBiographyPopup());
        await delay(3000).then(() => this.hideBiographyPopup());
        await delay(1000).then(() => hidePage());
        await delay(1000).then(() => window.location.pathname = 'kombat.html'); // Переадресація на гру.
    }

    /**
     * Функція для запуску гри.
     */
    async init() {
        this.clearLocalStorage(); // Чистимо локальне сховище.
        this.syncWithLocalStorage(1); // Створюємо запис в класі меню, для зберігання даних про ідентифікатор обраного героя з колекції 1 який братиметься з локального сховища.  
        this.syncWithLocalStorage(2); // Створюємо запис в класі меню, для зберігання даних про ідентифікатор обраного героя з колекції 2 який братиметься з локального сховища. 

        this.playersCollection1 = generateHeroesCollection(HEROES); // Створюємо масив, колекцію гегоїв (об'єкт з даними) для Живого гравця. 
        this.playersCollection2 = generateHeroesCollection(HEROES); // Створюємо масив, колекцію гегоїв (об'єкт з даними) для Комп'ютера.

        this.createGalleryMenu(this.playersCollection1, 1); // Створюємо галерею героїв для Живого гравця.  
        this.createGalleryMenu(this.playersCollection2, 2); // Створюємо галерею героїв для Комп'ютера.

        if(!document.querySelector('.sound-gong')) {
            createSoundTrack({
                className: 'sound-gong',
                src: 'sounds/game/mk3-sound-gong.mp3',
            });
        }
        
        await delay(4000).then(() => this.hideStartLoader());
        await delay(1000).then(() => this.showMenu());         
        await delay(0).then(() => {
            if (!document.querySelector('.sound-menu-bg')) {
                createSoundTrack({
                    className: 'sound-menu-bg',
                    src: 'sounds/game/mk3-sound-main-menu-bg.mp3',
                    volume: 0.5,
                    controls: true,
                    loop: true,
                });
            }
        });         
    };
}

export default Menu;