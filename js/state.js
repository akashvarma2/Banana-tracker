const state = {
    scanHistory: JSON.parse(localStorage.getItem('pulpProHistory')) || [],
    favorites: JSON.parse(localStorage.getItem('pulpProFavorites')) || [],
    activeFruit: '',
    activeBrand: ''
};

/* -------------------------
   GET STATE
--------------------------*/
export function getState() {
    return state;
}

/* -------------------------
   UPDATE STATE
--------------------------*/
export function saveState() {
    localStorage.setItem('pulpProHistory', JSON.stringify(state.scanHistory));
    localStorage.setItem('pulpProFavorites', JSON.stringify(state.favorites));
}

/* -------------------------
   HISTORY HELPERS
--------------------------*/
export function addHistory(entry) {
    state.scanHistory.unshift(entry);

    if (state.scanHistory.length > 25) {
        state.scanHistory.pop();
    }

    saveState();
}

/* -------------------------
   FAVORITES HELPERS
--------------------------*/
export function toggleFavorite(item) {
    const id = item.id;

    const index = state.favorites.findIndex(f => f.id === id);

    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push(item);
    }

    saveState();
}
