let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';
let activeDefectFruit = ''; 
let stream = null; 
let defectData = null; 
let currentDetectedDefect = null;

// Initialize App
window.addEventListener('load', () => {
    // 1. Fetch JSON
    fetch('defects.json')
        .then(res => res.json())
        .then(data => { defectData = data; })
        .catch(err => console.warn("Missing defects.json"));

    // 2. Initial Render
    renderHistory();
    renderFavorites();

    // 3. Clear Splash Screen
    setTimeout(() => {
        document.body.classList.add('loaded');
        switchView('fruit-hub'); // Ensure we start at the hub
    }, 2800);
});

// --- NAVIGATION CORE ---
function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });
    
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.remove('hidden');
        // Handle flexbox for the age checker interface
        target.style.display = (targetId === 'appInterface' || targetId === 'fruit-hub') ? 'flex' : 'block';
    }
}

function showHub() { 
    stopScan(); 
    switchView('fruit-hub'); 
}

// --- DEFECT LOGIC ---
function openDefectDetection() { switchView('defect-detection-hub'); }

function startScan(fruit) {
    activeDefectFruit = fruit;
    document.getElementById('scannerTitle').innerText = `Scanning ${fruit.toUpperCase()}`;
    document.getElementById('defectResultPopup').classList.add('hidden');
    switchView('scanner-view');

    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(s => { stream = s; video.srcObject = stream; })
    .catch(err => alert("Camera permission required."));
}

async function startBurstScan() {
    const btn = document.getElementById('captureBtn');
    const status = document.getElementById('scanStatus');
    const progressBar = document.getElementById('scanProgressBar');
    
    document.getElementById('defectResultPopup').classList.add('hidden');
    btn.disabled = true;
    document.getElementById('scanProgressContainer').style.display = 'block';
    status.innerText = "CAPTURING...";
    
    let frames = 0;
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progressBar.style.width = `${(elapsed / duration) * 100}%`;
        frames++;
        if (elapsed >= duration) {
            clearInterval(interval);
            processResults(frames);
        }
    }, 100);
}

function processResults(count) {
    const available = defectData ? defectData[activeDefectFruit] : null;
    if (available && available.length > 0) {
        currentDetectedDefect = available[Math.floor(Math.random() * available.length)];
        document.getElementById('detectedDefectName').innerText = currentDetectedDefect.name.toUpperCase();
        document.getElementById('defectResultPopup').classList.remove('hidden');
    }
    document.getElementById('captureBtn').disabled = false;
    document.getElementById('scanProgressContainer').style.display = 'none';
    document.getElementById('scanStatus').innerText = "DONE";
}

function showDefectDetails() {
    if (!currentDetectedDefect) return;
    document.getElementById('detailName').innerText = currentDetectedDefect.name;
    document.getElementById('detailCause').innerText = currentDetectedDefect.cause;
    document.getElementById('detailStorage').innerText = currentDetectedDefect.storage_advice;
    document.getElementById('detailAction').innerText = currentDetectedDefect.further_action;
    switchView('defect-detail-view');
}

function stopScan() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    switchView('defect-detection-hub');
}

// --- AGE CHECKER LOGIC ---
function openMiddleHub(fruit) {
    activeFruit = fruit;
    switchView('middle-hub');
    document.getElementById('middleHubTitle').innerText = fruit.toUpperCase();
}

function openBrands(fruit) {
    switchView('brand-hub');
    const grid = document.getElementById('brandGrid');
    if (fruit === 'banana') {
        grid.innerHTML = `<div class="list-btn" onclick="openCalc('Chiquita')">Chiquita</div>`;
    } else {
        grid.innerHTML = `<div class="list-btn disabled">No brands yet</div>`;
    }
}

function openCalc(brand) {
    activeBrand = brand;
    switchView('appInterface');
    document.getElementById('brandName').innerText = brand;
}

function checkFruit() {
    const input = document.getElementById('codeIn');
    const val = input.value.toUpperCase();
    const box = document.getElementById('resBox');
    if (val.length < 3) return;

    const now = new Date();
    const hDate = new Date(now.getFullYear(), val.charCodeAt(0)-65, val.charCodeAt(1)-64);
    const diff = Math.floor((now - hDate) / (1000*60*60*24));

    document.getElementById('daysValue').innerText = diff;
    document.getElementById('dateText').innerText = hDate.toLocaleDateString();
    box.classList.remove('hidden');
}

// --- UTILS ---
function toggleMenu() {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('pulpTheme', isLight ? 'light' : 'dark');
}
function renderHistory() {}
function renderFavorites() {}
function toggleMenuFavs() { document.getElementById('menu-fav-list').classList.toggle('show'); }
