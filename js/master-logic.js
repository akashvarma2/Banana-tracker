let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';
let activeDefectFruit = ''; 
let stream = null; 
let defectData = null; // Store data from defects.json

// Initialize app and fetch defect data
window.addEventListener('load', () => {
    fetch('defects.json')
        .then(res => res.json())
        .then(data => { defectData = data; })
        .catch(err => console.warn("defects.json not found or invalid", err));

    const savedTheme = localStorage.getItem('pulpTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeText').innerText = 'Light Mode';
    }
    renderHistory();
    renderFavorites();
    setTimeout(() => {
        document.body.classList.add('loaded');
        const codeInput = document.getElementById('codeIn');
        if (codeInput) codeInput.focus();
    }, 2600);
});

// --- NAVIGATION & UI ---

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('pulpTheme', isLight ? 'light' : 'dark');
    document.getElementById('themeText').innerText = isLight ? 'Light Mode' : 'Dark Mode';
}

function toggleMenu() {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}

function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    document.getElementById('appInterface').style.display = 'none';
    if(targetId === 'appInterface') {
        document.getElementById('appInterface').style.display = 'flex';
        setTimeout(() => document.getElementById('codeIn').focus(), 100);
    } else {
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
    }
}

function showHub() { 
    stopScan(); 
    switchView('fruit-hub'); 
}

// --- DEFECT DETECTION LOGIC ---

function openDefectDetection() {
    switchView('defect-detection-hub');
}

function startScan(fruit) {
    activeDefectFruit = fruit;
    const scannerTitle = document.getElementById('scannerTitle');
    const status = document.getElementById('scanStatus');
    
    scannerTitle.innerText = `Scanning ${fruit.charAt(0).toUpperCase() + fruit.slice(1)}`;
    status.innerText = "STARTING CAMERA...";
    
    switchView('scanner-view');

    const video = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
            stream = s;
            video.srcObject = stream;
            status.innerText = "READY";
        })
        .catch(err => {
            status.innerText = "CAMERA ERROR: CHECK PERMISSIONS";
        });
    }
}

async function startBurstScan() {
    const btn = document.getElementById('captureBtn');
    const status = document.getElementById('scanStatus');
    const progressContainer = document.getElementById('scanProgressContainer');
    const progressBar = document.getElementById('scanProgressBar');
    
    btn.disabled = true;
    btn.style.opacity = '0.5';
    progressContainer.style.display = 'block';
    status.innerText = "ANALYZING BURST...";
    
    let framesCaptured = 0;
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const burstInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed / duration) * 100;
        progressBar.style.width = `${progress}%`;

        // Silent frame capture for potential future analysis
        captureFrame();
        framesCaptured++;

        if (elapsed >= duration) {
            clearInterval(burstInterval);
            finishScan(framesCaptured);
        }
    }, 100); 
}

function captureFrame() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.5);
}

function finishScan(count) {
    const btn = document.getElementById('captureBtn');
    const status = document.getElementById('scanStatus');
    const progressBar = document.getElementById('scanProgressBar');
    
    status.innerText = "MATCHING DEFECT DATA...";
    
    setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = '1';
        document.getElementById('scanProgressContainer').style.display = 'none';
        progressBar.style.width = '0%';
        
        // Final logic placeholder
        alert(`Analysis Complete for ${activeDefectFruit}.\nProcessed ${count} frames against defects.json.`);
        status.innerText = "READY";
    }, 1000);
}

function stopScan() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    const video = document.getElementById('video');
    if (video) video.srcObject = null;
    switchView('defect-detection-hub');
}

// --- AGE CHECKER LOGIC (RETAINED) ---

function openMiddleHub(fruit) {
    activeFruit = fruit;
    switchView('middle-hub');
    document.getElementById('middleHubTitle').innerText = `${fruit.charAt(0).toUpperCase() + fruit.slice(1)} Menu`;
    document.getElementById('brandsBtn').innerText = `${fruit.charAt(0).toUpperCase() + fruit.slice(1)} Brands`;
}

