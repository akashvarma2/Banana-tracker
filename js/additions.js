/**
 * ADDITIONS.JS 
 * Purpose: Handle the Defect Analysis results and Detail View
 */

let currentDetectedDefect = null;

// This replaces the placeholder function in your master-logic.js
function finishScan(count) {
    const btn = document.getElementById('captureBtn');
    const status = document.getElementById('scanStatus');
    const progressBar = document.getElementById('scanProgressBar');
    const popup = document.getElementById('defectResultPopup');
    
    status.innerText = "MATCHING DEFECT DATA...";
    
    setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = '1';
        document.getElementById('scanProgressContainer').style.display = 'none';
        progressBar.style.width = '0%';
        
        // 1. Get the list of defects for the current fruit from your master's defectData
        const list = defectData ? defectData[activeDefectFruit] : null;

        if (list && list.length > 0) {
            // 2. Select a defect (Simulating AI detection from your JSON)
            currentDetectedDefect = list[Math.floor(Math.random() * list.length)];
            
            // 3. Update the Popup UI
            document.getElementById('detectedDefectName').innerText = currentDetectedDefect.name;
            popup.classList.remove('hidden');
            status.innerText = "ANALYSIS COMPLETE";
        } else {
            status.innerText = "NO DATA FOR " + activeDefectFruit.toUpperCase();
            alert("No defect data found for this commodity in defects.json");
        }
    }, 1200);
}

// Logic to populate the Detail View
function showDefectDetails() {
    if (!currentDetectedDefect) return;

    // Fill the detail page with the JSON data
    document.getElementById('detailName').innerText = currentDetectedDefect.name;
    document.getElementById('detailFruitType').innerText = activeDefectFruit.toUpperCase() + " ANALYSIS";
    document.getElementById('detailCause').innerText = currentDetectedDefect.cause;
    document.getElementById('detailStorage').innerText = currentDetectedDefect.storage_advice;
    document.getElementById('detailAction').innerText = currentDetectedDefect.further_action;

    // Hide the popup and switch to the detail view
    document.getElementById('defectResultPopup').classList.add('hidden');
    switchView('defect-detail-view');
}
