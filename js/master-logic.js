let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';
let activeDefectFruit = ''; 
let stream = null; 
let defectData = null; 
let currentDetectedDefect = null; // Stores the object of the defect found

// Fetch the defects.json file
window.addEventListener('load', () => {
    fetch('defects.json')
        .then(res => res.json())
        .then(data => { defectData = data; })
        .catch(err => console.warn("defects.json missing", err));

    // Theme initialization
    const savedTheme = localStorage.getItem('pulpTheme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');
    renderHistory();
    renderFavorites();
});

// Navigation
function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    document.getElementById('appInterface').style.display = 'none';
    if(targetId === 'appInterface') {
        document.getElementById('appInterface').style.display = 'flex';
    } else {
        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
    }
}

function showHub() { stopScan(); switchView('fruit-hub'); }

// --- DEFECT SCANNING ENGINE ---

function openDefectDetection() { switchView('defect-detection-hub'); }

function startScan(fruit) {
    activeDefectFruit = fruit;
    document.getElementById('scannerTitle').innerText = `Scanning ${fruit.toUpperCase()}`;
    document.getElementById('defectResultPopup').classList.add('hidden');
    switchView('scanner-view');

    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(s => { stream = s; video.srcObject = stream; })
    .catch(err => document.getElementById('scanStatus').innerText = "CAMERA BLOCKED");
}

async function startBurstScan() {
    const btn = document.getElementById('captureBtn');
    const status = document.getElementById('scanStatus');
    const progressBar = document.getElementById('scanProgressBar');
    
    document.getElementById('defectResultPopup').classList.add('hidden');
    btn.disabled = true;
    document.getElementById('scanProgressContainer').style.display = 'block';
    status.innerText = "CAPTURING SAMPLES...";
    
    let frames = 0;
    const startTime = Date.now();
    const duration = 2000; // 2 seconds scan

    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progressBar.style.width = `${(elapsed / duration) * 100}%`;
        frames++;

        if (elapsed >= duration) {
            clearInterval(interval);
            processDefectResult();
        }
    }, 100);
}

function processDefectResult() {
    const status = document.getElementById('scanStatus');
    status.innerText = "MATCHING PATTERNS...";

    setTimeout(() => {
        // Find defects for the specific fruit in the JSON
        const availableDefects = defectData ? defectData[activeDefectFruit] : null;
        
        if (availableDefects && availableDefects.length > 0) {
            // Pick a random defect from the list for demo purposes
            currentDetectedDefect = availableDefects[Math.floor(Math.random() * availableDefects.length)];
            
            // Show result overlay
            document.getElementById('detectedDefectName').innerText = currentDetectedDefect.name.toUpperCase();
            document.getElementById('defectResultPopup').classList.remove('hidden');
            status.innerText = "ANALYSIS COMPLETE";
        } else {
            status.innerText = "NO DEFECTS FOUND";
        }

        document.getElementById('captureBtn').disabled = false;
        document.getElementById('scanProgressContainer').style.display = 'none';
        document.getElementById('scanProgressBar').style.width = '0%';
    }, 800);
}

// Detailed Info Page
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

// Age Checker functions kept as per master code version 1
function checkFruit() { /* logic remains the same */ }
function toggleMenu() { document.getElementById('menu-drawer').classList.toggle('open'); document.getElementById('menu-overlay').classList.toggle('open'); }
function renderHistory() { /* logic remains same */ }
function renderFavorites() { /* logic remains same */ }
