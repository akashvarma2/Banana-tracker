let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
        const codeIn = document.getElementById('codeIn');
        if(codeIn) codeIn.focus();
    }, 2500);
});

function switchView(targetId) {
    document.querySelectorAll('.nav-view').forEach(v => v.classList.add('hidden'));
    const appInt = document.getElementById('appInterface');
    if(appInt) appInt.style.display = (targetId === 'appInterface') ? 'flex' : 'none';
    const target = document.getElementById(targetId);
    if(target && targetId !== 'appInterface') target.classList.remove('hidden');
}

function showHub() { switchView('fruit-hub'); }

function openMiddleHub(fruit) {
    activeFruit = fruit;
    if(fruit === 'banana') {
        openBrands('banana');
    } else {
        alert(fruit + " coming soon");
    }
}

function openBrands(fruit) {
    activeFruit = fruit;
    openCalc('Chiquita');
}

function openCalc(brand) {
    activeBrand = brand;
    switchView('appInterface');
}

function checkFruit() {
    const val = document.getElementById('codeIn').value.toUpperCase();
    const box = document.getElementById('resBox');
    if(val.length < 3) return;
    box.classList.remove('hidden');
    document.getElementById('daysValue').innerText = "21"; 
}

function toggleMenu() {
    document.getElementById('menu-drawer').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open');
}
