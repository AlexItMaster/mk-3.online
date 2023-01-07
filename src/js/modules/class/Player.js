import { getImg } from '../logic';
import { camelize } from '../utils';
import { ANIMATE } from '../constants';

class Player {
    constructor({id, name, hp = 100}){
        const nameToLoverCase = name.toLowerCase();

        this.createPropAnimate(nameToLoverCase);        
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.avatar = getImg({type: 'avatars', name});
        this.biography = getImg({type: 'biography', name});
        this.currentImg = this.stance; // Треба щоб відобразилася стартова позиція стойки героя перед боєм на арені.
    }

    /**
     * Функція для створення властивості анімації (тобто команди для рухів) в об'єкті героя.
     *      
     * @param {string} nameToLoverCase - Ім'я героя.
     */
    createPropAnimate = nameToLoverCase => {
        for(let key in ANIMATE) {            
            if (nameToLoverCase === key && ANIMATE[key].length) {      
                ANIMATE[key].forEach(item => {  
                    const attrName = camelize(item);
                    
                    this[attrName] = getImg({type: item, name: camelize(nameToLoverCase, true)});
                });
            }
        }
    }

    /**
     * Функція для вираховування залишку життя гравця.
     * 
     * @param {number} damage - Число на яке зменшиться життя гравця.
     */
    changeHP = damage => {    
        this.hp -= damage; // Віднімається життя.

        if (this.hp <= 0) {
            this.hp = 0;
        }
    };

    /**
     * Функція для виявлення гравця якому треба оновити залишок життя.
     * 
     * @returns {HTMLElement} - Гравець якому треба оновити залишок життя.
     */
    elHP = () => {
        return document.querySelector(`.player${this.playerNumber} .life`);
    };

    /**
     * Функція для оновлення залишку життя.
     */
    renderHP = () => {
        this.elHP().style.width = this.hp + '%';
    };
}

export default Player;



