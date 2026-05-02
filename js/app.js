import { initCore, checkCode } from './core.js';
import { renderHistory, renderFavorites, bindStaticUI } from './ui.js';

/* -------------------------
   GLOBAL SAFE BRIDGE
   (needed for onclick + history clicks)
--------------------------*/
window.__checkCodeFromHistory = (code) => {
    checkCode(code);
};

/* -------------------------
   APP INIT
--------------------------*/
function initApp() {

    // 1. Bind static UI handlers (menu, theme, etc.)
    bindStaticUI();

    // 2. Initialize core logic
    initCore();

    // 3. Render initial UI state
    renderHistory();
    renderFavorites();

    // 4. Splash screen handling (kept same behavior)
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2600);

    // 5. Auto focus input (same UX as before)
    const input = document.getElementById('codeIn');
    if (input) {
        setTimeout(() => input.focus(), 2700);
    }
}

/* -------------------------
   START APP
--------------------------*/
window.addEventListener('load', initApp);