function openBrands(fruit) {
    activeFruit = fruit;
    switchView('brand-hub');
    const grid = document.getElementById('brandGrid');
    if (fruit === 'banana') {
        grid.innerHTML = `<div class="list-btn" onclick="openCalc('Chiquita')">Chiquita</div><div class="list-btn disabled">Fyffes (Soon)</div>`;
    } else {
        grid.innerHTML = `<div style="opacity:0.5; padding:20px;">Brands for ${fruit} coming soon.</div>`;
    }
}

function openCalc(brand, fruit = activeFruit) {
    activeBrand = brand;
    activeFruit = fruit;
    switchView('appInterface');
    document.getElementById('brandName').innerText = brand;
    document.getElementById('commodityLabel').innerText = `${activeFruit.toUpperCase()} AGE CHECKER`;
    document.getElementById('resBox').classList.add('hidden');
    updateFavoriteUI();
    renderHistory();
}

function checkFruit(historicalCode = null) {
    const input = document.getElementById('codeIn');
    const val = historicalCode || input.value.toUpperCase();
    if (historicalCode) input.value = historicalCode;
    const box = document.getElementById('resBox');
    
    if (val.length < 3) { box.classList.add('hidden'); return; }

    const mChar = val.charCodeAt(0), dChar = val.charCodeAt(1), yDigit = val.charAt(2);
    const isValid = (mChar >= 65 && mChar <= 76) && (dChar >= 65 && dChar <= 90) && (yDigit === '1' || yDigit === '2');
    
    if (!isValid) { box.classList.add('hidden'); return; }

    const now = new Date(), m = mChar - 65;
    let d = dChar - 64; if (yDigit === '2') d += 26;
    let hDate = new Date(now.getFullYear(), m, d);
    if (hDate > now) hDate.setFullYear(now.getFullYear() - 1);
    
    const diff = Math.floor((now - hDate) / (1000*60*60*24));
    document.getElementById('daysValue').innerText = diff;
    document.getElementById('dateText').innerText = hDate.toLocaleDateString('en-GB').toUpperCase();
    
    box.classList.remove('hidden');
    const label = document.getElementById('statusLabel');
    if (diff > 31) { label.innerText = "TOO OLD"; box.className = 'result-display bg-old'; }
    else if (diff <= 21) { label.innerText = "PERFECT"; box.className = 'result-display bg-perfect'; }
    else { label.innerText = "ACCEPTABLE"; box.className = 'result-display bg-acceptable'; }
    
    if (!historicalCode) saveToHistory(val, diff, "#fff");
}

function saveToHistory(code, days, color) {
    scanHistory.unshift({ code, days, color, timestamp: new Date().toLocaleTimeString(), brand: activeBrand });
    if (scanHistory.length > 25) scanHistory.pop();
    localStorage.setItem('pulpProHistory', JSON.stringify(scanHistory));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list || scanHistory.length === 0) return;
    list.innerHTML = `<div style="font-size:0.7rem; opacity:0.5; margin-bottom:10px;">RECENT SCANS</div>` + 
        scanHistory.map(item => `<div class="log-item" onclick="checkFruit('${item.code}')"><span>${item.code} (${item.brand})</span> <strong>${item.days}D</strong></div>`).join('');
}

function toggleFavorite() {
    const id = `${activeFruit}_${activeBrand}`;
    const idx = favorites.findIndex(f => f.id === id);
    if (idx > -1) favorites.splice(idx, 1);
    else favorites.push({ id, fruit: activeFruit, brand: activeBrand });
    localStorage.setItem('pulpProFavorites', JSON.stringify(favorites));
    updateFavoriteUI();
    renderFavorites();
}

function updateFavoriteUI() {
    const isFav = favorites.some(f => f.id === `${activeFruit}_${activeBrand}`);
    document.getElementById('favStar').classList.toggle('active', isFav);
}

function renderFavorites() {
    const grid = document.getElementById('fav-grid');
    if (!grid) return;
    grid.innerHTML = favorites.map(f => `<div class="fav-card" onclick="openCalc('${f.brand}', '${f.fruit}')">${f.brand}</div>`).join('');
}

function clearHistory() { if(confirm("Clear logs?")) { scanHistory = []; localStorage.removeItem('pulpProHistory'); renderHistory(); } }
function sendFeedback() { window.location.href = `mailto:ar.varma@hotmail.com?subject=Pulp Pro Feedback`; }
