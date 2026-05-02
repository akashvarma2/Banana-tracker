import { getState } from './state.js';

/* -------------------------
   RESULT DISPLAY
--------------------------*/
export function showResult(result) {
    const box = document.getElementById('resBox');

    if (!result) {
        box.classList.add('hidden');
        return;
    }

    document.getElementById('daysValue').innerText = result.days;

    document.getElementById('dateText').innerText =
        result.date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();

    const label = document.getElementById('statusLabel');

    box.classList.remove('hidden');

    if (result.days > 31) {
        label.innerText = "TOO OLD";
        box.className = "result-display bg-old";
    } else if (result.days <= 21) {
        label.innerText = "PERFECT";
        box.className = "result-display bg-perfect";
    } else {
        label.innerText = "ACCEPTABLE";
        box.className = "result-display bg-acceptable";
    }
}

/* -------------------------
   HISTORY RENDER
--------------------------*/
export function renderHistory() {
    const state = getState();
    const list = document.getElementById('historyList');

    if (!list) return;

    if (!state.scanHistory.length) {
        list.innerHTML = "";
        return;
    }

    list.innerHTML = `
        <div style="font-size:0.75rem; font-weight:900; color:var(--pulp-lime); margin-bottom:15px;">
            ARCHIVE
        </div>
        ${state.scanHistory.map(item => `
            <div class="log-item" onclick="window.__checkCodeFromHistory('${item.code}')">
                <div class="log-code">
                    ${item.code}
                </div>
                <div style="text-align:right;">
                    <span style="font-weight:900;">${item.days}D</span>
                    <div style="font-size:0.6rem; opacity:0.6;">
                        ${item.timestamp}
                    </div>
                </div>
            </div>
        `).join('')}
    `;
}

/* -------------------------
   FAVORITES RENDER (placeholder-safe)
--------------------------*/
export function renderFavorites() {
    const state = getState();
    const menu = document.getElementById('menu-fav-list');

    if (!menu) return;

    if (!state.favorites.length) {
        menu.innerHTML = `<div style="opacity:0.5; padding:10px;">No favorites</div>`;
        return;
    }

    menu.innerHTML = state.favorites.map(f => `
        <div class="menu-fav-item">
            ${f.brand}
        </div>
    `).join('');
}

/* -------------------------
   MENU HELPERS (UI ONLY)
--------------------------*/
export function bindStaticUI() {
    window.toggleMenu = () => {
        document.getElementById('menu-drawer').classList.toggle('open');
        document.getElementById('menu-overlay').classList.toggle('open');
    };

    window.toggleTheme = () => {
        document.body.classList.toggle('light-theme');
    };
}

/* -------------------------
   SMALL SAFE HELPER
--------------------------*/
export function showError() {
    const box = document.getElementById('resBox');
    box.classList.add('hidden');
}
