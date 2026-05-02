// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW failed', err));
    });
}

// --- Global State ---
let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';
let stream = null;

// --- App Initialization (The "Blank Screen" Fix) ---
window.addEventListener('load', () => {
    // 1. Theme Initialization
    const savedTheme = localStorage.getItem('pulpTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeText = document.getElementById('themeText');
        if (themeText) themeText.innerText = 'Light Mode';
    }

    // 2. Data Rendering
    renderHistory();
    renderFavorites();

    // 3. Splash Screen Clearance
    // We use a safe timeout to ensure the UI transitions after the logo animation
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log("Pulp Pro: Interface Ready");
        
        const codeInput = document.getElementById('codeIn');
        if (codeInput) codeInput.focus();
    }, 2500);
});

// Emergency Override: If the app is still blank after 5 seconds, force show
setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
        console.warn("Pulp Pro: Emergency load triggered.");
    }
}, 5000);

// --- Navigation Logic ---
function switchView(targetId) {
    // Hide all views
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    const appInterface = document.getElementById('appInterface');
    if (appInterface) appInterface.style.display = 'none';

    // Show target
    if (targetId === 'appInterface') {
        if (appInterface) {
            appInterface.style.display = 'flex';
            setTimeout(() => {
                const codeIn = document.getElementById('codeIn');
                if (codeIn) codeIn.focus();
            }, 100);
        }
    } else {
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
    }
}

function showHub() { 
    switchView('fruit-hub'); 
    renderFavorites(); 
}

function openMiddleHub(fruit) {
    activeFruit = fruit;
    if (fruit === 'defects') {
        switchView('defects-hub');
        return;
    }
    switchView('middle-hub');
    const title = fruit.charAt(0).toUpperCase() + fruit.slice(1);
    const middleTitle = document.getElementById('middleHubTitle');
    const brandsBtn = document.getElementById('brandsBtn');
    if (middleTitle) middleTitle.innerText = `${title} Menu`;
    if (brandsBtn) brandsBtn.innerText = `${title} Brands`;
}

// --- Scanner Module ---
async function openDefectScanner(commodity) {
    activeFruit = commodity.toLowerCase();
    const scannerTitle = document.getElementById('scanner-title');
    const video = document.getElementById('scanner-video');
    
    if (scannerTitle) scannerTitle.innerText = `SCANNING ${commodity.toUpperCase()}`;
    
    try {
        // Request camera first
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        if (video) {
            video.srcObject = stream;
            // Only switch view when camera is ready
            video.onloadedmetadata = () => {
                video.play();
                switchView('scanner-view');
            };
        }
    } catch (err) {
        console.error("Camera Error:", err);
        alert("Camera access denied or unavailable. Please use HTTPS and grant permissions.");
        switchView('defects-hub');
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
    const status = document.getElementById('scan-status');
    const dots = document.querySelectorAll('.dot');
    
    if (burstUI) burstUI.classList.remove('hidden');
    if (status) status.innerText = "BURSTING...";
    
    let count = 0;
    const interval = setInterval(() => {
        if(count < dots.length) {
            dots[count].classList.add('active');
            count++;
        }
    }, 400);

    setTimeout(() => {
        clearInterval(interval);
        if (burstUI) burstUI.classList.add('hidden');
        dots.forEach(d => d.classList.remove('active'));
        if (status) status.innerText = "ANALYZING...";
        
        // Results logic placeholder
        alert(`Burst analysis complete for ${activeFruit}. Processing results...`);
    }, 2200);
}

// --- Brand & Calculation Logic ---
function openBrands(fruit) {
    activeFruit = fruit;
    switchView('brand-hub');
    const grid = document.getElementById('brandGrid');
    if (!grid) return;

    if (fruit === 'banana') {
        grid.innerHTML = `
            <div class="list-btn" onclick="openCalc('Chiquita')">Chiquita</div>
            <div class="list-btn disabled">Fyffes (Soon)</div>
            <div class="list-btn disabled">Favorita (Soon)</div>
        `;
    } else {
        grid.innerHTML = `<div style="opacity:0.5; padding:20px;">Logic for ${fruit} brands coming soon.</div>`;
    }
}

function openCalc(brand, fruit = activeFruit) {
    activeBrand = brand;
    activeFruit = fruit;
    switchView('appInterface');
    const brandLabel = document.getElementById('brandName');
    const commodityLabel = document.getElementById('commodityLabel');
    const input = document.getElementById('codeIn');
    const resBox = document.getElementById('resBox');

    if (brandLabel) brandLabel.innerText = brand;
    if (commodityLabel) commodityLabel.innerText = `${activeFruit.toUpperCase()} AGE CHECKER`;
    if (input) input.value = '';
    if (resBox) resBox.classList.add('hidden');
    
    updateFavoriteUI();
    renderHistory();
}

// --- UI Helpers ---
function toggleMenu() {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-overlay');
    if (drawer) drawer.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('pulpTheme', isLight ? 'light' : 'dark');
    const themeText = document.getElementById('themeText');
    if (themeText) themeText.innerText = isLight ? 'Light Mode' : 'Dark Mode';
}

function checkFruit(historicalCode = null) {
    const inputField = document.getElementById('codeIn');
    const val = historicalCode || inputField.value.toUpperCase();
    if (historicalCode && inputField) inputField.value = historicalCode;
    
    const box = document.getElementById('resBox');
    if (val.length < 3) {
        if (box) box.classList.add('hidden');
        if (!historicalCode) triggerShake();
        return;
    }

    const mChar = val.charCodeAt(0), dChar = val.charCodeAt(1), yDigit = val.charAt(2);
    const isValid = (mChar >= 65 && mChar <= 76) && (dChar >= 65 && dChar <= 90) && (yDigit === '1' || yDigit === '2');
    
    if (!isValid) {
        if (box) box.classList.add('hidden');
        triggerShake();
        return;
    }

    const now = new Date(), m = mChar - 65;
    let d = dChar - 64; if (yDigit === '2') d += 26;
    let hDate = new Date(now.getFullYear(), m, d);
    if (hDate > now) hDate.setFullYear(now.getFullYear() - 1);
    
    const diff = Math.floor((now - hDate) / (1000*60*60*24));
    
    document.getElementById('daysValue').innerText = diff;
    document.getElementById('dateText').innerText = hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    
    const label = document.getElementById('statusLabel');
    let statusColor = "";
    if (box) box.classList.remove('hidden');

    if (diff > 31) {
        if (label) label.innerText = "TOO OLD";
        if (box) box.className = 'result-display bg-old';
        statusColor = "#ff4d4d";
    } else if (diff <= 21) {
        if (label) label.innerText = "PERFECT";
        if (box) box.className = 'result-display bg-perfect';
        statusColor = "#a6e22e";
    } else {
        if (label) label.innerText = "ACCEPTABLE";
        if (box) box.className = 'result-display bg-acceptable';
        statusColor = "#ff8c00";
    }

    if (!historicalCode) {
        saveToHistory(val, diff, statusColor);
        inputField.blur();
    }
    renderHistory();
}

function triggerShake() {
    const card = document.getElementById('appCard');
    if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 400);
    }
}

