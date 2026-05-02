import * as UI from './ui.js';
import * as CORE from './core.js';

/* -------------------------
   GLOBAL BRIDGE (fixes onclick issues)
--------------------------*/

window.toggleMenu = () => {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
};

window.toggleTheme = () => {
    document.body.classList.toggle('light-theme');
};

window.toggleMenuFavs = () => {
    const list = document.getElementById('menu-fav-list');
    const icon = document.getElementById('favChevron');
    list.classList.toggle('show');
    icon.classList.toggle('bi-chevron-up');
    icon.classList.toggle('bi-chevron-down');
};

window.showHub = UI.showHub;
window.renderHistory = UI.renderHistory;
window.renderFavorites = UI.renderFavorites;

/* CORE ACTIONS */

window.checkFruit = (code) => {
    CORE.checkAndProcess(code);
};

window.clearHistory = CORE.clearHistory;
window.toggleFavorite = CORE.toggleFavorite;
window.copyResult = CORE.copyResult;
