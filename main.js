const scorpion = {
    name: 'Scorpion',
    hp: 80,
    img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
    waepon: ['sword', 'dagger', 'nunchucks'],
    attack: function (name){
        console.log(name + ' Fight...');
    }
};

const subzero = {
    name: 'Subzero',
    hp: 71,
    img: 'http://reactmarathon-api.herokuapp.com/assets/subzero.gif',
    waepon: ['dagger', 'nunchucks'],
    attack: function (name){
        console.log(name + ' Fight...');
    }
};

function createPlayer (playerNumber, player){
    const $player = document.createElement('div');
    const $progressbar = document.createElement('div');
    const $character = document.createElement('div');
    const $life = document.createElement('div');
    const $name = document.createElement('div');
    const $img = document.createElement('img');

    $player.classList.add(playerNumber);
    $progressbar.classList.add('progressbar');
    $character.classList.add('character');
    $life.classList.add('life');
    $name.classList.add('name');
    $img.src = player.img;

    $character.appendChild($img);
    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $player.appendChild($progressbar);
    $player.appendChild($character);

    $name.innerText = player.name;
    $life.style.width = player.hp +'%';

    const $arenas = document.querySelector('.arenas');
    $arenas.appendChild($player);
}

createPlayer('player1', scorpion);
createPlayer('player2', subzero);
