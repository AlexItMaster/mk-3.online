/**
 * Ф-я создает время
 * @returns {string} - time 02:05:00
 */
const time = () => {
    const date = new Date();

    const formatTime = (param) => {
        return (param < 10) ? '0' + param : param;
    }

    const hours = formatTime(date.getHours());
    const minuts = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());

    return `${hours}:${minuts}:${seconds}`;
}

export default time;