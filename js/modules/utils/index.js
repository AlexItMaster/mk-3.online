/**
 * Ф-я создания нового хтмл блока
 *
 * @param {string} tag - Имя тэга
 * @param {string|boolean} [className] - Имя css класса
 * @param {object|undefined} [attrList] - Имя атрибута attrList[0] и его значение attrList[1]
 * @returns {HTMLElement} - Возвращает готовый тег
 */
export const createElement = (tag, className, attrList) => {
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
 * Ф-я создает время
 * @returns {string} - time 02:05:00
 */
export const time = () => {
    const date = new Date();

    /**
     * Приводит параметры времени часы|минуты|секунды из формата 2 в формат 02.
     *
     * @param {number} param - часы|минуты|секунды
     * @returns {string} - часы|минуты|секунды в формате 02
     */
    const formatTime = (param) => {
        return (param < 10) ? '0' + param : param;
    }

    const hours = formatTime(date.getHours());
    const minuts = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());

    return `${hours}:${minuts}:${seconds}`;
}

/**
 * Ф-я рандомайзер, создает случайное число из указываемого диапазона
 *
 * @param {number} range - Диапазон из которого будет вибрано случайное число
 * @returns {number} - случайное целое число или 20
 */
export const getRandom = (range) => {
    return (range) ? Math.ceil(Math.random() * range) : 20;
}