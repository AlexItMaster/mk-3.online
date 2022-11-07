/** Підключення модулів. */
import { ANIMATE } from './modules/constants/index.js';
import { createNewTag } from './modules/utils/index.js';
import { getImg } from './modules/logic/index.js';

window.addEventListener('load', () => {    
    for(let key in ANIMATE) { 
        if (Array.isArray(ANIMATE[key]) && ANIMATE[key].length) {  
            const $listItem = createNewTag({
                tagName: 'li',
            });

            const $listItemLink = createNewTag({
                tagName: 'a',
                className: 'anchor',
                attrList: {
                    href: '#' + key, 
                }, 
                content: key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                    return index === 0 ? word.toUpperCase() : word.toLowerCase();
                }),
            });
            
            const $imgAvatar = createNewTag({
                tagName: 'img',
                attrList: {
                    src: getImg({type: 'avatars', name: key}), 
                    alt: key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                        return index === 0 ? word.toUpperCase() : word.toLowerCase();
                    }),
                },            
            });

            const $player = createNewTag({
                tagName: 'div',
                className: 'player',
            });          

            const $playerName = createNewTag({
                tagName: 'h2',
                className: 'player-name',
                attrList: {
                    id: key, 
                },  
                content: key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                    return index === 0 ? word.toUpperCase() : word.toLowerCase();
                }),               
            });
            
            const $animationsList = createNewTag({
                tagName: 'ul',
                className: 'animations-list',
            });

            $listItemLink.prepend($imgAvatar);
            $listItem.append($listItemLink);
            document.querySelector('.players-list').append($listItem);
            $playerName.addEventListener('click', () => window.scrollTo(0, 0));
            $player.append($playerName);
            $player.append($animationsList);
                         
            ANIMATE[key].forEach(item => {  
                const $li = createNewTag({
                    tagName: 'li',
                });

                const $animationName = createNewTag({
                    tagName: 'h3',
                    className: 'animation-name',
                    content: item,
                });               
            
                const $img = createNewTag({
                    tagName: 'img',
                    attrList: {
                        src: getImg({type: item, name: key}), 
                        alt: item,
                    },            
                });

                $li.append($animationName);
                $li.append($img);
                $animationsList.append($li);
            });   
            
            document.querySelector('.players').append($player);
        }
    }
});