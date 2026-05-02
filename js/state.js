let scanHistory = JSON.parse(localStorage.getItem('pulpProHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('pulpProFavorites')) || [];
let activeFruit = '';
let activeBrand = '';

export function getState() {
    return {
        scanHistory,
        favorites,
        activeFruit,
        activeBrand
    };
}

export function setState(updates) {
    if (updates.scanHistory) scanHistory = updates.scanHistory;
    if (updates.favorites) favorites = updates.favorites;
    if (updates.activeFruit !== undefined) activeFruit = updates.activeFruit;
    if (updates.activeBrand !== undefined) activeBrand = updates.activeBrand;

    localStorage.setItem('pulpProHistory', JSON.stringify(scanHistory));
    localStorage.setItem('pulpProFavorites', JSON.stringify(favorites));
}
