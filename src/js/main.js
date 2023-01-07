import '../scss/menu.scss';

/** Підключення модулів */
import Menu from './modules/class/Menu.js';

window.addEventListener('load', () => { 
    const $MENUHOLDER = document.querySelector('.menu-holder');
    const $MENU = $MENUHOLDER.querySelector('.menu');
    const $TITLE = document.querySelector('.title');
    const $LOADER = document.querySelector('.start-loader');
    const $BIOGRAPHY = document.querySelector('.biography');

    const menu = new Menu({
        menuHolder: $MENUHOLDER,
        menu: $MENU,
        title: $TITLE,
        loader: $LOADER,
        biography: $BIOGRAPHY,
    });
    
    document.querySelector('.start-loader').addEventListener('click', () => { 
        menu.init();
    });
    //console.log(menu);
});