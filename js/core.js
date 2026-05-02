import { getState, addHistory } from './state.js';
import { showResult, renderHistory } from './ui.js';

/* -------------------------
   INIT ENTRY
--------------------------*/
export function initCore() {
    const input = document.getElementById('codeIn');

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkCode();
            }
        });
    }
}

/* -------------------------
   MAIN FUNCTION
--------------------------*/
export function checkCode(valOverride = null) {
    const state = getState();

    const input = document.getElementById('codeIn');
    const val = (valOverride || input.value).toUpperCase();

    if (!val || val.length < 3) {
        showResult(null);
        return;
    }

    /* -------------------------
       VALIDATION LOGIC (UNCHANGED)
    --------------------------*/
    const m = val.charCodeAt(0);
    const d = val.charCodeAt(1);
    const y = val.charAt(2);

    const valid =
        m >= 65 && m <= 76 &&
        d >= 65 && d <= 90 &&
        (y === '1' || y === '2');

    if (!valid) {
        showResult(null);
        return;
    }

    /* -------------------------
       DATE CALCULATION (UNCHANGED)
    --------------------------*/
    const now = new Date();
    let day = d - 64;

    if (y === '2') day += 26;

    const date = new Date(now.getFullYear(), m - 65, day);

    if (date > now) {
        date.setFullYear(now.getFullYear() - 1);
    }

    const diff = Math.floor((now - date) / 86400000);

    /* -------------------------
       RESULT OBJECT
    --------------------------*/
    const result = {
        days: diff,
        date,
        code: val
    };

    showResult(result);

    /* -------------------------
       SAVE HISTORY
    --------------------------*/
    addHistory({
        code: val,
        days: diff,
        timestamp: new Date().toLocaleString()
    });

    renderHistory();
}
