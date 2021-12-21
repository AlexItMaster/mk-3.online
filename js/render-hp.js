/** Ф-я изменяет шкалу жизни игрока */
function renderHP() {
    this.elHP().style.width = this.hp + '%'; // визуально ширину шкалы приводим в соответствие с остатком жизни
}

export default renderHP;