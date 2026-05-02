let activeFruit = '';
let activeBrand = '';
let stream = null;
let defectData = null;
let currentDetectedDefect = null;

// The "Fail-Safe" Initialization
function init() {
    // Attempt to load JSON, but don't let a failure stop the app
    fetch('defects.json')
        .then(res => res.json())
        .then(data => { defectData = data; })
        .catch(e => console.warn("JSON file missing"));

    // Force splash screen to hide after 2.5 seconds no matter what
    setTimeout(() => {
        document.body.classList.add('loaded');
        switchView('fruit-hub');
    }, 2500);
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Core Navigation
function switchView(id) {
    document.querySelectorAll('.nav-view').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
        target.style.display = (id === 'fruit-hub' || id === 'appInterface') ? 'flex' : 'block';
    }
}

function showHub() { 
    stopScan(); 
    switchView('fruit-hub'); 
}

// Age Checker Logic (Your Master Logic)
function openMiddleHub(fruit) {
    activeFruit = fruit;
    document.getElementById('middleHubTitle').innerText = fruit.toUpperCase();
    switchView('middle-hub');
}

function openBrands(fruit) {
    const grid = document.getElementById('brandGrid');
    grid.innerHTML = (fruit === 'banana') ? 
        `<div class="list-btn" onclick="openCalc('Chiquita')">Chiquita</div>` : 
        `<div class="list-btn disabled">Soon</div>`;
    switchView('brand-hub');
}

function openCalc(brand) {
    activeBrand = brand;
    document.getElementById('brandName').innerText = brand;
    switchView('appInterface');
}

function checkFruit() {
    const val = document.getElementById('codeIn').value.toUpperCase();
    if (val.length < 3) return;
    const now = new Date();
    const hDate = new Date(now.getFullYear(), val.charCodeAt(0)-65, val.charCodeAt(1)-64);
    const diff = Math.floor((now - hDate) / 86400000);
    document.getElementById('daysValue').innerText = diff;
    document.getElementById('dateText').innerText = hDate.toLocaleDateString();
    document.getElementById('resBox').classList.remove('hidden');
}

// Defect Detection logic
function openDefectDetection() {
    activeFruit = 'banana'; // Defaulting to banana for now
    switchView('scanner-view');
    startCamera();
}

function startCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => { stream = s; video.srcObject = stream; })
        .catch(e => alert("Camera permission required."));
}

function startBurstScan() {
    const bar = document.getElementById('scanProgressBar');
    const container = document.getElementById('scanProgressContainer');
    document.getElementById('defectResultPopup').classList.add('hidden');
    
    container.style.display = 'block';
    let start = Date.now();
    let timer = setInterval(() => {
        let elapsed = Date.now() - start;
        bar.style.width = (elapsed / 2000) * 100 + '%';
        if (elapsed >= 2000) {
            clearInterval(timer);
            container.style.display = 'none';
            processResults();
        }
    }, 100);
}

function processResults() {
    if (defectData && defectData.banana) {
        currentDetectedDefect = defectData.banana[Math.floor(Math.random() * defectData.banana.length)];
        document.getElementById('detectedDefectName').innerText = currentDetectedDefect.name.toUpperCase();
        document.getElementById('defectResultPopup').classList.remove('hidden');
    }
}

function showDefectDetails() {
    document.getElementById('detailName').innerText = currentDetectedDefect.name;
    document.getElementById('detailCause').innerText = currentDetectedDefect.cause;
    document.getElementById('detailStorage').innerText = currentDetectedDefect.storage_advice;
    document.getElementById('detailAction').innerText = currentDetectedDefect.further_action;
    switchView('defect-detail-view');
}

function stopScan() {
    if (stream) stream.getTracks().forEach(t => t.stop());
}

function toggleMenu() {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}
