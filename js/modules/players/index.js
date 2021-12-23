class Player {
    constructor (props) {
        this.player = props.player;
        this.name = props.name;
        this.hp = props.hp;
        this.img = props.img;
    }

    /**
     * Ф-я обращается к шкале жизни игрока
     *
     * @returns {Element|null}
     */
    elHP = () => {
        return document.querySelector('.player' + this.player + ' .life'); // обращение к шкале жизни игрока
    }

    /**
     * Ф-я высчитывает остаток жизни по пропущеным ударам
     *
     * @param {number} lossesStep - Сила пропущенного удара или на сколько процентов нужно уменьшить жизнь
     * @returns {number} - Остаток жизни
     */
    changeHP = (lossesStep) => {
        this.hp -= lossesStep;

        if (this.hp <= 0) {
            this.hp = 0; // если шкала уходит в минуса то перезаписываем в 0
        }

        return this.hp;
    }

    /** Ф-я изменяет шкалу жизни игрока */
    renderHP = () => {
        this.elHP().style.width = this.hp + '%'; // визуально ширину шкалы приводим в соответствие с остатком жизни
    }
}

export const player1 = new Player({
    player: 1,
    name: 'Scorpion',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
});

export const player2 = new Player({
    player: 2,
    name: 'Subzero',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/subzero.gif',
});