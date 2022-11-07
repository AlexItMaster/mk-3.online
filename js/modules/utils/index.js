import { formattingPlayerName } from '../logic/index.js';

/**
 * Функція для генерування випадкового числа в діапазоні від Min до Max.
 * 
 * @param {number} range - Діапазон від 1 до range.
 * @returns {number} - Випадкове число.
 */
export const getRandom = range => {
    return (range) ? Math.ceil(Math.random() * range) : 20;
}

/**
 * Функція для генерування поточного часу.
 * 
 * @returns {string} - Поточний час в форматі (23:04:59).
 */
export const getTime = () => {
    const date = new Date();

    /**
     * Функція для форматування параметрів часу, години|хвилини|секунди з формату '2' в формат '02'.
     *
     * @param {number} param - години|хвилини|секунди.
     * @returns {string} - години|хвилини|секунди в форматі '02'.
     */
    const formatTime = param => {
        return (param < 10) ? '0' + param : param;
    }

    const hours = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const secunds = formatTime(date.getSeconds());
        
    return `${hours}:${minutes}:${secunds}`;
}

/**
 * Функція для створення нових ДОМ елементів. 
 * 
 * @param {object} params - Параметри нового ДОМ елементу.
 * @param {string} params.tagName - Назва тега.
 * @param {string|object[]=} params.className - Клас елементу.
 * @param {object=} params.attrList - Атрибути елементу.
 * @param {string|HTMLElement=} params.content - Наповнення елементу.
 * @returns {HTMLElement} - HTML елемент.
 */
export const createNewTag = ({tagName, className, attrList, content = ''}) => {
    const $newTag = document.createElement(tagName);

    const addClassAttr = value => {
        if (Array.isArray(value)) {
            value.forEach(item => {
                $newTag.classList.add(item);
            })
        } else {
            $newTag.classList.add(value);
        }
    }   
    
    if (className) {
        addClassAttr(className);        
    }

    if (attrList && typeCheck(attrList) === 'object') {
        const entries = Object.entries(attrList);
        
        entries.map(([key, value]) => {
            switch (key) {
                case 'className':
                    addClassAttr(value);
                    
                    break;  
                default:
                    $newTag.setAttribute(key, value);

                    break;
            }
        }); 
    }
        
    if (content && tagName !== 'ul' && tagName !== 'ol' && tagName !== 'img') {
        $newTag.innerHTML = content;
    }
    
    return $newTag;
}

/**
 * Функція для приховування сторінки.
 */
 export const hidePage = () => {
    document.querySelector('html').classList.add('disabled');
}

/**
 * Функція для відображення сторінки.
 */
export const showPage = () => {
    document.querySelector('html').classList.remove('disabled');
}

/**
 * Функція для встановлення затримки.
 * 
 * @param {number} [ms] - Час затримки.
 * @returns {object} - Проміс.
 */
export const delay = (ms = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

/**
 * Функція для перетворення строчок різного формату в формат 'camelCase'.
 * 
 * @param {string} str - Строчка формату 'aa-bb-cc' або 'aa bb cc' або 'aa_bb_cc'.
 * @returns {string} - Строчка формату 'aaBbCc'.
 */
export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/[\s_-]+/g, '');
}

/**
 * Функція для визначення типу даних.
 * 
 * @param {*} value - Дані будь якого типу.
 * @returns {string} - Назва типу даних.
 */
export const typeCheck = (value) => {
    const returnValue = Object.prototype.toString.call(value);
    
    const type = returnValue.substring(
        returnValue.indexOf(" ") + 1, 
        returnValue.indexOf("]"));

    return type.toLowerCase();
}

/**
 * Функція для запуску звукового фонового супроводження. 
 * 
 * @param {object} params - Об'єкт з параметрами для налаштування звукової доріжки.
 * @param {string} [params.id] - Назва Id.
 * @param {string|object[]} [params.className] - Назва класу.
 * @param {string} params.src - Путь до звукового треку.
 * @param {boolean} [params.controls] - Відображення панелі.
 * @param {boolean} [params.loop] - Програвання треку поколу.
 * @param {number} [params.volume] - Гучність від 0 - 1.
 * @param {boolean} [params.muted] - Приглушена гучність.
 * @param {string} [params.gender] - Ім'я героя передається якщо треба встановити стать для аудіо.
 */
export const createSoundTrack = ({volume = 1, gender, ...rest}) => {
    const $body = document.querySelector('body');
    
    if (gender) {
        gender = formattingPlayerName(gender);
 
        if (rest.src && rest.src.includes('.mp3') && (gender === 'sonya' || gender === 'sheeva' || gender === 'sindel')) { // Треба для аудіо якщо герой дівчина.
            rest.src = rest.src.slice(0, -4) + '-g' + '.mp3';  // Змінюємо путь додавши до імені аудіо файлу '-g', що означає жіночий голос.       
        }
    }

    const $el = createNewTag({
        tagName: 'audio',
        attrList: rest,
    });

    $el.volume = volume;        
    $el.play();

    $body.append($el);        
}

