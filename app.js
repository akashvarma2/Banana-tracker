import { parseCode, calculateAge, getStatus } from './decoder.js';
import { getHistory, saveHistory } from './storage.js';

const el = {
  input: document.getElementById('codeIn'),
  button: document.getElementById('calcBtn'),
  resultBox: document.getElementById('resBox'),
  days: document.getElementById('daysValue'),
  date: document.getElementById('dateText'),
  status: document.getElementById('statusLabel'),
  history: document.getElementById('historyList')
};

el.button.addEventListener('click', handleCalculation);
el.input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleCalculation();
});

function handleCalculation() {
  const code = el.input.value.toUpperCase();

  const parsed = parseCode(code);
  if (!parsed) return shake();

  const { diffDays, harvestDate } = calculateAge(parsed);
  const status = getStatus(diffDays);

  updateUI(diffDays, harvestDate, status);
  saveToHistory(code, diffDays);

  renderHistory();
}

function updateUI(days, date, status) {
  el.resultBox.className = status.class;
  el.resultBox.classList.remove('hidden');

  el.days.textContent = days;
  el.date.textContent = date.toDateString();
  el.status.textContent = status.label;
}

function saveToHistory(code, days) {
  saveHistory({
    code,
    days,
    timestamp: new Date().toLocaleString()
  });
}

function renderHistory() {
  const history = getHistory();

  el.history.innerHTML = history.map(item => `
    <div class="log-item">
      <strong>${item.code}</strong> - ${item.days} days
    </div>
  `).join('');
}

function shake() {
  el.input.classList.add('shake');
  setTimeout(() => el.input.classList.remove('shake'), 300);
}

// init
renderHistory();
const ageBtn = document.getElementById('ageBtn');
const defectsBtn = document.getElementById('defectsBtn');
const backToMiddle = document.getElementById('backToMiddle');
const backHome = document.getElementById('backHome');

const middleHub = document.getElementById('middle-hub');
const defectsHub = document.getElementById('defects-hub');
const appInterface = document.getElementById('appInterface');

function show(view) {
  middleHub.classList.add('hidden');
  defectsHub.classList.add('hidden');
  appInterface.classList.add('hidden');

  document.getElementById(view).classList.remove('hidden');
}

// NAVIGATION
ageBtn.addEventListener('click', () => show('appInterface'));

defectsBtn.addEventListener('click', () => show('defects-hub'));

backToMiddle.addEventListener('click', () => show('middle-hub'));

backHome.addEventListener('click', () => show('middle-hub'));

// DEFECTS SELECTION
document.querySelectorAll('.selection-card').forEach(card => {
  card.addEventListener('click', () => {
    const fruit = card.dataset.fruit;
    alert(`Defects opened for: ${fruit}`);
  });
});
