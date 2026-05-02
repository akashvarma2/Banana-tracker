import './bridge.js';
import { renderHistory, renderFavorites } from './ui.js';

/* -------------------------
   INITIAL BOOT
--------------------------*/

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('pulpTheme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeText').innerText = 'Light Mode';
    }

    renderHistory();
    renderFavorites();

    setTimeout(() => {
        document.body.classList.add('loaded');
        const input = document.getElementById('codeIn');
        if (input) input.focus();
    }, 2600);
});
