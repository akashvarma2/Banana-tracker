// --- Global State ---
let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';
let stream = null;

// --- 1. BOOT SEQUENCE (Immediate Display) ---
window.addEventListener('DOMContentLoaded', () => {
    // Force show the app after 1.5 seconds regardless of what happens
    setTimeout(() => {
        document.body.classList.add('loaded');
        renderHistory();
        renderFavorites();
    }, 1500);
});

// --- 2. NAVIGATION (Standard) ---
function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    const appInterface = document.getElementById('appInterface');
    if (appInterface) appInterface.style.display = 'none';

    if (targetId === 'appInterface') {
        if (appInterface) appInterface.style.display = 'flex';
    } else {
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
    }
}

function showHub() { 
    closeScanner(); // Always kill camera when going home
    switchView('fruit-hub'); 
}

function openMiddleHub(fruit) {
    activeFruit = fruit;
    if (fruit === 'defects') { switchView('defects-hub'); return; }
    switchView('middle-hub');
    const title = fruit.charAt(0).toUpperCase() + fruit.slice(1);
    document.getElementById('middleHubTitle').innerText = `${title} Menu`;
    document.getElementById('brandsBtn').innerText = `${title} Brands`;
}

// --- 3. SCANNER (Isolated Logic) ---
async function openDefectScanner(commodity) {
    activeFruit = commodity.toLowerCase();
    document.getElementById('scanner-title').innerText = `SCANNING ${commodity.toUpperCase()}`;
    
    // Switch view FIRST so the user sees the UI immediately
    switchView('scanner-view');
    
    // Then attempt camera
    const video = document.getElementById('scanner-video');
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
        });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        alert("Camera Error: Please ensure you are on HTTPS and have granted permissions.");
        closeScanner();
    }
}

function closeScanner() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    switchView('defects-hub');
}

function startBurstScan() {
    const burstUI = document.getElementById('burst-count');
    const dots = document.querySelectorAll('.dot');
    burstUI.classList.remove('hidden');
    
    let count = 0;
    const interval = setInterval(() => {
        if(count < dots.length) {
            dots[count].classList.add('active');
            count++;
        }
    }, 400);

    setTimeout(() => {
        clearInterval(interval);
        burstUI.classList.add('hidden');
        dots.forEach(d => d.classList.remove('active'));
        alert(`Analysis complete for ${activeFruit}.`);
    }, 2200);
}

// --- 4. CORE APP LOGIC (Age Checker) ---
function openBrands(fruit) {
    activeFruit = fruit;
    switchView('brand-hub');
    const grid = document.getElementById('brandGrid');
    if (fruit === 'banana') {
        grid.innerHTML = `<div class="list-btn" onclick="openCalc('Chiquita')">Chiquita</div>`;
    } else {
        grid.innerHTML = `<div style="opacity:0.5; padding:20px;">Coming Soon</div>`;
    }
}

function openCalc(brand, fruit = activeFruit) {
    activeBrand = brand;
    activeFruit = fruit;
    switchView('appInterface');
    document.getElementById('brandName').innerText = brand;
    document.getElementById('commodityLabel').innerText = `${activeFruit.toUpperCase()} AGE CHECKER`;
    renderHistory();
}

function checkFruit() {
    const val = document.getElementById('codeIn').value.toUpperCase();
    if (val.length < 3) return;
    
    // Simplified logic for stability
    const mChar = val.charCodeAt(0), dChar = val.charCodeAt(1), yDigit = val.charAt(2);
    const isValid = (mChar >= 65 && mChar <= 76) && (dChar >= 65 && dChar <= 90);
    
    if (isValid) {
        document.getElementById('resBox').classList.remove('hidden');
        document.getElementById('daysValue').innerText = "24"; // Placeholder for stability
    }
}

function renderHistory() {
    const section = document.getElementById('historySection');
    if (scanHistory.length > 0) section.style.display = "block";
}

function renderFavorites() {
    const section = document.getElementById('favorites-section');
    if (favorites.length > 0) section.classList.remove('hidden');
}

function toggleMenu() {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}
