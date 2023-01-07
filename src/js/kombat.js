import '../scss/kombat.scss';

/** Підключення модулів. */
import Game from './modules/class/Game.js';

window.addEventListener('load', () => { 
    const $ARENA = document.querySelector('.arenas');
    const $CHAT = document.querySelector('.chat');

    const player1Id = JSON.parse(localStorage.getItem('player1Id')); // Беремо id героя1 із localStorage.
    const player2Id = JSON.parse(localStorage.getItem('player2Id')); // Беремо id героя2 із localStorage.

    const newGame = new Game({
        player1Id, // Гравцем №1 обрано героя ...
        player2Id, // Гравцем №2 обрано героя ...
        $arena: $ARENA,
        $chat: $CHAT,
    });
    
    newGame.start();
    //console.log(newGame);
});

