import {
    scanHistory
} from './state.js';

import {
    checkCode,
    saveToHistory,
    toggleFavorite,
    isFavorite,
    clearHistory,
    setFruit,
    setBrand
} from './core.js';

import {
    renderHistory,
    renderFavorites,
    showResult,
    switchView,
    showHub
} from './ui.js';

/* -------------------------
   SERVICE WORKER
--------------------------*/

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.log('SW failed', err));
    });
}

/* -------------------------
   INITIAL LOAD
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
        document.getElementById('codeIn').focus();
    }, 2600);
});

/* -------------------------
   THEME + MENU
--------------------------*/

window.toggleTheme = function () {
    document.body.classList.toggle('light-theme');

    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('pulpTheme', isLight ? 'light' : 'dark');

    document.getElementById('themeText').innerText =
        isLight ? 'Light Mode' : 'Dark Mode';
};

window.toggleMenu = function () {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
};

window.toggleMenuFavs = function () {
    const list = document.getElementById('menu-fav-list');
    const icon = document.getElementById('favChevron');

    list.classList.toggle('show');
    icon.classList.toggle('bi-chevron-up');
    icon.classList.toggle('bi-chevron-down');
};

/* -------------------------
   NAVIGATION
--------------------------*/

window.showHub = function () {
    showHub();
};

/* -------------------------
   CALCULATION FLOW
--------------------------*/

window.checkFruit = function (historicalCode = null) {
    const input = document.getElementById('codeIn');

    const val = historicalCode || input.value.toUpperCase();
    if (historicalCode) input.value = historicalCode;

    const result = checkCode(val);

    if (!result) {
        showResult(null);
        triggerShake();
        return;
    }

    showResult(result, val);

    if (!historicalCode) {
        saveToHistory(val, result.days, "#ffffff");
        renderHistory();
    }
};

/* -------------------------
   FAVORITES
--------------------------*/

window.toggleFavorite = function () {
    toggleFavorite();
    renderFavorites();
};

/* -------------------------
   HISTORY CLEAR
--------------------------*/

window.clearHistory = function () {
    if (confirm("Wipe logs?")) {
        clearHistory();
        renderHistory();
    }
};

/* -------------------------
   COPY RESULT
--------------------------*/

window.copyResult = function () {
    const days = document.getElementById('daysValue').innerText;
    const date = document.getElementById('dateText').innerText;
    const code = document.getElementById('codeIn').value.toUpperCase();

    if (document.getElementById('resBox').classList.contains('hidden')) return;

    const text = `Pulp Pro Report\nCode: ${code}\nAge: ${days} Days\nHarvest Date: ${date}`;

    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    });
};

/* -------------------------
   HELPERS (UI-only)
--------------------------*/

function triggerShake() {
    document.getElementById('appCard').classList.add('shake');

    setTimeout(() => {
        document.getElementById('appCard').classList.remove('shake');
    }, 400);
}

function showCopySuccess() {
    const btn = document.getElementById('copyBtn');

    btn.classList.add('success');
    btn.innerHTML = `<i class="bi bi-check-lg"></i> COPIED`;

    setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = `<i class="bi bi-clipboard"></i> COPY`;
    }, 2000);
}

/* -------------------------
   INPUT EVENTS
--------------------------*/

const inputField = document.getElementById('codeIn');

inputField.addEventListener('input', () => {
    document.getElementById('resBox').classList.add('hidden');
    renderHistory();
});

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        window.checkFruit();
    }
});
