/**
 * Ф-я создания нового хтмл блока
 *
 * @param {string} tag - Имя тэга
 * @param {string|boolean} [className] - Имя css класса
 * @param {object|undefined} [attrList] - Имя атрибута attrList[0] и его значение attrList[1]
 * @returns {HTMLElement} - Возвращает готовый тег
 */
const createElement = (tag, className, attrList) => {
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

export default createElement;