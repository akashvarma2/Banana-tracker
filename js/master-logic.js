let activeFruit = '';
let activeBrand = '';
let stream = null;
let defectData = null;
let currentDetectedDefect = null;

// Initialize
window.onload = () => {
    fetch('defects.json')
        .then(res => res.json())
        .then(data => { defectData = data; })
        .catch(e => console.log("JSON Load Error"));

    setTimeout(() => {
        document.body.classList.add('loaded');
        switchView('fruit-hub');
    }, 2500);
};

// Navigation
function switchView(id) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
}

function showHub() { 
    stopScan(); 
    switchView('fruit-hub'); 
}

// Age Checker Logic
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

// Defect Detection Logic
function openDefectDetection() { switchView('scanner-view'); startCamera(); }

function startCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => { stream = s; video.srcObject = stream; })
        .catch(e => alert("Camera error"));
}

function startBurstScan() {
    const btn = document.getElementById('captureBtn');
    const bar = document.getElementById('scanProgressBar');
    document.getElementById('defectResultPopup').classList.add('hidden');
    
    btn.disabled = true;
    document.getElementById('scanProgressContainer').style.display = 'block';
    
    let start = Date.now();
    let timer = setInterval(() => {
        let elapsed = Date.now() - start;
        bar.style.width = (elapsed / 2000) * 100 + '%';
        if (elapsed >= 2000) {
            clearInterval(timer);
            btn.disabled = false;
            document.getElementById('scanProgressContainer').style.display = 'none';
            processDefect();
        }
    }, 100);
}

function processDefect() {
    // Simulating detection from JSON
    if (defectData && defectData.banana) {
        currentDetectedDefect = defectData.banana[Math.floor(Math.random() * defectData.banana.length)];
        document.getElementById('detectedDefectName').innerText = currentDetectedDefect.name.toUpperCase();
        document.getElementById('defectResultPopup').classList.remove('hidden');
    }
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
    if (stream) stream.getTracks().forEach(t => t.stop());
}

function toggleMenu() {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}
