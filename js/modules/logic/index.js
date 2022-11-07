import Player from '../class/Player.js';

/**
 * Функція для генерації колекції (об'єкту з даними) героїв.
 * 
 * @param {object[]} heroesList - Массив з іменами героїв. 
 * @returns {object[]} - Колекція (масив об'єктів з данними) героїв.
 */
 export const generateHeroesCollection = (heroesList) => {
    const HEROESCOLLECTION = [];

    heroesList.forEach((heroName, index) => {
        const hero = new Player({id: index + 1, name: heroName});
        HEROESCOLLECTION.push(hero);
    });

    return HEROESCOLLECTION;
}

/**
 * Функція для пошуку героя в колекції по id.
 * 
 * @param {object[]} playersCollection - Колекція героїв (масив об'єктів).
 * @param {number} playerId - Ідентифікатор героя.
 * @returns {object} - Об'єкт героя.
 */
export const getPlayer = (playersCollection, playerId) => {    
    return playersCollection.find(hero => hero.id === playerId);
}

/**
 * Функція для того щоб зформувати путь до картинки.
 * 
 * @param {object} params - Об'єкт з параметрами. 
 * @param {string} params.type - Тип картинки (avatar|biography|sprite).
 * @param {string=} params.name - Ім'я героя. 
 * @returns {string} - Путь до картинки.
 */
 export const getImg = ({type, name}) => {
    switch (type) {
        case 'avatars':
            return `./images/${type}/${name}.gif`;
        case 'biography':
            return `./images/${type}/${name}.gif`;
        case 'stance':
        case 'walk':
        case 'walk-back':
        case 'run':
        case 'punch-to-head':
        case 'punch-to-body':
        case 'uppercut':
        case 'kick-to-head':
        case 'kick-to-body':
        case 'kick-to-foot':
        case 'special':
        case 'special-fly':
        case 'block-head':
        case 'block-body':
        case 'block-foot':
        case 'squat':
        case 'jump-to-top':
        case 'dizzy':
        case 'falling':
        case 'slipping':
        case 'finishers':
        case 'victory':
            return `./images/animations/${name}-${type}.gif`;
        default:
            console.log(`Такий тип (${type}) картинки, не існує!`);
            return false;
    }
}

/**
 * Функція для вичіщання неактуальних тегів (аудіо). 
 * 
 * @param {string} selector - Селектор по якому знаходиться тег що підлягатиме видаленню. 
 */
export const clearGarbageTags = (selector) => {
    if(document.querySelectorAll(selector).length) {
        document.querySelectorAll(selector).forEach(item => item.remove());
    }
}

/**
 * Функція для форматування імені героя для примінення його в порівняннях умов.
 * 
 * @param {string} name - Імя героя в форматі 'Player-1'.
 * @returns {string} - Імя героя в форматі 'player'. 
 */
export const formattingPlayerName = name => name.toLowerCase().replace(/-(\d)+$/gim, '');

