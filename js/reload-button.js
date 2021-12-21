/** Ф-я создает кнопку рестарт для обновления страницы */
const createReloadButton = () => {
    const $reloadButtonDiv = createElement('div', 'reloadWrap');
    const $reloadButton = createElement('button', 'button');
    $reloadButton.innerText = 'Restart';

    $reloadButton.addEventListener('click', function(){ // по клику на рестарт обновляем станицу
        window.location.reload();
    });

    $reloadButtonDiv.appendChild($reloadButton);
    addingToArena($reloadButtonDiv); //добавляэм кнопку рестарт на арену
}

export default createReloadButton;