// --- History & Favorites Rendering ---
function renderHistory() {
    const list = document.getElementById('historyList');
    const section = document.getElementById('historySection');
    if (!list || !section) return;

    if (scanHistory.length === 0) {
        section.style.display = "none";
        return;
    }
    section.style.display = "block";
    list.innerHTML = `<div class="archive-title">ARCHIVE</div>` + scanHistory.map(item => `
        <div class="log-item" onclick="checkFruit('${item.code}')">
            <div class="log-code">${item.code} <small>${item.brand || ''}</small></div>
            <div class="log-meta">
                <span style="color:${item.color}; font-weight:900;">${item.days}D</span>
                <span class="log-timestamp">${item.timestamp}</span>
            </div>
        </div>
    `).join('');
}

function saveToHistory(code, days, color) {
    const now = new Date();
    const ts = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`.toUpperCase();
    scanHistory.unshift({ code, days, color, timestamp: ts, brand: activeBrand });
    if (scanHistory.length > 25) scanHistory.pop();
    localStorage.setItem('pulpProHistory', JSON.stringify(scanHistory));
}

function updateFavoriteUI() {
    const id = `${activeFruit}_${activeBrand}`;
    const isFav = favorites.some(f => f.id === id);
    const star = document.getElementById('favStar');
    if (star) star.classList.toggle('active', isFav);
}

function renderFavorites() {
    const section = document.getElementById('favorites-section');
    const grid = document.getElementById('fav-grid');
    if (!section || !grid) return;

    if (favorites.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');
    grid.innerHTML = favorites.map(f => `
        <div class="fav-card" onclick="openCalc('${f.brand}', '${f.fruit}')">
            <i class="bi bi-star-fill"></i>
            <span>${f.brand}</span>
            <small>${f.fruit.toUpperCase()}</small>
        </div>
    `).join('');
}

function clearHistory() { 
    if(confirm("Wipe logs?")) { 
        scanHistory = []; 
        localStorage.removeItem('pulpProHistory'); 
        renderHistory(); 
    } 
}
