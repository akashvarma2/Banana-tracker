const HISTORY_KEY = 'pulpProHistory';

export function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

export function saveHistory(entry) {
  const history = getHistory();
  history.unshift(entry);

  if (history.length > 25) history.pop();

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
