import { scanHistory, favorites, activeFruit, activeBrand, saveHistory, saveFavorites } from './state.js';

/* -------------------------
   NAVIGATION STATE HELPERS
--------------------------*/

export function setFruit(fruit) {
    activeFruit = fruit;
}

export function setBrand(brand) {
    activeBrand = brand;
}

/* -------------------------
   FAVORITES LOGIC
--------------------------*/

export function toggleFavorite() {
    const id = `${activeFruit}_${activeBrand}`;
    const index = favorites.findIndex(f => f.id === id);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({
            id,
            fruit: activeFruit,
            brand: activeBrand,
            page: 'Age Checker'
        });
    }

    saveFavorites();
}

export function isFavorite() {
    const id = `${activeFruit}_${activeBrand}`;
    return favorites.some(f => f.id === id);
}

/* -------------------------
   HISTORY LOGIC
--------------------------*/

export function saveToHistory(code, days, color) {
    const now = new Date();

    const ts = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
    })} • ${now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}`.toUpperCase();

    scanHistory.unshift({
        code,
        days,
        color,
        timestamp: ts,
        brand: activeBrand
    });

    if (scanHistory.length > 25) scanHistory.pop();

    saveHistory();
}

export function clearHistory() {
    scanHistory.length = 0;
    saveHistory();
}

/* -------------------------
   CALCULATION LOGIC
--------------------------*/

export function checkCode(val) {
    if (!val || val.length < 3) return null;

    const mChar = val.charCodeAt(0);
    const dChar = val.charCodeAt(1);
    const yDigit = val.charAt(2);

    const isValid =
        (mChar >= 65 && mChar <= 76) &&
        (dChar >= 65 && dChar <= 90) &&
        (yDigit === '1' || yDigit === '2');

    if (!isValid) return null;

    const now = new Date();
    const m = mChar - 65;

    let d = dChar - 64;
    if (yDigit === '2') d += 26;

    let hDate = new Date(now.getFullYear(), m, d);

    if (hDate > now) {
        hDate.setFullYear(now.getFullYear() - 1);
    }

    const diff = Math.floor((now - hDate) / (1000 * 60 * 60 * 24));

    return {
        days: diff,
        date: hDate
    };
}

import { setState, getState } from './state.js';
import * as UI from './ui.js';

export function checkAndProcess(val) {
    const result = checkCode(val);

    if (!result) {
        UI.showResult(null);
        return;
    }

    UI.showResult(result, val);

    const state = getState();

    state.scanHistory.unshift({
        code: val,
        days: result.days,
        color: "#fff",
        timestamp: new Date().toISOString()
    });

    setState({ scanHistory: state.scanHistory });

    UI.renderHistory();
}
