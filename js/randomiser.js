/**
 * Ф-я рандомайзер, создает случайное число из указываемого диапазона
 *
 * @param {number} range - Диапазон из которого будет вибрано случайное число
 * @returns {number} - случайное целое число или 20
 */
const getRandom = (range) => {
    return (range) ? Math.ceil(Math.random() * range) : 20;
}

export default getRandom;