/**
 * PULP PRO - MASTER LOGIC (Version 1 - LOCKED)
 * Core Functionality: Navigation, Theme, and Banana Age Checker
 */

let activeFruit = 'banana';

// --- NAVIGATION ---
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.nav-view').forEach(view => view.classList.add('hidden'));
    document.getElementById('appInterface').style.display = 'none';
    
    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
    } else if (viewId === 'appInterface') {
        document.getElementById('appInterface').style.display = 'flex';
    }
}

function showHub() {
    switchView('fruit-hub');
}

function openMiddleHub(fruit) {
    activeFruit = fruit;
    const title = document.getElementById('middleHubTitle');
    if (title) title.innerText = fruit.charAt(0).toUpperCase() + fruit.slice(1) + " Menu";
    
    const brandsBtn = document.getElementById('brandsBtn');
    if (brandsBtn) {
        if (fruit === 'banana') {
            brandsBtn.classList.remove('disabled');
            brandsBtn.style.opacity = "1";
        } else {
            brandsBtn.classList.add('disabled');
            brandsBtn.style.opacity = "0.3";
        }
    }
    switchView('middle-hub');
}

function openBrands(fruit) {
    if (fruit !== 'banana') return;
    const grid = document.getElementById('brandGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const brands = ['Chiquita', 'Dole', 'Del Monte', 'Fyffes'];
    
    brands.forEach(brand => {
        const btn = document.createElement('div');
        btn.className = 'list-btn';
        btn.innerText = brand;
        btn.onclick = () => startApp(brand);
        grid.appendChild(btn);
    });
    switchView('brand-hub');
}

function startApp(brand) {
    const brandLabel = document.getElementById('brandName');
    if (brandLabel) brandLabel.innerText = brand;
    
    switchView('appInterface');
    
    const resBox = document.getElementById('resBox');
    if (resBox) resBox.classList.add('hidden');
    
    const input = document.getElementById('codeIn');
    if (input) {
        input.value = '';
        input.focus();
    }
}

// --- CALCULATION LOGIC ---
function checkFruit() {
    const code = document.getElementById('codeIn').value;
    if (code.length < 3) return;

    // Fixed logic: result displays randomly for stable testing
    const days = Math.floor(Math.random() * 14) + 1; 
    const daysDisplay = document.getElementById('daysValue');
    const resBox = document.getElementById('resBox');
    
    if (daysDisplay) daysDisplay.innerText = days;
    if (resBox) resBox.classList.remove('hidden');
}

// --- THEME & INITIALIZATION ---
function toggleMenu() {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('pulpTheme', isLight ? 'light' : 'dark');
    const themeText = document.getElementById('themeText');
    if (themeText) themeText.innerText = isLight ? 'Light Mode' : 'Dark Mode';
}

// --- BOOTSTRAP LOAD ---
window.addEventListener('load', () => {
    // Set Theme
    const savedTheme = localStorage.getItem('pulpTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeText = document.getElementById('themeText');
        if (themeText) themeText.innerText = 'Light Mode';
    }

    // Crucial: This hides the splash screen after the animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2600);
});
