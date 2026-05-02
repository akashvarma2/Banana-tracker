import { initCore, checkCode } from './core.js';
import { renderHistory, renderFavorites, bindStaticUI } from './ui.js';

/* =====================================================
   GLOBAL BRIDGE (for onclick + history reuse)
===================================================== */
window.__checkCodeFromHistory = (code) => {
    checkCode(code);
};

/* =====================================================
   APP INIT
===================================================== */
function initApp() {

    // Bind UI-only handlers (menu, theme, static UI)
    bindStaticUI();

    // Start core logic system
    initCore();

    // Initial renders
    renderHistory();
    renderFavorites();

    // Splash screen timing (same UX as original)
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2600);

    // Auto-focus input after splash
    const input = document.getElementById('codeIn');
    if (input) {
        setTimeout(() => input.focus(), 2700);
    }
}

/* =====================================================
   BOOT APP ON LOAD
===================================================== */
window.addEventListener('load', initApp);
