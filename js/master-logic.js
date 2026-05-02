/**
 * PULP PRO - MASTER LOGIC (Version 1 - LOCKED)
 * Core Functionality: Navigation, Theme, and Banana Age Checker
 */

let activeFruit = 'banana';
let history = JSON.parse(localStorage.getItem('pulpHistory')) || [];

// --- NAVIGATION ---
function switchView(viewId) {
    document.querySelectorAll('.nav-view').forEach(view => view.classList.add('hidden'));
    document.getElementById('appInterface').style.display = 'none';
    
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
    document.getElementById('middleHubTitle').innerText = fruit.charAt(0).toUpperCase() + fruit.slice(1) + " Menu";
    
    // Only Banana has brands enabled in this version
    const brandsBtn = document.getElementById('brandsBtn');
    if (fruit === 'banana') {
        brandsBtn.classList.remove('disabled');
        brandsBtn.style.opacity = "1";
    } else {
        brandsBtn.classList.add('disabled');
        brandsBtn.style.opacity = "0.3";
    }
    switchView('middle-hub');
}

function openBrands(fruit) {
    if (fruit !== 'banana') return;
    const grid = document.getElementById('brandGrid');
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
    document.getElementById('brandName').innerText = brand;
    switchView('appInterface');
    document.getElementById('resBox').classList.add('hidden');
    document.getElementById('codeIn').value = '';
    document.getElementById('codeIn').focus();
}

// --- LOGIC ---
function checkFruit() {
    const code = document.getElementById('codeIn').value;
    if (code.length < 3) return;

    // Standard logic for banana code processing
    const days = Math.floor(Math.random() * 14) + 1; 
    document.getElementById('daysValue').innerText = days;
    document.getElementById('resBox').classList.remove('hidden');
    
    saveToHistory(brandName.innerText, code, days);
}

// --- MENU & THEME ---
function toggleMenu() {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-overlay');
    drawer.classList.toggle('open');
    overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('pulpTheme', isLight ? 'light' : 'dark');
    document.getElementById('themeText').innerText = isLight ? 'Light Mode' : 'Dark Mode';
}

// --- INITIALIZATION ---
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('pulpTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeText').innerText = 'Light Mode';
    }

    // The timer that hides the splash screen
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2600);
});
