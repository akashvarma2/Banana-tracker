let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('pulpTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeText').innerText = 'Light Mode';
    }
    renderHistory();
    renderFavorites();
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.getElementById('codeIn').focus();
    }, 2600);
});

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

function toggleMenuFavs() {
    const list = document.getElementById('menu-fav-list');
    const icon = document.getElementById('favChevron');
    list.classList.toggle('show');
    icon.classList.toggle('bi-chevron-up');
    icon.classList.toggle('bi-chevron-down');
}

function sendFeedback() {
    const theme = document.body.classList.contains('light-theme') ? 'Light' : 'Dark';
    const historyCount = scanHistory.length;
    const subject = encodeURIComponent("Pulp Pro App Feedback");
    const body = encodeURIComponent(`Hi Team,\n\nI have some feedback for Pulp Pro:\n\n[Your feedback here]\n\n---\nApp Stats for Debugging:\nTheme: ${theme}\nLogged Scans: ${historyCount}\nPlatform: ${navigator.platform}`);
    window.location.href = `mailto:ar.varma@hotmail.com?subject=${subject}&body=${body}`;
}

function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    document.getElementById('appInterface').style.display = 'none';
    if(targetId === 'appInterface') {
        document.getElementById('appInterface').style.display = 'flex';
        setTimeout(() => document.getElementById('codeIn').focus(), 100);
    } else {
        document.getElementById(targetId).classList.remove('hidden');
    }
}

function showHub() { switchView('fruit-hub'); renderFavorites(); }

function openMiddleHub(fruit) {
    activeFruit = fruit;
    switchView('middle-hub');
    const title = fruit.charAt(0).toUpperCase() + fruit.slice(1);
    document.getElementById('middleHubTitle').innerText = `${title} Menu`;
    document.getElementById('brandsBtn').innerText = `${title} Brands`;
}

function openBrands(fruit) {
    activeFruit = fruit;
    switchView('brand-hub');
    const grid = document.getElementById('brandGrid');
    if (fruit === 'banana') {
        grid.innerHTML = `<div class="list-btn" onclick="openCalc('Chiquita')">Chiquita</div><div class="list-btn disabled">Fyffes (Soon)</div><div class="list-btn disabled">Favorita (Soon)</div><div class="list-btn disabled">Agrofair (Soon)</div><div class="list-btn disabled">Port (Soon)</div>`;
    } else {
        grid.innerHTML = `<div style="opacity:0.5; padding:20px;">Logic for ${fruit} brands coming soon.</div>`;
    }
}

function openCalc(brand, fruit = activeFruit) {
    activeBrand = brand;
    activeFruit = fruit;
    switchView('appInterface');
    document.getElementById('brandName').innerText = brand;
    document.getElementById('commodityLabel').innerText = `${activeFruit.toUpperCase()} AGE CHECKER`;
    document.getElementById('codeIn').value = '';
    document.getElementById('resBox').classList.add('hidden');
    updateFavoriteUI();
    renderHistory();
}

function toggleFavorite() {
    const id = `${activeFruit}_${activeBrand}`;
    const index = favorites.findIndex(f => f.id === id);
    if (index > -1) { favorites.splice(index, 1); } 
    else { favorites.push({ id, fruit: activeFruit, brand: activeBrand, page: 'Age Checker' }); }
    localStorage.setItem('pulpProFavorites', JSON.stringify(favorites));
    updateFavoriteUI();
    renderFavorites();
}

function updateFavoriteUI() {
    const id = `${activeFruit}_${activeBrand}`;
    const isFav = favorites.some(f => f.id === id);
    document.getElementById('favStar').classList.toggle('active', isFav);
}

function renderFavorites() {
    const section = document.getElementById('favorites-section');
    const grid = document.getElementById('fav-grid');
    const menuList = document.getElementById('menu-fav-list');
    if (favorites.length === 0) { section.classList.add('hidden'); menuList.innerHTML = `<div style="padding:10px; font-size:0.6rem; opacity:0.3;">NO SAVED FAVS</div>`; return; }
    section.classList.remove('hidden');
    grid.innerHTML = favorites.map(f => `<div class="fav-card" onclick="openCalc('${f.brand}', '${f.fruit}')"><i class="bi bi-star-fill"></i><span>${f.brand}</span><small style="opacity:0.5; font-size:0.55rem; font-weight:800; color:var(--text-main);">${f.fruit.toUpperCase()}</small></div>`).join('');
    menuList.innerHTML = favorites.map(f => `<div class="menu-fav-item" onclick="openCalc('${f.brand}', '${f.fruit}'); toggleMenu();">${f.brand}<span>(${f.page || 'Age Checker'})</span></div>`).join('');
}

const inputField = document.getElementById('codeIn');
inputField.addEventListener('input', () => { 
    document.getElementById('resBox').classList.add('hidden');
    renderHistory(); 
});

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkFruit();
    }
});

