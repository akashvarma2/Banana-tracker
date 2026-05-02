import { getState } from './state.js';

/* -------------------------
   STATIC UI BINDINGS
--------------------------*/

export function bindStaticUI() {
    window.toggleMenu = () => {
        document.getElementById('menu-drawer').classList.toggle('open');
        document.getElementById('menu-overlay').classList.toggle('open');
    };

    window.toggleTheme = () => {
        document.body.classList.toggle('light-theme');
    };

    window.clearHistory = () => {
        const state = getState();
        state.scanHistory = [];
        localStorage.setItem('pulpProHistory', JSON.stringify([]));
        location.reload();
    };
}

/* -------------------------
   RESULT DISPLAY
--------------------------*/

export function showResult(days, date, code) {
    const box = document.getElementById('resBox');

    document.getElementById('daysValue').innerText = days;

    document.getElementById('dateText').innerText =
        date.toLocaleDateString('en-GB').toUpperCase();

    box.classList.remove('hidden');

    const label = document.getElementById('statusLabel');

    if (days > 31) {
        label.innerText = "TOO OLD";
        box.className = "result-display bg-old";
    } else if (days <= 21) {
        label.innerText = "PERFECT";
        box.className = "result-display bg-perfect";
    } else {
        label.innerText = "ACCEPTABLE";
        box.className = "result-display bg-acceptable";
    }
}

export function showError() {
    const box = document.getElementById('resBox');
    box.classList.add('hidden');
}

/* -------------------------
   HISTORY
--------------------------*/

export function renderHistory() {
    const state = getState();
    const list = document.getElementById('historyList');

    if (!state.scanHistory.length) return;

    list.innerHTML = state.scanHistory.map(item => `
        <div class="log-item" onclick="window.checkCode('${item.code}')">
            <div>${item.code}</div>
            <div>${item.days || ''}</div>
        </div>
    `).join('');
}

/* -------------------------
   FAVORITES (placeholder safe)
--------------------------*/

export function renderFavorites() {
    const state = getState();
    const menu = document.getElementById('menu-fav-list');

    if (!menu) return;

    if (!state.favorites.length) {
        menu.innerHTML = "<div style='opacity:0.5'>No favorites</div>";
        return;
    }
}
