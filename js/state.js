// Global app state (moved out of index.html safely)
export let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
export let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
export let activeFruit = '';
export let activeBrand = '';

// Save helpers (no logic change)
export function saveHistory() {
    localStorage.setItem('pulpProHistory', JSON.stringify(scanHistory));
}

export function saveFavorites() {
    localStorage.setItem('pulpProFavorites', JSON.stringify(favorites));
}

export function setActiveFruit(fruit) {
    activeFruit = fruit;
}

export function setActiveBrand(brand) {
    activeBrand = brand;
}
