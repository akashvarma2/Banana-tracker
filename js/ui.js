import {
    scanHistory,
    favorites
} from './state.js';

import {
    toggleFavorite,
    isFavorite
} from './core.js';

/* -------------------------
   NAVIGATION HELPERS
--------------------------*/

export function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    document.getElementById('appInterface').style.display = 'none';

    if (targetId === 'appInterface') {
        document.getElementById('appInterface').style.display = 'flex';
        setTimeout(() => document.getElementById('codeIn').focus(), 100);
    } else {
        document.getElementById(targetId).classList.remove('hidden');
    }
}

export function showHub() {
    switchView('fruit-hub');
    renderFavorites();
}

/* -------------------------
   FAVORITES UI
--------------------------*/

export function renderFavorites() {
    const section = document.getElementById('favorites-section');
    const grid = document.getElementById('fav-grid');
    const menuList = document.getElementById('menu-fav-list');

    if (!favorites.length) {
        section.classList.add('hidden');
        menuList.innerHTML = `<div style="padding:10px; font-size:0.6rem; opacity:0.3;">NO SAVED FAVS</div>`;
        return;
    }

    section.classList.remove('hidden');

    grid.innerHTML = favorites.map(f => `
        <div class="fav-card" onclick="openCalc('${f.brand}', '${f.fruit}')">
            <i class="bi bi-star-fill"></i>
            <span>${f.brand}</span>
            <small style="opacity:0.5; font-size:0.55rem;">${f.fruit.toUpperCase()}</small>
        </div>
    `).join('');

    menuList.innerHTML = favorites.map(f => `
        <div class="menu-fav-item" onclick="openCalc('${f.brand}', '${f.fruit}'); toggleMenu();">
            ${f.brand}
            <span>(${f.page || 'Age Checker'})</span>
        </div>
    `).join('');
}

/* -------------------------
   HISTORY UI
--------------------------*/

export function renderHistory() {
    const list = document.getElementById('historyList');
    const section = document.getElementById('historySection');
    const boxHidden = document.getElementById('resBox').classList.contains('hidden');

    if (!scanHistory.length) {
        section.style.display = "none";
        return;
    }

    if (window.innerWidth >= 992) {
        section.style.display = "block";
    } else {
        section.style.display = boxHidden ? "none" : "block";
    }

    list.innerHTML =
        `<div style="font-size:0.75rem; font-weight:900; color:var(--pulp-lime); margin-bottom:15px; border-bottom:1px solid var(--border-glass); padding-bottom:8px;">
            ARCHIVE
        </div>` +
        scanHistory.map(item => `
            <div class="log-item" onclick="checkFruit('${item.code}')">
                <div class="log-code">
                    ${item.code}
                    <small style="font-size:0.5rem; opacity:0.6;">${item.brand || ''}</small>
                </div>
                <div style="text-align:right;">
                    <span style="color:${item.color}; font-weight:900;">${item.days}D</span>
                    <span class="log-timestamp">${item.timestamp}</span>
                </div>
            </div>
        `).join('');
}

/* -------------------------
   RESULT UI
--------------------------*/

export function showResult(result, code) {
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
        box.className = 'result-display bg-old';
    } else if (result.days <= 21) {
        label.innerText = "PERFECT";
        box.className = 'result-display bg-perfect';
    } else {
        label.innerText = "ACCEPTABLE";
        box.className = 'result-display bg-acceptable';
    }
}