function handlePostCalculation() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        inputField.blur();
        const currentType = inputField.getAttribute('type');
        inputField.setAttribute('type', 'button'); 
        setTimeout(() => {
            inputField.setAttribute('type', currentType);
        }, 100);
    } else {
        inputField.select(); 
        inputField.focus();
    }
}

function checkFruit(historicalCode = null) {
    const val = historicalCode || inputField.value.toUpperCase();
    if (historicalCode) inputField.value = historicalCode;
    const box = document.getElementById('resBox');
    if (val.length < 3) {
        box.classList.add('hidden');
        if(!historicalCode) triggerShake();
        return;
    }
    const mChar = val.charCodeAt(0), dChar = val.charCodeAt(1), yDigit = val.charAt(2);
    const isValid = (mChar >= 65 && mChar <= 76) && (dChar >= 65 && dChar <= 90) && (yDigit === '1' || yDigit === '2');
    if (!isValid) {
        box.classList.add('hidden');
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
    box.classList.remove('hidden');
    if (diff > 31) { label.innerText = "TOO OLD"; box.className = 'result-display bg-old'; statusColor = "#ff4d4d"; }
    else if (diff <= 21) { label.innerText = "PERFECT"; box.className = 'result-display bg-perfect'; statusColor = "#a6e22e"; }
    else { label.innerText = "ACCEPTABLE"; box.className = 'result-display bg-acceptable'; statusColor = "#ff8c00"; }
    if (!historicalCode) {
        saveToHistory(val, diff, statusColor);
        handlePostCalculation();
    }
    renderHistory();
}

function triggerShake() {
    document.getElementById('appCard').classList.add('shake');
    setTimeout(()=>document.getElementById('appCard').classList.remove('shake'), 400);
}

function saveToHistory(code, days, color) {
    const now = new Date();
    const ts = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`.toUpperCase();
    scanHistory.unshift({ code, days, color, timestamp: ts, brand: activeBrand });
    if (scanHistory.length > 25) scanHistory.pop();
    localStorage.setItem('pulpProHistory', JSON.stringify(scanHistory));
}

function renderHistory() {
    const list = document.getElementById('historyList'), section = document.getElementById('historySection');
    const boxHidden = document.getElementById('resBox').classList.contains('hidden');
    if (scanHistory.length === 0) { section.style.display = "none"; return; }
    if (window.innerWidth >= 992) {
        section.style.display = "block";
    } else {
        section.style.display = boxHidden ? "none" : "block";
    }
    list.innerHTML = `<div style="font-size:0.75rem; font-weight:900; color:var(--pulp-lime); margin-bottom:15px; border-bottom:1px solid var(--border-glass); padding-bottom:8px;">ARCHIVE</div>` + scanHistory.map(item => `<div class="log-item" onclick="checkFruit('${item.code}')"><div class="log-code">${item.code} <small style="font-size:0.5rem; opacity:0.6;">${item.brand || ''}</small></div><div class="log-meta" style="text-align:right;"><span style="color:${item.color}; font-weight:900;">${item.days}D</span><span class="log-timestamp">${item.timestamp}</span></div></div>`).join('');
}

function copyResult() {
    const days = document.getElementById('daysValue').innerText;
    const date = document.getElementById('dateText').innerText;
    const code = document.getElementById('codeIn').value.toUpperCase();
    if (document.getElementById('resBox').classList.contains('hidden')) return;
    const plainText = `Pulp Pro Report\nCode: ${code}\nAge: ${days} Days\nHarvest Date: ${date}`;
    const htmlText = `
        <div style="font-family: sans-serif;">
            <p><strong>Pulp Pro Report</strong></p>
            <p>Code: <span style="color: #ff4d4d; font-weight: bold;">${code}</span></p>
            <p>Age: <span style="color: #ff4d4d; font-weight: bold;">${days} Days</span></p>
            <p>Harvest Date: ${date}</p>
        </div>
    `;
    try {
        const blobHTML = new Blob([htmlText], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/plain': blobText, 'text/html': blobHTML })];
        navigator.clipboard.write(data).then(() => { showCopySuccess(); }).catch(() => { navigator.clipboard.writeText(plainText).then(showCopySuccess); });
    } catch (err) { navigator.clipboard.writeText(plainText).then(showCopySuccess); }
}

function showCopySuccess() {
    const btn = document.getElementById('copyBtn');
    btn.classList.add('success');
    btn.innerHTML = `<i class="bi bi-check-lg"></i> **COPIED**`;
    setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = `<i class="bi bi-clipboard"></i> **COPY**`;
    }, 2000);
}

function clearHistory() { if(confirm("Wipe logs?")) { scanHistory = []; localStorage.removeItem('pulpProHistory'); renderHistory(); } }
