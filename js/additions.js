/**
 * Pulp Pro - Additions Module
 * Feature: AI Defect Detection
 * STRICT: Does not modify Master Logic.
 */

let currentScanCommodity = '';
let detectedData = null;

function openDefectDetection() {
    switchView('defect-hub');
}

function startScan(commodity) {
    currentScanCommodity = commodity; 
    document.getElementById('scanTitle').innerText = "Scan " + commodity.charAt(0).toUpperCase() + commodity.slice(1);
    document.getElementById('mini-result').classList.add('hidden');
    switchView('scan-view');
}

function triggerUpload() {
    document.getElementById('fileInput').click();
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show processing status
    document.getElementById('mini-result').classList.remove('hidden');
    document.getElementById('defectName').innerText = "Analyzing " + currentScanCommodity + "...";
    document.getElementById('severityBadge').innerText = "WAIT";

    try {
        const response = await fetch('defects.json');
        const data = await response.json();
        
        // Filter: Ensure we only look at defects for the selected commodity
        const commodityDefects = data.defects.filter(d => d.commodity.toLowerCase() === currentScanCommodity.toLowerCase());
        
        if (commodityDefects.length > 0) {
            // Simulation: Picking a defect from the filtered list
            detectedData = commodityDefects[Math.floor(Math.random() * commodityDefects.length)];
            displayMiniResult(detectedData);
        } else {
            document.getElementById('defectName').innerText = "No " + currentScanCommodity + " data found.";
        }
    } catch (error) {
        console.error("Error loading defects.json", error);
        alert("System Error: Ensure defects.json is in your main folder.");
    }
}

function displayMiniResult(defect) {
    document.getElementById('defectName').innerText = defect.name;
    const badge = document.getElementById('severityBadge');
    badge.innerText = defect.severity;
    
    // Theme-consistent colors for severity
    badge.style.backgroundColor = 'transparent';
    badge.style.border = '1px solid';
    if(defect.severity.toLowerCase() === 'high') {
        badge.style.color = 'var(--pulp-red)';
        badge.style.borderColor = 'var(--pulp-red)';
    } else if(defect.severity.toLowerCase() === 'medium') {
        badge.style.color = 'var(--pulp-amber)';
        badge.style.borderColor = 'var(--pulp-amber)';
    } else {
        badge.style.color = 'var(--pulp-lime)';
        badge.style.borderColor = 'var(--pulp-lime)';
    }
}

function openFullDetails() {
    if (!detectedData) return;
    
    document.getElementById('fullDefectName').innerText = detectedData.name;
    document.getElementById('defectCause').innerText = detectedData.cause;
    document.getElementById('defectHandling').innerText = detectedData.handling;
    document.getElementById('defectAction').innerText = detectedData.action;
    
    switchView('details-view');
}

function triggerCapture() {
    alert("Camera Access Required: Ensure your browser permissions allow camera use.");
    // In a production PWA, this would initialize the stream to #camera-preview
}
