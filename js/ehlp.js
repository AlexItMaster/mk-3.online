/**
 * Ф-я обращается к шкале жизни игрока
 *
 * @returns {Element|null}
 */
function elHP() {
    return document.querySelector('.player' + this.player + ' .life'); // обращение к шкале жизни игрока
}

export default elHP;