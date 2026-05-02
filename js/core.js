import { getState, setState } from './state.js';
import * as UI from './ui.js';

export function initApp() {
    UI.bindStaticUI();
    UI.renderHistory();
    UI.renderFavorites();

    const input = document.getElementById('codeIn');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkCode();
        });
    }
}

/* -------------------------
   MAIN LOGIC
--------------------------*/

export function checkCode(valOverride = null) {
    const input = document.getElementById('codeIn');
    const val = (valOverride || input.value).toUpperCase();

    if (!val || val.length < 3) {
        UI.showError();
        return;
    }

    const m = val.charCodeAt(0);
    const d = val.charCodeAt(1);
    const y = val.charAt(2);

    const valid =
        m >= 65 && m <= 76 &&
        d >= 65 && d <= 90 &&
        (y === '1' || y === '2');

    if (!valid) {
        UI.showError();
        return;
    }

    const now = new Date();
    let day = d - 64;
    if (y === '2') day += 26;

    const date = new Date(now.getFullYear(), m - 65, day);
    if (date > now) date.setFullYear(now.getFullYear() - 1);

    const diff = Math.floor((now - date) / 86400000);

    UI.showResult(diff, date, val);

    const state = getState();

    state.scanHistory.unshift({
        code: val,
        days: diff,
        timestamp: new Date().toLocaleString()
    });

    if (state.scanHistory.length > 25) state.scanHistory.pop();

    setState({ scanHistory: state.scanHistory });

    UI.renderHistory();
}
