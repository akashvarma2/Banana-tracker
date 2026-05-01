export function parseCode(code) {
  if (!/^[A-Z]{2}[12]$/.test(code)) return null;

  const mChar = code.charCodeAt(0);
  const dChar = code.charCodeAt(1);
  const cycle = code[2];

  const month = mChar - 65;
  let day = dChar - 64;

  if (cycle === '2') day += 26;

  return { month, day };
}

export function calculateAge({ month, day }) {
  const now = new Date();
  let harvestDate = new Date(now.getFullYear(), month, day);

  if (harvestDate > now) {
    harvestDate.setFullYear(now.getFullYear() - 1);
  }

  const diffDays = Math.floor((now - harvestDate) / (1000 * 60 * 60 * 24));

  return { diffDays, harvestDate };
}

export function getStatus(days) {
  if (days > 31) return { label: "TOO OLD", class: "bg-old" };
  if (days <= 21) return { label: "PERFECT", class: "bg-perfect" };
  return { label: "ACCEPTABLE", class: "bg-acceptable" };
}
