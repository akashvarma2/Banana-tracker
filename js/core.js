import { getState, setState } from './state.js';

/* -------------------------
   CALCULATION CORE
--------------------------*/

export function runCheck(val, UI) {
    if (!val || val.length < 3) {
        UI.showResult(null);
        return;
    }

    const mChar = val.charCodeAt(0);
    const dChar = val.charCodeAt(1);
    const yDigit = val.charAt(2);

    const isValid =
        (mChar >= 65 && mChar <= 76) &&
        (dChar >= 65 && dChar <= 90) &&
        (yDigit === '1' || yDigit === '2');

    if (!isValid) {
        UI.showResult(null);
        return;
    }

    const now = new Date();
    const m = mChar - 65;

    let d = dChar - 64;
    if (yDigit === '2') d += 26;

    let hDate = new Date(now.getFullYear(), m, d);
    if (hDate > now) hDate.setFullYear(now.getFullYear() - 1);

    const diff = Math.floor((now - hDate) / (1000 * 60 * 60 * 24));

    const result = {
        days: diff,
        date: hDate
    };

    UI.showResult(result, val);

    const state = getState();

    state.scanHistory.unshift({
        code: val,
        days: diff,
        color: diff > 31 ? "#ff4d4d" : diff <= 21 ? "#a6e22e" : "#ff8c00",
        timestamp: new Date().toISOString(),
        brand: state.activeBrand || ''
    });

    if (state.scanHistory.length > 25) state.scanHistory.pop();

    setState({ scanHistory: state.scanHistory });

    UI.renderHistory();
}

/* -------------------------
   FAVORITES
--------------------------*/

export function toggleFavorite() {
    const state = getState();
    const id = `${state.activeFruit}_${state.activeBrand}`;

    const index = state.favorites.findIndex(f => f.id === id);

    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push({
            id,
            fruit: state.activeFruit,
            brand: state.activeBrand,
            page: 'Age Checker'
        });
    }

    setState({ favorites: state.favorites });
}

export function clearHistory() {
    setState({ scanHistory: [] });
}

/* -------------------------
   COPY RESULT
--------------------------*/

export function copyResult() {
    const days = document.getElementById('daysValue').innerText;
    const date = document.getElementById('dateText').innerText;
    const code = document.getElementById('codeIn').value.toUpperCase();

    if (document.getElementById('resBox').classList.contains('hidden')) return;

    const text = `Pulp Pro Report\nCode: ${code}\nAge: ${days} Days\nHarvest Date: ${date}`;

    navigator.clipboard.writeText(text);
}
