import { LOGS, EMOJI } from '../constants';
import { getTime, getRandom } from '../utils';

class Logs {
    constructor($chat) {
        this.$chat = $chat;
    }

    /**
     * Функція для створення логів.
     * 
     * @param {object} params - Параметри лога.
     * @param {string} params.type - Тип лога, можливі варіанти: 'start|hit|defence|draw|end'.
     * @param {object=} params.attackingPlayer - Об'єкт гравця що атакує.
     * @param {object=} params.defensivePlayer - Об'єкт гравця що обороняється.
     * @param {string=} params.championName - Ім'я чемпіона.
     * @param {string=} params.loseName - Ім'я програвшого.
     * @param {number=} params.damage - Нанесена шкода.
     */
    generateLogs = ({type, attackingPlayer, defensivePlayer, championName, loseName, damage = 0}) => {
        const logType = LOGS[type];
        const emoji = EMOJI[type];
        const time = getTime();
        let attackingPlayerName = 'player1';
        let defensivePlayerName = 'player2';    
        let playerWins = 'Wins';
        let playerLose = 'Lose';
        let life = 100;
        let elem = '';
        let text = '';
        
        if (attackingPlayer && defensivePlayer) {
            attackingPlayerName = attackingPlayer.name.toUpperCase();
            defensivePlayerName = defensivePlayer.name.toUpperCase();
            life = defensivePlayer.hp;
        }
        
        if (championName && loseName) {
            playerWins = championName.toUpperCase();
            playerLose = loseName.toUpperCase();
        }

        switch (type) {
            case 'start':
                text = logType
                .replace('[time]', `<em>[${time}]</em>`)
                .replace('[player1]', `<b>${attackingPlayerName}</b>`)
                .replace('[player2]', `<b>${defensivePlayerName}</b>`);

                elem = `<p>${emoji} ${text}</p>`;
                break;
            case 'hit':
            case 'defence':
                text = logType[getRandom(logType.length - 1)]
                .replace('[playerKick]', `<b>${attackingPlayerName}</b>`)
                .replace('[playerDefence]', `<b>${defensivePlayerName}</b>`);

                elem = `<p><em>[${time}]</em> - ${emoji} ${text}<br> ${defensivePlayerName} Damage: -${damage}%<br> Life: [${life}/100]%</p>`;
                break;
            case 'draw':
                text = logType;

                elem = `<p><em>[${time}]</em> ${emoji} ${text}</p>`;
                break;            
            case 'end':
                text = logType[getRandom(logType.length - 1)]
                .replace('[playerWins]', `<b>${playerWins}</b>`)
                .replace('[playerLose]', `<b>${playerLose}</b>`);

                elem = `<p><em>[${time}]</em> ${emoji} ${text}</p>`;
                break;    
            default:
                elem = `<p><u>Error: Такого типу, як тип - [${type}] в логах, не існує!!!</u></p>`;
                break;         
        }    
        
        this.$chat.insertAdjacentHTML('afterbegin', elem); // Додавання тексту до чату перед його вмістом.  
    }
}

export default Logs;