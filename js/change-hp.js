/**
 * Ф-я высчитывает остаток жизни по пропущеным ударам
 *
 * @param {number} lossesStep - Сила пропущенного удара или на сколько процентов нужно уменьшить жизнь
 * @returns {number} - Остаток жизни
 */
function changeHP(lossesStep) {
    this.hp -= lossesStep;

    if (this.hp <= 0) {
        this.hp = 0; // если шкала уходит в минуса то перезаписываем в 0
    }

    return this.hp;
}

export default changeHP;