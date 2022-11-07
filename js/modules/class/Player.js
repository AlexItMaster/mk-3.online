import { getImg } from '../logic/index.js';
import { camelize } from '../utils/index.js';
import { ANIMATE } from '../constants/index.js';

class Player {
    constructor({id, name, hp = 100}){
        const nameToLoverCase = name.toLowerCase();

        this.createPropAnimate(nameToLoverCase);        
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.avatar = getImg({type: 'avatars', name: nameToLoverCase});
        this.biography = getImg({type: 'biography', name: nameToLoverCase});
        this.currentImg = this.stance;             
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
                    
                    this[attrName] = getImg({type: item, name: nameToLoverCase});
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



