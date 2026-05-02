import * as UI from './ui.js';
import * as CORE from './core.js';

/* -------------------------
   UI NAVIGATION (GLOBAL HOOKS)
--------------------------*/

window.toggleMenu = function () {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
};

window.toggleTheme = function () {
    document.body.classList.toggle('light-theme');
};

window.toggleMenuFavs = function () {
    const list = document.getElementById('menu-fav-list');
    const icon = document.getElementById('favChevron');
    list.classList.toggle('show');
    icon.classList.toggle('bi-chevron-up');
    icon.classList.toggle('bi-chevron-down');
};

window.showHub = function () {
    UI.switchView('fruit-hub');
    UI.renderFavorites();
};

/* -------------------------
   CORE ACTIONS (IMPORTANT FIX)
--------------------------*/

window.checkFruit = function () {
    const input = document.getElementById('codeIn');
    const val = input.value.toUpperCase();

    CORE.runCheck(val, UI);
};

window.clearHistory = function () {
    CORE.clearHistory();
    UI.renderHistory();
};

window.toggleFavorite = function () {
    CORE.toggleFavorite();
    UI.renderFavorites();
};

window.copyResult = function () {
    CORE.copyResult();
};
